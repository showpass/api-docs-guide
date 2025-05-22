# Checkout widget

## Overview

The Check Out Widget initiates the final stages of a purchase. It typically prompts the user to review their order, enter payment information, and complete the transaction. Depending on your Showpass organization settings, it may also prompt for login if the user is not already signed in.

This widget can be launched as a pop-up (often after cart review) or embedded into a dedicated checkout page/section.

**SDK Function Signature:**

```javascript
// For pop-up mode
showpass.tickets.checkoutWidget(params);

// For embedded mode
showpass.tickets.checkoutWidget(params, containerId);
```

## Prerequisites

Ensure the Showpass SDK is included on your page and has fully loaded before these functions are called. See the "SDK Getting Started" guide. The SDK loads asynchronously.
The checkout widget typically requires items to be present in the shopping cart.

## Parameters

| Parameter                 | Type    | Status   | Description                                                                                                                                                   |
| ------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`                  | Object  | Optional | An object containing additional configuration parameters for the widget.                                                                                      |
| `params['theme-primary']` | String  | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`).                                                                                                 |
| `params['keep-shopping']` | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage (e.g., `false`). This may be less relevant or behave differently in an embedded checkout flow. |
| `params['tracking-id']`   | -       | -        | Not supported for this widget.                                                                                                                                |
| `containerId`             | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the checkout flow should be mounted.                                                     |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available, and there are items in the cart.

### Pop-up mode (basic)

Typically called after a user reviews their cart and clicks a "Proceed to Checkout" button.

```javascript
// Basic parameters
let params = {
  "theme-primary": "#28a745", // Example green
  "keep-shopping": false, // 'Close' button might be more appropriate here
};

// Call when ready to proceed to checkout
showpass.tickets.checkoutWidget(params);
```

### Embedded mode (basic)

Useful for creating a dedicated checkout page.

```html
<!-- 1. Your HTML container for the checkout flow -->
<div id="checkout-process-here"></div>

<script>
  // 2. JavaScript to embed the checkout process
  let embedParams = {
    "theme-primary": "#007bff", // Example blue
    // 'keep-shopping' might not be relevant or could be hidden in embedded checkout
  };
  showpass.tickets.checkoutWidget(embedParams, "checkout-process-here");
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below.

## Robust implementation examples

To ensure your code works reliably, especially handling the asynchronous loading of the SDK.

### Pop-up mode (robust)

This example uses a button click (e.g., "Proceed to Checkout" from a cart page) to open the widget.

**HTML:**

```html
<button id="proceedToCheckoutBtn">Proceed to Checkout</button>
```

**JavaScript:**

```html
<script>
  document
    .getElementById("proceedToCheckoutBtn")
    .addEventListener("click", function () {
      const widgetParams = {
        "theme-primary": "#28a745", // Example green
        "keep-shopping": false,
      };

      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.checkoutWidget(widgetParams);
      }
      // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
      else if (typeof window.__shwps !== "undefined") {
        window.__shwps("tickets.checkoutWidget", widgetParams);
        console.log(
          "Showpass SDK call queued via __shwps for checkout pop-up."
        );
      } else {
        console.error("Showpass SDK is not available.");
        alert(
          "Checkout system is currently unavailable. Please try again shortly."
        );
      }
    });
</script>
```

### Embedded mode (robust)

This example attempts to embed the checkout widget into a dedicated page area once the DOM is ready. This is suitable for a page where the main content _is_ the checkout process.

**HTML:**

```html
<!-- 1. Your HTML container for the embedded checkout -->
<div id="embedded-checkout-container">
  <!-- Optional: Loading checkout... -->
</div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedCheckout() {
    const containerId = "embedded-checkout-container"; // <<< Must match your div ID
    const widgetParams = {
      "theme-primary": "#663399", // Example rebeccapurple
      // 'keep-shopping' is often omitted or false for embedded checkout
      // as the flow is contained within the page.
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.checkoutWidget(widgetParams, containerId);
      }
      // Fallback to command queue
      else if (typeof window.__shwps !== "undefined") {
        window.__shwps("tickets.checkoutWidget", widgetParams, containerId);
        console.log(
          "Showpass SDK call queued via __shwps for embedded checkout."
        );
      } else {
        console.warn(
          "Showpass SDK not ready for embedded checkout, will retry..."
        );
        setTimeout(initializeEmbeddedCheckout, 500);
      }
    } else {
      console.error(
        "Target container for embedded Showpass checkout not found:",
        containerId
      );
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeEmbeddedCheckout);
  } else {
    // DOM is already loaded
    initializeEmbeddedCheckout();
  }
</script>
```

**Important Considerations for Embedded Checkout:**

- **Cart State:** The embedded checkout widget assumes there are items in the cart. If the cart is empty, it might display an empty state or an error. Ensure users reach this embedded checkout page as part of a valid purchase flow.
- **Page Design:** When embedding the checkout, the rest of your page design around the `containerId` should complement a checkout experience (e.g., minimal distractions).
- **Session Management:** Ensure user sessions and cart contents are correctly managed leading up to the display of the embedded checkout.
