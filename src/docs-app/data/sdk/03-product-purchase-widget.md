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

Ensure the Showpass SDK is included on your page, preferably using the Asynchronous Loader (Option 1) described in the "SDK Getting Started" guide. This loader creates the `window.__shwps` command queue, which is the recommended way to call SDK functions.

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
| `params['tracking-id']`      | -       | -        | Not supported for this widget.                                                                              |
| `containerId`                | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the widget should be mounted.          |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, use the `window.__shwps` method shown in the "Robust Implementation Examples."

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

To ensure your code works reliably, it's best to use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

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

    // Use window.__shwps to queue the command
    window.__shwps("tickets.productPurchaseWidget", productId, widgetParams);
    console.log(
      `Showpass SDK call queued for product pop-up (ID: ${productId}).`
    );
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

    // Check if the container element exists before queuing the command
    if (document.getElementById(embedContainerId)) {
      // Use window.__shwps to queue the command
      window.__shwps(
        "tickets.productPurchaseWidget",
        productIdToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK call queued for product embedding (ID: ${productIdToEmbed}).`
      );
    } else {
      console.error(
        "Target container for embedded Showpass product widget not found:",
        embedContainerId
      );
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
- It's best practice to ensure your script that calls `window.__shwps(...)` for an embedded widget runs _after_ its target HTML div is available in the DOM, for instance, by using a `DOMContentLoaded` event listener.

**Note on direct SDK calls (without `window.__shwps`):**
If you choose not to use the "Option 1" async loader from the Getting Started guide and instead use a direct `<script async/defer src="...">` tag, you would call `showpass.tickets.productPurchaseWidget(...)` directly. In that scenario, you _must_ ensure your call is made only after the SDK has fully loaded, for example by checking `if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') { ... }` or using a `DOMContentLoaded` listener if using `defer`. The `window.__shwps` method handles this timing automatically when the loader snippet is used.
