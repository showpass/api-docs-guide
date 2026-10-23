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

**If you are signed in, your Showpass account must match the token’s customer.** To test different customers, use an incognito window and stay signed out. Reset basket keeps the current login.

### Reset a test checkout in the Playground

Applying or clearing a token changes the Playground setting. It does not discard items or change the customer attached to an existing Showpass basket. **Clear token** keeps that basket.

Use **Reset basket** beside **Apply token** and **Clear token**, inside **Partner customer**, before testing another customer:

1. Click **Reset basket**. It immediately starts resetting the basket, with progress shown below the token controls. There is no separate confirmation page or dialog.
2. The Playground refreshes to unload old widgets and clears both the pasted and applied token. Your public settings are kept. The old basket is expired and its reservations released.
3. When **Basket reset** appears, paste and apply the next customer's token, then select items to create a fresh basket. Leave the token empty to try ordinary checkout.

The saved basket reference is cleared only after the server confirms expiry. Refused expiry, active purchases, holds, network errors, and unavailable storage do not report success. Failed or unverified attempts keep previews closed and show **Retry reset** in the same section. A lost response may mean the basket already expired; retry verifies its state. Leaving the page cannot undo server expiry. A shared reset URL alone does not start a reset; the button must be clicked.

**Production uses real tickets.** This tool does not create a separate sandbox basket. It can affect another widget sharing the same stored basket in this browser and environment. Browser storage partitioning can change which contexts share it. Released tickets or seats may no longer be available when selected again. Use Demo for testing where possible and keep other checkout sessions idle.

Reset does not sign you out or switch Showpass accounts. A token for customer B can still be rejected if the browser is signed in as customer A. Ordinary checkout also respects the browser's authenticated session.

This is a Playground testing tool, not a public SDK method. The hosted reset helper must be deployed in the selected environment before using it; no new SDK release is needed. Hosted access is limited to `https://dev.showpass.com`; local Playground origins on port 8080 can reset only the local Showpass application. Tokens remain in memory and must never be added to URLs, storage, snippets, or persisted configuration.

## Multiple widgets and a shared basket

For admission, workshops, and experiences from the same Showpass organization, use buttons that open event and calendar widgets in modals. Customers can add an item, close the modal, open another offering, and return to [checkout](/sdk/checkout-widget) with the basket. Keep this flow on the same website and browser, before the basket expires.

**Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder.** This includes several purchase widgets, several calendars, or a mixture of the two. Separate inline widgets must not be relied on to maintain one synchronized basket.

A single inline widget is a different layout. Do not extend the modal recommendation to a mixture of inline and modal widgets without testing that exact flow. When several offerings need one basket, use modals throughout.

Before launch, test adding items in both orders, navigating between booking pages, and reopening checkout. Confirm that all expected items are present on desktop and mobile. A shared storage key or a cart-count display alone does not verify the complete basket flow.
