# Membership Purchase Widget

Use `membershipPurchaseWidget` to let customers select a membership or season pass.

## Before you start

[Load the SDK once](/sdk/sdk-getting-started) and wait for it to be ready. The examples below show the calls to use with that guide's loading and error handling.

Use the membership identifier supplied by Showpass. If you cannot find it in the dashboard, ask Showpass support to confirm it before adding the widget.

## Open a modal

Call this from your button handler:

```javascript
window.showpass.tickets.membershipPurchaseWidget(789, {
  "theme_primary": "#24727b",
});
```

## Embed one widget

Create the container, then run the SDK call after both are ready:

```html
<div id="membership-widget"></div>
```

```javascript
window.showpass.tickets.membershipPurchaseWidget(
  789,
  { "theme_primary": "#24727b" },
  "membership-widget"
);
```

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **membershipId** | Integer | Required | The unique numerical ID of the membership |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme_primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['keep_shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button. Default: `true` |
| **params['show_description']** | Boolean | Optional | Control membership description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking_id']** | - | - | Currently not supported for membership widgets |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

## Layout limitations

Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder. For multiple offerings with one basket, use modal buttons and a visible checkout entry point. See [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket).
