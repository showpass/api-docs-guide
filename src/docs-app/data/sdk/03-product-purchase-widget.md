# Product purchase widget

## Overview

The Product Selection Widget opens a display for a specific marketplace product (identified by its numerical `id`), allowing users to select options (if any) and add the product to their cart. It can be launched as a pop-up dialog or embedded directly into a page element.

**SDK Function Signature:**

```javascript
// For pop-up mode
showpass.tickets.productPurchaseWidget(productId, params);

// For embedded mode
showpass.tickets.productPurchaseWidget(productId, params, containerId);
```

## Prerequisites

Ensure the Showpass SDK is included on your page as described in the "SDK Getting Started" guide. You'll need to ensure the SDK is loaded before calling its functions.

## Finding the product ID

To find the `productId`:

1.  Log in to your Showpass Dashboard.
2.  Navigate to **Marketplace > Products**.
3.  Edit the desired product.
4.  The Product ID will be visible in the URL of the edit page (e.g., `https://www.showpass.com/dashboard/inventory/products/PRODUCT_ID/edit/`).

## Parameters

| Parameter                    | Type    | Status   | Description                                                                                                 |
| ---------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `productId`                  | Integer | Required | The unique numerical ID of the product.                                                                     |
| `params`                     | Object  | Optional | An object containing additional configuration parameters for the widget.                                    |
| `params['theme-primary']`    | String  | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`).                                               |
| `params['theme-secondary']`  | String  | Optional | Hex code value for accent widget color.                                                                     |
| `params['theme-dark']`       | Boolean | Optional | If `true`, displays the widget in a dark theme.                                                             |
| `params['keep-shopping']`    | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage (e.g., `false`).                             |
| `params['show-description']` | Boolean | Optional | Displays or hides the product description.<br>Default: `true`.<br>(Original deploy date: October 15th 2019) |
| `params['lang']`             | String  | Optional | Language code for the widget interface. Accepts `'fr'` for French. Defaults to English if not specified.    |
| `params['tracking-id']`      | -       | -        | Not supported for this widget.                                                                              |
| `containerId`                | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the widget should be mounted.          |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, see the "Robust Implementation Examples" below.

### Pop-up mode (basic)

```javascript
let params = {
  "theme-primary": "#5cb85c", // Example green
  "theme-dark": false,
};
// Assuming 1234 is your product's ID
showpass.tickets.productPurchaseWidget(1234, params);
```

### Embedded mode (basic)

```html
<div id="product-widget-here"></div>
<script>
  let embedParams = { "theme-primary": "#f0ad4e" }; // Example orange
  // Assuming 5678 is your product's ID
  showpass.tickets.productPurchaseWidget(
    5678,
    embedParams,
    "product-widget-here"
  );
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below to handle SDK loading.

## Robust implementation examples

To ensure your code works reliably even if the Showpass SDK is still loading, you need to check for its availability before making calls.

### Pop-up mode (robust)

This example attaches an event listener to all buttons with the class `showpass-product-button` and reads the product ID from a `data-product-id` attribute.

**HTML:**

```html
<button class="showpass-product-button" data-product-id="1234">
  View Product Details
</button>
<button class="showpass-product-button" data-product-id="5678">
  Another Product
</button>
```

_Replace `1234` and `5678` with actual product IDs._

**JavaScript:**

```html
<script>
  function handleShowpassProductClick(event) {
    const productIdString = this.getAttribute("data-product-id");
    if (!productIdString) {
      console.error("Button is missing data-product-id attribute.");
      return; // Exit if no product ID
    }
    const productId = parseInt(productIdString, 10);

    const widgetParams = {
      "theme-primary": "#d9534f", // Example red
      "keep-shopping": true,
      "show-description": true,
    };

    // Check if SDK is loaded before calling
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.productPurchaseWidget(productId, widgetParams);
      console.log(`Showpass SDK called for product pop-up (ID: ${productId}).`);
    } else {
      console.error("Showpass SDK not yet loaded");
    }
  }

  // Wait for the DOM to be ready before attaching event listeners
  document.addEventListener("DOMContentLoaded", function () {
    const productButtons = document.querySelectorAll(
      ".showpass-product-button"
    );
    productButtons.forEach(function (button) {
      button.addEventListener("click", handleShowpassProductClick);
    });
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the product widget once the DOM is ready.

**HTML:**

```html
<!-- This div must exist in the DOM before the script below runs -->
<div id="embedded-product-widget-container">
  <!-- Optional: You can put a loading message here -->
</div>
```

**JavaScript:**

```html
<script>
  // Function to initialize the embedded widget
  function initializeEmbeddedProductWidget() {
    const productIdToEmbed = 9012; // <<< REPLACE THIS with your actual Product ID
    const embedContainerId = "embedded-product-widget-container"; // <<< Must match your div ID
    const widgetEmbedParams = {
      "theme-primary": "#5bc0de", // Example info blue
      "theme-dark": true,
    };

    // Check if the container element exists
    if (!document.getElementById(embedContainerId)) {
      console.error(
        "Target container for embedded Showpass product widget not found:",
        embedContainerId
      );
      return;
    }

    // Check if SDK is loaded and call the function
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.productPurchaseWidget(
        productIdToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK called for product embedding (ID: ${productIdToEmbed}).`
      );
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeEmbeddedProductWidget, 100);
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  document.addEventListener(
    "DOMContentLoaded",
    initializeEmbeddedProductWidget
  );
</script>
```

**Key for embedded widgets:**

- The HTML `div` element (e.g., `<div id="embedded-product-widget-container"></div>`) **must exist on the page** when the Showpass SDK attempts to mount the widget into it.
- It's best practice to ensure your script that calls the SDK functions runs _after_ its target HTML div is available in the DOM, for instance, by using a `DOMContentLoaded` event listener.

**Alternative: Using script onload callback**
If you're dynamically loading the SDK, you can use the onload callback approach:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call functions
  window.showpass.tickets.productPurchaseWidget(productId, params);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```
