export const CHECKOUT_RESET_MESSAGE = "showpass.playground.checkout-reset";

export class CheckoutRestartUnavailableError extends Error {
  constructor() {
    super("Reset test checkout is unavailable. Use dev.showpass.com for Production or Demo; local Playground builds require the local Showpass app. The reset update must also be deployed in the selected environment.");
    this.name = "CheckoutRestartUnavailableError";
  }
}

const PUBLIC_SETTINGS = ["environment", "eventId", "venueId", "productId", "memberId", "theme", "tab", "widget"];

export function getCheckoutResetUrl(search: URLSearchParams, reset: boolean): string {
  const query = new URLSearchParams();
  for (const key of PUBLIC_SETTINGS) {
    const value = search.get(key) ?? (key === "memberId" ? search.get("membershipId") : null);
    if (value) query.set(key, value);
  }
  if (reset) query.set("checkoutAction", "reset");
  const queryString = query.toString();
  return `/sdk/widget-playground${queryString ? `?${queryString}` : ""}`;
}

interface CheckoutRestartOptions {
  origin: string;
  signal: AbortSignal;
  onReady: () => void;
}

// This private bridge deliberately uses no SDK. The previous widget document
// must have been unloaded by a full navigation before mounting this iframe.
export function runCheckoutRestart(
  iframe: HTMLIFrameElement,
  { origin, signal, onReady }: CheckoutRestartOptions,
): Promise<boolean> {
  const aborted = () => new DOMException("Checkout reset was aborted.", "AbortError");
  if (signal.aborted) return Promise.reject(aborted());
  const parentOrigin = window.location.origin;
  const localPlayground = ["http://localhost:8080", "http://127.0.0.1:8080", "http://[::1]:8080"].includes(parentOrigin);
  const supportedOrigin = ["https://www.showpass.com", "https://demo.showpass.com", "https://localhost.showpass.com"].includes(origin);
  if (!window.crypto?.getRandomValues || !supportedOrigin || (parentOrigin !== "https://dev.showpass.com" && !(localPlayground && origin === "https://localhost.showpass.com"))) {
    return Promise.reject(new CheckoutRestartUnavailableError());
  }
  const requestId = Array.from(window.crypto.getRandomValues(new Uint32Array(4)), value => value.toString(16).padStart(8, "0")).join("");
  const url = new URL("/widget/playground/checkout-reset/", origin);
  url.searchParams.set("parentOrigin", window.location.origin);
  url.searchParams.set("requestId", requestId);

  return new Promise((resolve, reject) => {
    let ready = false;
    let settled = false;
    const timeout = window.setTimeout(() => finish(new CheckoutRestartUnavailableError()), 30_000);
    function finish(result: boolean | Error) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("message", receive);
      signal.removeEventListener("abort", abort);
      iframe.removeAttribute("src");
      if (result instanceof Error) reject(result);
      else resolve(result);
    }
    function abort() { finish(aborted()); }
    function receive(event: MessageEvent) {
      if (event.origin !== origin || event.source !== iframe.contentWindow || !event.data || typeof event.data !== "object") return;
      const message = event.data as { type?: unknown; requestId?: unknown; status?: unknown };
      if (message.type !== CHECKOUT_RESET_MESSAGE || message.requestId !== requestId) return;
      if (message.status === "ready") {
        if (ready) return;
        iframe.contentWindow?.postMessage({ type: CHECKOUT_RESET_MESSAGE, requestId, status: "initialize" }, origin);
        ready = true;
        window.clearTimeout(timeout);
        onReady();
      } else if (ready) {
        if (message.status === "complete") finish(true);
        else if (message.status === "cancelled") finish(false);
        else if (message.status === "failed") finish(new Error("The basket reset could not be verified. Retry before opening another preview."));
      }
    }
    window.addEventListener("message", receive);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else iframe.src = url.toString();
  });
}
