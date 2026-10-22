import * as React from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/button";
import { useDocLayoutData } from "../layout/DocLayout";
import HeaderWithLink from "../content/HeaderWithLink";
import { getCheckoutResetUrl, runCheckoutRestart } from "./checkout-restart";
import { WIDGET_ENVIRONMENTS, type WidgetEnvironment } from "./showpass-sdk";

export default function PlaygroundCheckoutReset() {
  const [search] = useSearchParams();
  const { setPageData } = useDocLayoutData();
  const selected = search.get("environment") ?? "prod";
  const config = Object.prototype.hasOwnProperty.call(WIDGET_ENVIRONMENTS, selected)
    ? WIDGET_ENVIRONMENTS[selected as WidgetEnvironment] : undefined;
  const returnUrl = getCheckoutResetUrl(search, false);
  const iframe = React.useRef<HTMLIFrameElement>(null);
  const [attempt, setAttempt] = React.useState(0);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useLayoutEffect(() => {
    setPageData({ hideRightSidebar: true, tocItems: [], apiExamplesData: undefined, activeSection: undefined, pageTitle: "Widget Playground" });
  }, [setPageData]);

  React.useEffect(() => {
    const frame = iframe.current;
    if (!frame || !config) return;
    const controller = new AbortController();
    const abort = () => controller.abort();
    const resume = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    setReady(false);
    setError("");
    window.addEventListener("pagehide", abort);
    window.addEventListener("pageshow", resume);
    runCheckoutRestart(frame, {
      origin: config.origin,
      signal: controller.signal,
      onReady: () => setReady(true),
    }).then(() => {
      // Both verified completion and cancellation before expiry are safe to leave.
      if (!controller.signal.aborted) window.location.replace(returnUrl);
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) {
        setReady(false);
        setError(failure instanceof Error ? failure.message : "The basket reset could not be verified. Retry before opening another preview.");
      }
    });
    return () => { controller.abort(); window.removeEventListener("pagehide", abort); window.removeEventListener("pageshow", resume); };
  }, [attempt, config, returnUrl]);

  React.useEffect(() => { if (ready) iframe.current?.focus(); }, [ready]);

  return <div>
    <HeaderWithLink id="widget-playground" level={1}>Widget Playground</HeaderWithLink>
    <h2 className="mb-3 text-lg font-semibold">Reset test checkout — {config?.label ?? "unavailable environment"}</h2>
    <p className="mb-3">Your pasted token has been cleared. Confirm below to discard the old basket, then paste the next customer token after returning. Cancelling keeps the basket and reservations.</p>
    <p className="mb-3 text-sm">Reset does not sign you out. The next basket is created when you select items. Other widgets sharing this basket can be affected.</p>
    {selected === "prod" && <p role="alert" className="mb-4 rounded-md border border-destructive p-3">Production uses real tickets. Reset can release reservations from another widget sharing this browser basket. Released inventory cannot be restored by undoing reset. Demo is recommended for testing.</p>}
    {!config && <p role="alert">This environment is unavailable. Return to the Playground and select a supported environment.</p>}
    {config && <>
      {!ready && !error && <p role="status">Loading confirmation…</p>}
      <iframe ref={iframe} title={`Confirm ${config.label} test checkout reset`} allow="storage-access *" referrerPolicy="origin"
        className={ready ? "w-full min-h-[36rem] border-0" : "hidden"} />
      {error && <div role="alert" className="mt-3 space-y-3">
        <p>{error} Previews remain closed. Refreshing or leaving this page cannot undo an expiry already sent to the server.</p>
        <Button variant="outline" onClick={() => setAttempt(value => value + 1)}>Retry reset test checkout</Button>
      </div>}
    </>}
  </div>;
}
