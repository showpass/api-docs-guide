# Ticket Purchase Widget

Use `eventPurchaseWidget` to let customers select tickets for one event and proceed to checkout. The event is identified by its **slug**, such as `summer-concert` from `https://www.showpass.com/summer-concert/`.

## Before you start

[Load the SDK once](/sdk/sdk-getting-started) and wait for it to be ready. Use the button and error-handling pattern in that guide with the calls below.

## Open a modal

Call the widget from your button handler, without a container ID:

```javascript
window.showpass.tickets.eventPurchaseWidget("summer-concert", {
  "theme-primary": "#24727b",
  "keep-shopping": true,
});
```

`keep-shopping` changes the purchase widget's return button label. It does not link separate baskets.

## Embed one widget

Create the container, then call the SDK after the container and SDK are ready:

```html
<div id="event-widget"></div>
```

```javascript
window.showpass.tickets.eventPurchaseWidget(
  "summer-concert",
  { "theme-primary": "#24727b" },
  "event-widget"
);
```

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **slug** | String | Required | The unique slug of the event (e.g., `my-event-slug` from `showpass.com/my-event-slug/`) |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['show-specific-tickets']** | String | Optional | Comma-separated list of ticket type IDs to display (e.g., `'1234,5678'`) |
| **params['keep-shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button. Default: `true` |
| **params['tracking-id']** | String | Optional | Tracking link ID for affiliate tracking, password bypass, or hidden ticket access |
| **params['show-description']** | Boolean | Optional | Control event description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['customer_attribution_token']** | String | Partner integrations | Short-lived token that associates checkout with a customer connected through the Partner API. |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

## Partner customer attribution

If your backend uses the Showpass Partner API, request a fresh customer attribution token before opening checkout and pass it in `params`:

```javascript
showpass.tickets.eventPurchaseWidget(event.slug, {
  "customer_attribution_token": customerAttributionToken
});
```

The token binds the resulting Showpass basket and order to the linked Showpass customer. Checkout requires the payment organization to match the token's venue and remain within the Partner integration's current assignments. It rejects a browser authenticated as a different customer. It does not create a full Showpass login session; additional buyer information and payment requirements still apply.

See [Build a partner ticketing flow](/api/partner-api-integration-flow) for the server-to-server customer sync, token issuance, webhook, and order-management steps.

### Try it in the playground

Open the [Widget Playground](/sdk/widget-playground), select the same environment that issued your token, and enter an event slug whose payment organization matches the token's venue. Choose **Event tickets**, expand **Partner customer**, and paste the API response's `customer_attribution_token`. Select **Apply token**, then try the **Modal** or **Embedded** (mounted) preview.

The widget forwards the token to Showpass checkout, which includes it in the basket request body. The playground keeps the token in memory and clears it on reload or environment change. Use a fresh token after its one-hour expiry; do not paste your Partner credential here. Close and reopen an existing modal after changing the applied token.

### Start a new checkout

Applying or clearing a token changes the token held by your page. It does not discard items or change the customer attached to an existing Showpass basket. The Playground's **Clear token** control keeps that basket.

Use **Start new checkout** to discard the current basket before switching customers or returning to ordinary checkout. The SDK opens a Showpass-hosted confirmation dialog and closes existing widgets:

```javascript
const tickets = window.showpass?.tickets;
if (typeof tickets?.startNewCheckout !== "function") {
  showResetUnavailable();
} else {
  try {
    const completed = await tickets.startNewCheckout();
    // true: server expiry was verified (or there was no basket).
    // false: the user cancelled before an expiry request started.
    // Recreate previews using your current configuration and in-memory token.
    reopenPreviews();
    if (completed) showNewCheckoutReady();
  } catch {
    // Keep previews closed and offer a reset retry until the result is verified.
    showResetRetry();
  }
}
```

The old basket reference is cleared only after the server confirms expiry. Refused expiry, active purchases, holds, network errors, and unavailable hosted checkout do not report success. A lost response may mean the basket already expired; retrying verifies its state before proceeding.

The method returns `Promise<boolean>` and accepts an optional `{ signal: AbortSignal }`. Aborting rejects with `AbortError`; it stops waiting and cannot undo an expiry already confirmed by the user. The host must recreate its embedded previews after success or safe cancellation. Keep them closed after failure and offer retry.

The next basket uses the currently applied attribution token, or ordinary checkout if no token is applied. Ordinary checkout still respects the browser's authenticated session. Tokens remain in memory; never add them to URLs, storage, snippets, or persisted configuration.

Deploy the rebuilt SDK and hosted checkout together before enabling this flow. Capability-check older SDKs; a new SDK connected to older hosted checkout rejects when the confirmation handshake is unavailable.

## Multiple widgets and a shared basket

For admission, workshops, and experiences from the same Showpass organization, use buttons that open event and calendar widgets in modals. Customers can add an item, close the modal, open another offering, and return to [checkout](/sdk/checkout-widget) with the basket. Keep this flow on the same website and browser, before the basket expires.

**Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder.** This includes several purchase widgets, several calendars, or a mixture of the two. Separate inline widgets must not be relied on to maintain one synchronized basket.

A single inline widget is a different layout. Do not extend the modal recommendation to a mixture of inline and modal widgets without testing that exact flow. When several offerings need one basket, use modals throughout.

Before launch, test adding items in both orders, navigating between booking pages, and reopening checkout. Confirm that all expected items are present on desktop and mobile. A shared storage key or a cart-count display alone does not verify the complete basket flow.
