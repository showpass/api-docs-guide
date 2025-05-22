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

Ensure the Showpass SDK is included on your page and has fully loaded before these functions are called. See the "SDK Getting Started" guide. The SDK loads asynchronously.

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

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available.

### Pop-up mode (basic)

```javascript
// Basic parameters
let params = {
  "theme-primary": "#5cb85c", // Example green
  "theme-dark": false,
};

// Assuming 1234 is your product's ID
showpass.tickets.productPurchaseWidget(1234, params);
```

### Embedded mode (basic)

```html
<!-- 1. Your HTML container -->
<div id="product-widget-here"></div>

<script>
  // 2. JavaScript to embed
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

To ensure your code works reliably even if the Showpass SDK is still loading, it's best to check for its availability or use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

### Pop-up mode (robust)

This example uses a button click to open the widget and reads the product ID from a `data-product-id` attribute on the button.

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
      alert("Could not determine the product. Please try again.");
      return;
    }
    const productId = parseInt(productIdString, 10); // Ensure it's an integer

    const widgetParams = {
      "theme-primary": "#d9534f", // Example red
      "keep-shopping": true,
      "show-description": true,
    };

    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined"
    ) {
      showpass.tickets.productPurchaseWidget(productId, widgetParams);
    }
    // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
    else if (typeof window.__shwps !== "undefined") {
      window.__shwps("tickets.productPurchaseWidget", productId, widgetParams);
      console.log(
        `Showpass SDK call queued via __shwps for product pop-up (ID: ${productId}).`
      );
    } else {
      console.error("Showpass SDK is not available.");
      alert(
        "Product system is currently unavailable. Please try again shortly."
      );
    }
  }

  // Attach event listener to all buttons with the class 'showpass-product-button'
  const productButtons = document.querySelectorAll(".showpass-product-button");
  productButtons.forEach((button) => {
    button.addEventListener("click", handleShowpassProductClick);
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the product widget once the DOM is ready and includes a simple retry mechanism if the SDK isn't immediately available.

**HTML:**

```html
<!-- 1. Your HTML container -->
<div id="embedded-product-widget-container">
  <!-- Optional: Loading Product... -->
</div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedProductWidget() {
    const productIdToEmbed = 9012; // <<< REPLACE THIS with your actual Product ID
    const containerId = "embedded-product-widget-container"; // <<< Must match your div ID
    const widgetParams = {
      "theme-primary": "#5bc0de", // Example info blue
      "theme-dark": true,
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.productPurchaseWidget(
          productIdToEmbed,
          widgetParams,
          containerId
        );
      }
      // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
      else if (typeof window.__shwps !== "undefined") {
        window.__shwps(
          "tickets.productPurchaseWidget",
          productIdToEmbed,
          widgetParams,
          containerId
        );
        console.log(
          `Showpass SDK call queued via __shwps for product embedding (ID: ${productIdToEmbed}).`
        );
      } else {
        console.warn(
          "Showpass SDK not ready for product embedding, will retry..."
        );
        setTimeout(initializeEmbeddedProductWidget, 500);
      }
    } else {
      console.error(
        "Target container for embedded Showpass product widget not found:",
        containerId
      );
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeEmbeddedProductWidget
    );
  } else {
    // DOM is already loaded
    initializeEmbeddedProductWidget();
  }
</script>
```

**Choosing an Implementation:**

- Use the **Basic Usage Examples** for a quick understanding or if your script execution is guaranteed to be after the SDK loads.
- Use the **Robust Implementation Examples** for production websites to ensure reliability and handle the asynchronous loading of the SDK. These examples demonstrate checking for `showpass.tickets` and provide a fallback to the `window.__shwps` command queue if you used the recommended asynchronous loader from the "Getting Started" guide.
