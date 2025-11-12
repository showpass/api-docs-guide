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

Ensure the Showpass SDK is included on your page as described in the "SDK Getting Started" guide. You'll need to ensure the SDK is loaded before calling its functions.
The checkout widget typically requires items to be present in the shopping cart.

## Parameters

| Parameter                 | Type    | Status   | Description                                                                                                                                                   |
| ------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`                  | Object  | Optional | An object containing additional configuration parameters for the widget.                                                                                      |
| `params['theme-primary']` | String  | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`).                                                                                                 |
| `params['keep-shopping']` | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage (e.g., `false`). This may be less relevant or behave differently in an embedded checkout flow. |
| `params['lang']`          | String  | Optional | Language code for the widget interface. Accepts `'fr'` for French. Defaults to English if not specified.                                                    |
| `params['tracking-id']`   | -       | -        | Not supported for this widget.                                                                                                                                |
| `containerId`             | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the checkout flow should be mounted.                                                     |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available, and there are items in the cart. For reliable execution, especially on initial page load, see the "Robust Implementation Examples" below.

### Pop-up mode (basic)

Typically called after a user reviews their cart and clicks a "Proceed to Checkout" button.

```javascript
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
<div id="checkout-process-here"></div>
<script>
  let embedParams = {
    "theme-primary": "#007bff", // Example blue
  };
  showpass.tickets.checkoutWidget(embedParams, "checkout-process-here");
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below.

## Robust implementation examples

To ensure your code works reliably even if the Showpass SDK is still loading, you need to check for its availability before making calls.

### Pop-up mode (robust)

This example uses a button click (e.g., "Proceed to Checkout" from a cart page) to open the widget.

**HTML:**

```html
<button id="proceedToCheckoutBtn">Proceed to Checkout</button>
```

**JavaScript:**

```html
<script>
  function handleCheckoutClick() {
    const widgetParams = {
      "theme-primary": "#28a745", // Example green
      "keep-shopping": false,
    };

    // Check if SDK is loaded before calling
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.checkoutWidget(widgetParams);
      console.log("Showpass SDK called for checkout pop-up.");
    } else {
      console.error("Showpass SDK not yet loaded");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById("proceedToCheckoutBtn");
    if (checkoutButton) {
      checkoutButton.addEventListener("click", handleCheckoutClick);
    }
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the checkout widget into a dedicated page area once the DOM is ready.

**HTML:**

```html
<!-- This div must exist in the DOM before the script below runs -->
<div id="embedded-checkout-container">
  <!-- Optional: Loading checkout... -->
</div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedCheckout() {
    const embedContainerId = "embedded-checkout-container"; // <<< Must match your div ID
    const widgetEmbedParams = {
      "theme-primary": "#663399", // Example rebeccapurple
    };

    // Check if the container element exists
    if (!document.getElementById(embedContainerId)) {
      console.error(
        "Target container for embedded Showpass checkout not found:",
        embedContainerId
      );
      return;
    }

    // Check if SDK is loaded and call the function
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.checkoutWidget(
        widgetEmbedParams,
        embedContainerId
      );
      console.log("Showpass SDK called for embedded checkout.");
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeEmbeddedCheckout, 100);
    }
  }

  document.addEventListener("DOMContentLoaded", initializeEmbeddedCheckout);
</script>
```

**Important considerations for embedded checkout:**

- **Cart State:** The embedded checkout widget assumes there are items in the cart. If the cart is empty, it might display an empty state or an error. Ensure users reach this embedded checkout page as part of a valid purchase flow.
- **Page Design:** When embedding the checkout, the rest of your page design around the `containerId` should complement a checkout experience (e.g., minimal distractions).
- **Session Management:** Ensure user sessions and cart contents are correctly managed leading up to the display of the embedded checkout.

**Alternative: Using script onload callback**
If you're dynamically loading the SDK, you can use the onload callback approach:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call functions
  window.showpass.tickets.checkoutWidget(params, containerId);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```
