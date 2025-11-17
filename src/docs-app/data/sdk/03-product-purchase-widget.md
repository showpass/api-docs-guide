# Product Purchase Widget

## Overview

The Product Purchase Widget displays a specific marketplace product (identified by its numerical `id`), allowing users to select options and add the product to their cart. It can be launched as a pop-up dialog or embedded directly into a webpage for seamless integration.

---

## SDK Function Signature

```javascript
// Pop-up mode - displays as a modal dialog
showpass.tickets.productPurchaseWidget(productId, params);

// Embedded mode - mounts into a container element
showpass.tickets.productPurchaseWidget(productId, params, containerId);
```

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- You need the product's unique numerical **ID**

---

## Finding the Product ID

To locate your **productId**:

1. Log in to your **Showpass Dashboard**
2. Navigate to **Marketplace > Products**
3. Click to edit the desired product
4. The Product ID appears in the URL: `https://www.showpass.com/dashboard/inventory/products/PRODUCT_ID/edit/`

---

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **productId** | Integer | Required | The unique numerical ID of the product |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['theme-secondary']** | String | Optional | Hex code for accent widget color |
| **params['theme-dark']** | Boolean | Optional | If `true`, displays the widget in dark theme |
| **params['keep-shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button. Default: `true` |
| **params['show-description']** | Boolean | Optional | Control product description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking-id']** | - | - | **Not supported** for product widgets |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

---

## Basic Usage Examples

These examples assume the Showpass SDK is already loaded. For production-ready code that handles SDK loading, see "Robust Implementation Examples" below.

### Pop-up Mode (Basic)

```javascript
// Define widget configuration
let params = {
  "theme-primary": "#5cb85c", // Green theme
  "theme-dark": false,
};

// Open the product widget as a pop-up
// Assuming 1234 is your product's ID
showpass.tickets.productPurchaseWidget(1234, params);
```

---

### Embedded Mode (Basic)

```html
<!-- Container element for the widget -->
<div id="product-widget-here"></div>

<script>
  // Configure and embed the widget
  let embedParams = { "theme-primary": "#f0ad4e" }; // Orange theme
  
  // Assuming 5678 is your product's ID
  showpass.tickets.productPurchaseWidget(
    5678,
    embedParams,
    "product-widget-here"
  );
</script>
```

> **Note:** These basic examples assume `showpass.tickets` is ready. For production environments, always use the robust implementation patterns below.

---

## Robust Implementation Examples

These examples include proper SDK availability checks to ensure reliable execution.

### Pop-up Mode (Robust)

This implementation attaches event listeners to buttons with the class `showpass-product-button` and reads the product ID from a `data-product-id` attribute.

**HTML:**

```html
<button class="showpass-product-button" data-product-id="1234">
  Buy Product 1
</button>
<button class="showpass-product-button" data-product-id="5678">
  Buy Product 2
</button>
```

**JavaScript:**

```javascript
function initializeProductWidgets() {
  const buttons = document.querySelectorAll(".showpass-product-button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const productId = parseInt(button.getAttribute("data-product-id"), 10);
      
      if (productId && window.showpass && window.showpass.tickets) {
        const params = {
          "theme-primary": "#17a2b8",
          "keep-shopping": true,
        };
        window.showpass.tickets.productPurchaseWidget(productId, params);
      } else {
        console.error("Showpass SDK not available or product ID is missing.");
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeProductWidgets);
} else {
  initializeProductWidgets();
}
```

---

### Embedded Mode (Robust)

This implementation ensures the SDK is loaded before embedding the widget.

**HTML:**

```html
<div id="embedded-product-widget-container"></div>
```

**JavaScript:**

```javascript
function embedProductWidget() {
  const containerId = "embedded-product-widget-container";
  const productId = 1234; // Your product ID

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#6c757d",
      "show-description": true,
      "theme-dark": false,
    };
    window.showpass.tickets.productPurchaseWidget(
      productId,
      params,
      containerId
    );
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedProductWidget, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedProductWidget);
} else {
  embedProductWidget();
}
```

---

### Alternative: Using Script Onload Callback

If you're dynamically loading the SDK, you can use the `onload` callback:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call widget functions
  const params = {
    "theme-primary": "#dc3545",
    "theme-dark": true,
  };
  window.showpass.tickets.productPurchaseWidget(9999, params);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Key Takeaways

- **Product ID is required:** Always use the correct numerical product ID from your dashboard
- **Check SDK availability:** Production code should always verify `window.showpass.tickets` exists before calling functions
- **Pop-up vs Embedded:** Use pop-up mode for quick interactions; use embedded mode for seamless page integration
- **Theme customization:** Use `theme-primary`, `theme-secondary`, and `theme-dark` to match your brand
- **Handle loading:** Implement retry logic or use `DOMContentLoaded` to ensure SDK readiness
- **No tracking-id:** Unlike event widgets, product widgets do not support the `tracking-id` parameter
