# Product Purchase Widget

Use `productPurchaseWidget` to let customers select a product and add it to their basket.

## Before you start

[Load the SDK once](/sdk/sdk-getting-started) and wait for it to be ready. The examples below show the calls to use with that guide's loading and error handling.

To locate your **productId**:

1. Log in to your **Showpass Dashboard**
2. Navigate to **Marketplace > Products**
3. Click to edit the desired product
4. The Product ID appears in the URL: `https://www.showpass.com/dashboard/inventory/products/PRODUCT_ID/edit/`

## Open a modal

Call this from your button handler:

```javascript
window.showpass.tickets.productPurchaseWidget(1234, {
  "theme_primary": "#24727b",
});
```

## Embed one widget

Create the container, then run the SDK call after both are ready:

```html
<div id="product-widget"></div>
```

```javascript
window.showpass.tickets.productPurchaseWidget(
  1234,
  { "theme_primary": "#24727b" },
  "product-widget"
);
```

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **productId** | Integer | Required | The unique numerical ID of the product |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme_primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['theme_secondary']** | String | Optional | Hex code for accent widget color |
| **params['theme_dark']** | Boolean | Optional | If `true`, displays the widget in dark theme |
| **params['keep_shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button. Default: `true` |
| **params['show_description']** | Boolean | Optional | Control product description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking_id']** | - | - | **Not supported** for product widgets |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

## Layout limitations

Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder. For multiple offerings with one basket, use modal buttons and a visible checkout entry point. See [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket).
