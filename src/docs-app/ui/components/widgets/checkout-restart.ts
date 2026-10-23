export const CHECKOUT_RESET_MESSAGE = "showpass.playground.basket-reset";

export class CheckoutRestartUnavailableError extends Error {
  constructor() {
    super("Basket reset is unavailable. Check the selected environment and try again.");
    this.name = "CheckoutRestartUnavailableError";
  }
}

const PUBLIC_SETTINGS = ["environment", "eventId", "venueId", "productId", "memberId", "theme", "tab", "widget"];

export function getCheckoutResetUrl(search: URLSearchParams, action?: "reset"): string {
  const query = new URLSearchParams();
  for (const key of PUBLIC_SETTINGS) {
    const value = search.get(key) ?? (key === "memberId" ? search.get("membershipId") : null);
    if (value) query.set(key, value);
  }
  if (action) query.set("checkoutAction", action);
  const queryString = query.toString();
  return `/sdk/widget-playground${queryString ? `?${queryString}` : ""}`;
}

export function startCheckoutReset(search: URLSearchParams): void {
  // A reload unloads every old SDK widget. The history marker records the button
  // click without carrying a token or allowing a shared reset URL to expire a cart.
  window.history.replaceState({ ...window.history.state, playgroundBasketReset: Date.now() }, "", getCheckoutResetUrl(search, "reset"));
  window.location.reload();
}

export function consumeCheckoutResetIntent(): boolean {
  const state = window.history.state;
  if (typeof state?.playgroundBasketReset !== "number") return false;
  const { playgroundBasketReset, ...rest } = state;
  window.history.replaceState(rest, "");
  const age = Date.now() - playgroundBasketReset;
  return age >= 0 && age < 60_000;
}

interface CheckoutRestartOptions {
  origin: string;
  signal: AbortSignal;
}

// This private bridge deliberately uses no SDK. The previous widget document
// must have been unloaded by a full navigation before mounting this iframe.
export function runCheckoutRestart(
  iframe: HTMLIFrameElement,
  { origin, signal }: CheckoutRestartOptions,
): Promise<void> {
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
    let timeout = window.setTimeout(() => finish(new CheckoutRestartUnavailableError()), 30_000);
    const unverified = () => new Error("Basket reset could not be verified. Try again.");
    function finish(error?: Error) {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      window.removeEventListener("message", receive);
      signal.removeEventListener("abort", abort);
      iframe.removeAttribute("src");
      if (error) reject(error);
      else resolve();
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
        // Three basket requests each have a 30s timeout. Never leave the button
        // waiting forever if the helper disappears after becoming ready.
        timeout = window.setTimeout(() => finish(unverified()), 120_000);
      } else if (ready) {
        if (message.status === "complete") finish();
        else if (message.status === "failed") finish(unverified());
      }
    }
    window.addEventListener("message", receive);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    else iframe.src = url.toString();
  });
}
