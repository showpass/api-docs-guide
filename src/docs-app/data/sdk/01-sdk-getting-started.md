# Getting started with the Showpass SDK

Use the JavaScript SDK to open Showpass ticket, product, membership, calendar, and checkout widgets on your website. Your page must use HTTPS.

## Choose a display mode

| Mode | How it works | How to open it |
| --- | --- | --- |
| **Modal** | The widget opens over the current page, usually after a button click. | Omit `containerId`. |
| **Embedded (inline)** | The widget appears inside your page layout. | Pass the ID of an existing container element. |

For multiple offerings that customers should add to one basket, start with buttons that open modals. The [shared-basket guidance](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket) covers supported layouts and limitations.

## Load the SDK once

Use the canonical URL:

```html
<script src="https://www.showpass.com/static/dist/sdk.js" defer></script>
```

After loading, the SDK is available as `window.showpass.tickets`. Wait for it before calling a widget method. With the deferred script above, initialize your page at `DOMContentLoaded`; if you insert the script dynamically, wait for its `load` event instead.

## Connect a button

This plain HTML example loads the SDK, connects a button, and displays a message if the widget cannot open. Replace `your-event-slug` with your event's slug.

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
        await window.showpass.tickets.eventPurchaseWidget("your-event-slug", {
          "theme_primary": "#24727b",
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

The button is disabled while the widget opens. The returned promise resolves when the initial widget is shown, not when the customer finishes shopping or closes it.

## Embed a widget

Create the container before calling the SDK, then pass its ID as the final argument. Run this example after both the SDK and the page content are ready:

```html
<div id="event-widget"></div>
```

```javascript
window.showpass.tickets.eventPurchaseWidget(
  "your-event-slug",
  { "theme_primary": "#24727b" },
  "event-widget"
);
```

The widget guides below use this same pattern. Their examples show the widget call; use the loading and error handling above in your page integration. Pass `{}` when you do not need options.

## Choose a widget

| Customer task | Guide |
| --- | --- |
| Buy tickets for one event | [Ticket Purchase Widget](/sdk/ticket-purchase-widget) |
| Browse event dates or attraction time slots | [Calendar Widget](/sdk/event-calendar-widget) |
| Buy a product | [Product Purchase Widget](/sdk/product-purchase-widget) |
| Buy a membership or season pass | [Membership Purchase Widget](/sdk/membership-purchase-widget) |
| Review the basket and check out | [Checkout Widget](/sdk/checkout-widget) |
| Display the number of items in the cart | [Cart Quantity Listener](/sdk/cart-quantity-listener) |

## Integration checks and limitations

- Load the SDK once per page. In a client-rendered application, share the loader rather than adding a new script for each widget.
- Mount an embedded widget only after its container exists. Avoid repeated mounts into the same container.
- Keep a visible error or fallback action when loading fails; do not retry indefinitely.
- Choose one loading approach. `DOMContentLoaded` alone does not wait for a script loaded with `async` or inserted later.
- Do not use multiple inline SDK widgets on one page unless using Showpass Website Builder. Read the [shared-basket limitations](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket) before combining widgets.

## Parameter names and migration

Use snake_case for public widget options across SDK objects, widget URLs and WordPress shortcodes. Existing names continue working. See the [parameter naming and migration guide](/sdk/parameter-naming) for aliases, precedence and release availability.
