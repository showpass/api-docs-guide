import * as React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/shared/components/button";
import { consumeCheckoutResetIntent, getCheckoutResetUrl, runCheckoutRestart, startCheckoutReset } from "./checkout-restart";
import { WIDGET_ENVIRONMENTS, type WidgetEnvironment } from "./showpass-sdk";

interface PlaygroundCheckoutResetProps {
  environment: WidgetEnvironment;
  disabled: boolean;
}

export default function PlaygroundCheckoutReset({ environment, disabled }: PlaygroundCheckoutResetProps) {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const resetting = search.get("checkoutAction") === "reset";
  const completed = useLocation().state?.basketResetComplete === true;
  const config = WIDGET_ENVIRONMENTS[environment];
  const returnUrl = getCheckoutResetUrl(search);
  const iframe = React.useRef<HTMLIFrameElement>(null);
  const authorized = React.useRef(false);
  const [attempt, setAttempt] = React.useState(0);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const frame = iframe.current;
    if (!resetting || !frame || !config) return;
    if (!authorized.current) {
      authorized.current = consumeCheckoutResetIntent();
      if (!authorized.current) {
        setError("Reset hasn't started. Click Retry reset.");
        return;
      }
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    const resume = (event: PageTransitionEvent) => { if (event.persisted) window.location.reload(); };
    setError("");
    window.addEventListener("pagehide", abort);
    window.addEventListener("pageshow", resume);
    runCheckoutRestart(frame, {
      origin: config.origin,
      signal: controller.signal,
    }).then(() => {
      if (!controller.signal.aborted) navigate(returnUrl, { replace: true, preventScrollReset: true, state: { basketResetComplete: true } });
    }).catch((failure: unknown) => {
      if (!controller.signal.aborted) {
        setError(failure instanceof Error ? failure.message : "Basket reset could not be verified. Try again.");
      }
    });
    return () => { controller.abort(); window.removeEventListener("pagehide", abort); window.removeEventListener("pageshow", resume); };
  }, [attempt, config, navigate, resetting, returnUrl]);

  const reset = () => {
    if (!resetting) startCheckoutReset(search);
    else {
      authorized.current = true;
      setError("");
      setAttempt(value => value + 1);
    }
  };

  return <>
    <Button size="sm" variant="outline" disabled={disabled || (resetting && !error)} onClick={reset}>
      {error ? "Retry reset" : "Clear token & reset basket"}
    </Button>
    {resetting && <iframe ref={iframe} title="Reset test basket" hidden allow="storage-access *" referrerPolicy="origin" />}
    {error ? <p role="alert" className="w-full text-xs text-destructive">{error}</p>
      : resetting ? <p role="status" className="w-full text-xs">Resetting basket…</p>
      : completed ? <p role="status" className="w-full text-xs">Basket reset. Paste the next customer token.</p>
      : null}
  </>;
}
