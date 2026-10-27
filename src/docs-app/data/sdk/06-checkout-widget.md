# Checkout Widget

Use `checkoutWidget` to open the current basket for order review and payment. Depending on the organization settings, the customer may also be asked to sign in.

## Before you start

[Load the SDK once](/sdk/sdk-getting-started) and wait for it to be ready. The examples below show the calls to use with that guide's loading and error handling.

Add items through the purchase or calendar widgets first. Checkout uses the browser's existing basket; this call does not create its contents.

## Open a modal

Call this from your button handler:

```javascript
window.showpass.tickets.checkoutWidget({
  "theme_primary": "#24727b",
});
```

## Embed one widget

Create the container, then run the SDK call after both are ready:

```html
<div id="checkout-widget"></div>
```

```javascript
window.showpass.tickets.checkoutWidget(
  { "theme_primary": "#24727b" },
  "checkout-widget"
);
```

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme_primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['keep_shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button (may behave differently in checkout flow). Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking_id']** | - | - | **Not supported** for checkout widget |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the checkout flow will mount |

## Layout limitations

Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder. For multiple offerings with one basket, use modal buttons and a visible checkout entry point. See [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket).
