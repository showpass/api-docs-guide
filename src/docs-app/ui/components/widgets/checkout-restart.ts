import type { ShowpassTickets } from "./showpass-sdk";

export class CheckoutRestartUnavailableError extends Error {
  constructor() {
    super("Starting a new checkout is unavailable with the loaded SDK. Update the SDK and reload the page.");
    this.name = "CheckoutRestartUnavailableError";
  }
}

interface CheckoutRestartOptions {
  signal: AbortSignal;
  onStart: () => void;
  onRestorePreviews: (completed: boolean) => void;
}

export async function runCheckoutRestart(
  tickets: Pick<ShowpassTickets, "startNewCheckout"> | undefined,
  { signal, onStart, onRestorePreviews }: CheckoutRestartOptions,
): Promise<boolean> {
  if (typeof tickets?.startNewCheckout !== "function") {
    throw new CheckoutRestartUnavailableError();
  }
  if (signal.aborted) throw new DOMException("Checkout reset was aborted.", "AbortError");
  onStart();
  const completed = await tickets.startNewCheckout({ signal });
  if (signal.aborted) throw new DOMException("Checkout reset was aborted.", "AbortError");
  if (completed !== true && completed !== false) {
    throw new Error("The SDK did not verify a checkout reset result.");
  }
  // Failed or aborted attempts must leave previews closed: reopening an iframe
  // could run automatic hydration before the old basket has been verified.
  onRestorePreviews(completed);
  return completed;
}
