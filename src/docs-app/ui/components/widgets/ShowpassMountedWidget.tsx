import * as React from "react";
import { loadShowpassSdk, type ShowpassWidgetParams, type WidgetEnvironment } from "./showpass-sdk";

export interface ShowpassMountedWidgetProps {
  method: "eventPurchaseWidget" | "calendarWidget" | "productPurchaseWidget" | "membershipPurchaseWidget";
  label: string;
  id: string;
  themeColor?: string;
  className?: string;
  options?: ShowpassWidgetParams;
  environment?: WidgetEnvironment;
}

const EMPTY_OPTIONS: ShowpassWidgetParams = {};

const ShowpassMountedWidget = ({
  id,
  method,
  label,
  themeColor = "#24727b",
  className = "",
  options = EMPTY_OPTIONS,
  environment = "prod",
}: ShowpassMountedWidgetProps) => {
  const reactId = React.useId();
  const containerId = `showpass-widget-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const queue = React.useRef<Promise<void>>(Promise.resolve());
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let disposed = false;
    let unmount: (() => void) | undefined;
    setError("");
    queue.current = queue.current.then(async () => {
      if (disposed) return;
      try {
        const tickets = await loadShowpassSdk(environment);
        if (disposed) return;
        const widget = await tickets[method](id, {
          "theme-primary": themeColor,
          "keep-shopping": true,
          ...options,
        }, containerId);
        if (disposed) widget.unmount?.();
        else unmount = widget.unmount?.bind(widget);
      } catch {
        if (!disposed) setError("Unable to load the preview. Check the identifier and selected environment, then try again.");
      }
    });
    return () => {
      disposed = true;
      queue.current = queue.current.then(() => { unmount?.(); });
    };
  }, [id, method, themeColor, options, environment, containerId]);

  return (
    <>
      <div id={containerId} role="region" aria-label={label} className={`w-full ${className}`} />
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default ShowpassMountedWidget;
