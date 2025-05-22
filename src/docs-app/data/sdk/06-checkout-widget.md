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

Ensure the Showpass SDK is included on your page, preferably using the Asynchronous Loader (Option 1) described in the "SDK Getting Started" guide. This loader creates the `window.__shwps` command queue, which is the recommended way to call SDK functions.
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

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available, and there are items in the cart. For reliable execution, especially on initial page load, use the `window.__shwps` method shown in the "Robust Implementation Examples."

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

To ensure your code works reliably, it's best to use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

### Pop-up mode (robust)

This example uses a button click (e.g., "Proceed to Checkout" from a cart page) to open the widget.

**HTML:**

```html
<button id="proceedToCheckoutBtn">Proceed to Checkout</button>
```

**JavaScript:**

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.getElementById("proceedToCheckoutBtn");
    if (checkoutButton) {
      checkoutButton.addEventListener("click", function () {
        const widgetParams = {
          "theme-primary": "#28a745", // Example green
          "keep-shopping": false,
        };
        window.__shwps("tickets.checkoutWidget", widgetParams);
        console.log(
          "Showpass SDK call queued via __shwps for checkout pop-up."
        );
      });
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

    if (document.getElementById(embedContainerId)) {
      window.__shwps(
        "tickets.checkoutWidget",
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        "Showpass SDK call queued via __shwps for embedded checkout."
      );
    } else {
      console.error(
        "Target container for embedded Showpass checkout not found:",
        embedContainerId
      );
    }
  }

  document.addEventListener("DOMContentLoaded", initializeEmbeddedCheckout);
</script>
```

**Important considerations for embedded checkout:**

- **Cart State:** The embedded checkout widget assumes there are items in the cart. If the cart is empty, it might display an empty state or an error. Ensure users reach this embedded checkout page as part of a valid purchase flow.
- **Page Design:** When embedding the checkout, the rest of your page design around the `containerId` should complement a checkout experience (e.g., minimal distractions).
- **Session Management:** Ensure user sessions and cart contents are correctly managed leading up to the display of the embedded checkout.

**Note on direct SDK calls (without `window.__shwps`):**
If you choose not to use the "Option 1" async loader from the Getting Started guide and instead use a direct `<script async/defer src="...">` tag, you would call `showpass.tickets.checkoutWidget(...)` directly. In that scenario, you _must_ ensure your call is made only after the SDK has fully loaded, for example by checking `if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') { ... }` or using a `DOMContentLoaded` listener if using `defer`. The `window.__shwps` method handles this timing automatically when the loader snippet is used.
