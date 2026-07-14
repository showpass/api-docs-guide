# Integration patterns

## Plain HTML

Load the canonical script once and wait for deferred scripts before binding the trigger.

~~~html
<script src="https://www.showpass.com/static/dist/sdk.js" defer></script>

<button id="buy-tickets" type="button">Buy tickets</button>
<p id="showpass-status" role="status" hidden></p>

<script>
  window.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("buy-tickets");
    const status = document.getElementById("showpass-status");
    let opening = false;

    button.addEventListener("click", async function () {
      if (opening) return;
      if (!window.showpass?.tickets) {
        status.textContent = "Ticket sales are temporarily unavailable.";
        status.hidden = false;
        return;
      }

      opening = true;
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
        opening = false;
        button.disabled = false;
      }
    });
  });
</script>
~~~

For an embedded widget, render the container before calling the SDK:

~~~html
<section aria-label="Upcoming events">
  <div id="showpass-calendar"></div>
</section>
~~~

~~~js
await window.showpass.tickets.calendarWidget(
  "venue-id-or-slug",
  { "theme-primary": "#24727b" },
  "showpass-calendar",
);
~~~

## Shared TypeScript loader

Copy [../assets/showpass-sdk.ts](../assets/showpass-sdk.ts) into the target application's shared client infrastructure. It provides:

- the canonical SDK URL;
- one module-level promise for concurrent callers;
- reuse of an SDK script already in flight;
- explicit load, error, and timeout handling;
- a retry path after a definitive failure;
- current widget and cart-listener types without modifying the application's global Window declaration.

Import loadShowpassSdk from that one module instead of putting a loader in every component. If the target already has a correct shared loader, preserve it and reconcile only missing behavior.

Keep the loader in client-only code. Calling it during SSR rejects with a clear error.

## React modal trigger

Load on demand, coalesce clicks while startup is in progress, report failures, and let the SDK own the modal.

~~~tsx
import { useRef, useState } from "react";
import { loadShowpassSdk } from "./showpass-sdk";

interface BuyTicketsButtonProps {
  eventSlug: string;
  themeColor: string;
}

export function BuyTicketsButton({
  eventSlug,
  themeColor,
}: BuyTicketsButtonProps) {
  const openingRef = useRef(false);
  const [isOpening, setIsOpening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const openWidget = async () => {
    if (openingRef.current) return;
    openingRef.current = true;
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
      openingRef.current = false;
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
~~~

The ref closes the same-render double-click window before React commits the disabled state. Use the target application's error reporting, translated strings, and button component when available.

The factory promise resolves after the first modal is shown, not when the purchase flow closes. Treat the guard as startup protection, not modal-session state. If an application has several programmatic launch sources, route them through one application-owned entry point.

## React or Next.js embedded calendar

For Next.js App Router, keep this in a client component. Generate a stable DOM-safe ID and mount only after commit.

~~~tsx
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
    () => "showpass-calendar-" + reactId.replace(/[^a-zA-Z0-9_-]/g, ""),
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
~~~

The SDK is imperative, not a React component library. The promise queue makes cleanup finish before a configuration change starts another factory call against the same container. Avoid frequent remounts and test React Strict Mode.

## React cart badge

The cart listener returns its own cleanup function.

~~~tsx
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
    errorMessage ?? (count === undefined ? null : count + " items in cart");

  if (!cartStatus) return null;
  return <span role="status">{cartStatus}</span>;
}
~~~

The listener is event-driven and does not prove the cart starts at zero. Keep the badge hidden, unknown, or hydrated from application-owned state until the first update arrives.

## Discovery API event cards

Read [public-api-to-widget.md](public-api-to-widget.md) before mapping API data into cards. The key boundary is simple:

- use Discovery API fields to render organizer-owned event listings;
- pass an event's slug to eventPurchaseWidget;
- let the SDK own purchase, cart, checkout, and redirect behavior.

Render plain-text fields through the framework. Do not inject API strings with unsanitized innerHTML.
