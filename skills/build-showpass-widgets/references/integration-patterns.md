# Integration patterns

## Plain HTML

Use the canonical script once and wait for deferred scripts before binding the trigger.

```html
<script src="https://www.showpass.com/static/dist/sdk.js" defer></script>

<button id="buy-tickets" type="button">Buy tickets</button>
<p id="showpass-status" role="status" hidden></p>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("buy-tickets");
    const status = document.getElementById("showpass-status");

    button.addEventListener("click", async function () {
      if (!window.showpass?.tickets) {
        status.textContent = "Ticket sales are temporarily unavailable.";
        status.hidden = false;
        return;
      }

      button.disabled = true;
      status.hidden = true;

      try {
        await window.showpass.tickets.eventPurchaseWidget("event-slug", {
          "theme-primary": "#24727b",
        });
      } catch (error) {
        console.error("Unable to open the Showpass widget", error);
        status.textContent = "Ticket sales are temporarily unavailable.";
        status.hidden = false;
      } finally {
        button.disabled = false;
      }
    });
  });
</script>
```

For an embedded widget, render the container first:

```html
<section aria-label="Upcoming events">
  <div id="showpass-calendar"></div>
</section>
```

Then pass its ID as the final argument:

```js
await window.showpass.tickets.calendarWidget(
  "venue-id-or-slug",
  { "theme-primary": "#24727b" },
  "showpass-calendar",
);
```

## Shared TypeScript loader

Keep one loader at application scope. Adapt the public method types to the methods the application actually uses.

```ts
const SHOWPASS_SDK_URL = "https://www.showpass.com/static/dist/sdk.js";
const SDK_LOADER_ATTRIBUTE = "data-showpass-sdk-loader";
const SDK_LOAD_TIMEOUT_MS = 15_000;

type WidgetParams = Record<string, string | number | boolean | undefined>;

interface WidgetHandle {
  unmount?: () => void;
}

interface ShowpassTickets {
  eventPurchaseWidget: (
    slug: string,
    params: WidgetParams,
    containerId?: string,
  ) => Promise<WidgetHandle>;
  calendarWidget: (
    venueIdOrSlug: string,
    params: WidgetParams,
    containerId?: string,
  ) => Promise<WidgetHandle>;
  addCartCountListener: (listener: (count: number) => void) => () => void;
}

declare global {
  interface Window {
    showpass?: { tickets: ShowpassTickets };
  }
}

let sdkPromise: Promise<ShowpassTickets> | undefined;

export function loadShowpassSdk(): Promise<ShowpassTickets> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Showpass SDK requires a browser"));
  }

  if (window.showpass?.tickets) {
    return Promise.resolve(window.showpass.tickets);
  }

  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const previous = document.querySelector<HTMLScriptElement>(
      `script[src="${SHOWPASS_SDK_URL}"]`,
    );
    const previousState = previous?.getAttribute(SDK_LOADER_ATTRIBUTE);
    const previousIsStale =
      previousState === "failed" || previousState === "loaded";
    const script =
      previous && !previousIsStale
        ? previous
        : document.createElement("script");

    if (previous && previousIsStale) {
      if (previous.nonce) script.nonce = previous.nonce;
      previous.remove();
    }

    let timeoutId: number | undefined;

    const cleanup = () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };

    const rejectLoad = (message: string) => {
      cleanup();
      script.setAttribute(SDK_LOADER_ATTRIBUTE, "failed");
      sdkPromise = undefined;
      reject(new Error(message));
    };

    const handleLoad = () => {
      if (window.showpass?.tickets) {
        cleanup();
        script.setAttribute(SDK_LOADER_ATTRIBUTE, "loaded");
        resolve(window.showpass.tickets);
        return;
      }
      rejectLoad("Showpass SDK loaded without exposing tickets");
    };

    const handleError = () => {
      rejectLoad("Unable to load the Showpass SDK");
    };

    const handleTimeout = () => {
      sdkPromise = undefined;
      reject(new Error("Timed out while loading the Showpass SDK"));
    };

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });
    script.setAttribute(SDK_LOADER_ATTRIBUTE, "loading");

    timeoutId = window.setTimeout(() => {
      if (window.showpass?.tickets) {
        handleLoad();
      } else {
        handleTimeout();
      }
    }, SDK_LOAD_TIMEOUT_MS);

    if (!previous || previousIsStale) {
      script.src = SHOWPASS_SDK_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return sdkPromise;
}
```

Do not put this loader inside every widget component. Import the shared function instead.

If the host or framework already inserted the canonical script, this loader attaches to that in-flight element instead of replacing it. A timed-out caller rejects, but the still-executable script remains globally in flight and later calls attach to it; only a definitive load/error result can make an element replaceable. Use only one loading strategy per application when possible.

## React modal trigger

Load on demand, coalesce clicks while startup is in progress, report failures, and let the SDK own the modal.

```tsx
import { useState } from "react";
import { loadShowpassSdk } from "./showpass-sdk";

interface BuyTicketsButtonProps {
  eventSlug: string;
  themeColor: string;
}

export function BuyTicketsButton({
  eventSlug,
  themeColor,
}: BuyTicketsButtonProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const openWidget = async () => {
    if (isOpening) return;
    setIsOpening(true);
    setErrorMessage(undefined);

    try {
      const tickets = await loadShowpassSdk();
      await tickets.eventPurchaseWidget(eventSlug, {
        "theme-primary": themeColor,
      });
    } catch (error) {
      console.error("Unable to open the Showpass widget", error);
      setErrorMessage("Ticket sales are temporarily unavailable.");
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <>
      <button type="button" onClick={openWidget} disabled={isOpening}>
        {isOpening ? "Opening…" : "Buy tickets"}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </>
  );
}
```

Use the target application's error-reporting and translated strings instead of copying the literal UI text when those systems exist.

The factory promise resolves after the first modal is shown, not when the entire purchase flow closes. `isOpening` prevents concurrent startup calls; it is not an end-to-end modal-session flag. The SDK overlay prevents ordinary repeat clicks once visible. If an application has multiple programmatic launch sources, route them through one application-owned entry point instead of treating `await eventPurchaseWidget(...)` as a close signal.

## React or Next.js embedded calendar

For Next.js App Router, keep this in a client component. Generate a stable DOM-safe ID and mount only after commit.

```tsx
"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { loadShowpassSdk } from "./showpass-sdk";

interface EmbeddedCalendarProps {
  venueId: string;
  themeColor: string;
}

export function EmbeddedCalendar({
  venueId,
  themeColor,
}: EmbeddedCalendarProps) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const mountQueue = useRef<Promise<void>>(Promise.resolve());
  const reactId = useId();
  const containerId = useMemo(
    () => `showpass-calendar-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [reactId],
  );

  useEffect(() => {
    let disposed = false;
    let unmount: (() => void) | undefined;
    setErrorMessage(undefined);

    mountQueue.current = mountQueue.current.then(async () => {
      if (disposed) return;

      try {
        const tickets = await loadShowpassSdk();
        if (disposed) return;

        const widget = await tickets.calendarWidget(
          venueId,
          { "theme-primary": themeColor },
          containerId,
        );

        if (disposed) {
          widget.unmount?.();
        } else {
          unmount = widget.unmount?.bind(widget);
        }
      } catch (error) {
        console.error("Unable to embed the Showpass calendar", error);
        if (!disposed) {
          setErrorMessage("The event calendar is temporarily unavailable.");
        }
      }
    });

    return () => {
      disposed = true;
      mountQueue.current = mountQueue.current.then(() => {
        try {
          unmount?.();
        } catch (error) {
          console.error("Unable to unmount the Showpass calendar", error);
        } finally {
          unmount = undefined;
        }
      });
    };
  }, [containerId, themeColor, venueId]);

  return (
    <>
      <div
        id={containerId}
        role="region"
        aria-label="Showpass event calendar"
      />
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </>
  );
}
```

The SDK is imperative, not a React component library. The promise queue makes cleanup finish before a configuration change starts another factory call against the same container. Avoid frequent option changes that repeatedly tear down and recreate embedded iframes. If the application needs dynamic configuration, make the remount intentional and test React Strict Mode.

## React cart badge

The listener returns its own cleanup function.

```tsx
import { useEffect, useState } from "react";
import { loadShowpassSdk } from "./showpass-sdk";

export function CartBadge() {
  const [count, setCount] = useState<number>();
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    let disposed = false;
    let removeListener: (() => void) | undefined;

    const subscribe = async () => {
      try {
        const tickets = await loadShowpassSdk();
        if (disposed) return;
        removeListener = tickets.addCartCountListener(setCount);
      } catch (error) {
        if (!disposed) {
          console.error("Unable to subscribe to the Showpass cart", error);
          setErrorMessage("Cart count unavailable.");
        }
      }
    };

    void subscribe();

    return () => {
      disposed = true;
      removeListener?.();
    };
  }, []);

  const cartStatus =
    errorMessage ?? (count === undefined ? null : `${count} items in cart`);

  if (!cartStatus) return null;

  return <span role="status">{cartStatus}</span>;
}
```

The listener is event-driven and does not prove the cart starts at zero. Keep the badge hidden, unknown, or hydrated from application-owned state until the first update arrives.

## Public API to widget

Use the Public API to render event cards, but pass the event `slug`—not its display name—to `eventPurchaseWidget`.

```ts
interface PublicEvent {
  name: string;
  slug: string;
  starts_on: string;
  timezone: string;
}

async function openEvent(event: PublicEvent) {
  const tickets = await loadShowpassSdk();
  await tickets.eventPurchaseWidget(event.slug, {});
}
```

Escape or render API content through the framework. Do not construct event cards with unsanitized `innerHTML`.
