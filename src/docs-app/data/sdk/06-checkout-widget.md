# Checkout Widget

## Overview

The Checkout Widget initiates the final stages of a purchase transaction. It guides users through order review, payment information entry, and transaction completion. Depending on your Showpass organization settings, it may also prompt for login if the user isn't already signed in.

This widget can be launched as a pop-up (typically after cart review) or embedded into a dedicated checkout page or section.

---

## SDK Function Signature

```javascript
// Pop-up mode - displays as a modal dialog
showpass.tickets.checkoutWidget(params);

// Embedded mode - mounts into a container element
showpass.tickets.checkoutWidget(params, containerId);
```

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- Items should be present in the shopping cart before calling this function

> **Note:** The checkout widget typically requires items in the cart to function properly.

---

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['keep-shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button (may behave differently in checkout flow). Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking-id']** | - | - | **Not supported** for checkout widget |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the checkout flow will mount |

---

## Basic Usage Examples

These examples assume the Showpass SDK is already loaded and items are in the cart. For production-ready code, see "Robust Implementation Examples" below.

### Pop-up Mode (Basic)

Typically called after a user reviews their cart and clicks a "Proceed to Checkout" button.

```javascript
// Define checkout configuration
let params = {
  "theme-primary": "#28a745", // Green theme
  "keep-shopping": false, // 'Close' button is more appropriate here
};

// Open the checkout widget as a pop-up
showpass.tickets.checkoutWidget(params);
```

---

### Embedded Mode (Basic)

Useful for creating a dedicated checkout page with seamless integration.

```html
<!-- Container element for the checkout widget -->
<div id="checkout-process-here"></div>

<script>
  // Configure and embed the checkout widget
  let embedParams = {
    "theme-primary": "#007bff", // Blue theme
  };
  showpass.tickets.checkoutWidget(embedParams, "checkout-process-here");
</script>
```

> **Note:** These basic examples assume `showpass.tickets` is ready. For production environments, always use the robust implementation patterns below.

---

## Robust Implementation Examples

These examples include proper SDK availability checks to ensure reliable execution.

### Pop-up Mode (Robust)

This implementation uses a button click (e.g., "Proceed to Checkout" from a cart page) to open the widget.

**HTML:**

```html
<button id="proceedToCheckoutBtn">Proceed to Checkout</button>
```

**JavaScript:**

```javascript
function handleCheckoutClick() {
  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#17a2b8",
      "keep-shopping": false,
    };
    window.showpass.tickets.checkoutWidget(params);
  } else {
    console.error("Showpass SDK not available.");
  }
}

function initializeCheckoutButton() {
  const button = document.getElementById("proceedToCheckoutBtn");
  if (button) {
    button.addEventListener("click", handleCheckoutClick);
  } else {
    console.error("Checkout button not found.");
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCheckoutButton);
} else {
  initializeCheckoutButton();
}
```

---

### Embedded Mode (Robust)

This implementation ensures the SDK is loaded before embedding the checkout widget into a dedicated checkout page.

**HTML:**

```html
<div id="embedded-checkout-container"></div>
```

**JavaScript:**

```javascript
function embedCheckoutWidget() {
  const containerId = "embedded-checkout-container";

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#6c757d",
    };
    window.showpass.tickets.checkoutWidget(params, containerId);
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedCheckoutWidget, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedCheckoutWidget);
} else {
  embedCheckoutWidget();
}
```

---

### Alternative: Using Script Onload Callback

If you're dynamically loading the SDK, you can use the `onload` callback:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call checkout widget
  const params = {
    "theme-primary": "#ffc107",
    "keep-shopping": false,
  };
  window.showpass.tickets.checkoutWidget(params);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Key Takeaways

- **Cart required:** Checkout widget typically requires items in the cart to function
- **Check SDK availability:** Production code should always verify `window.showpass.tickets` exists before calling functions
- **Pop-up vs Embedded:** Use pop-up mode for quick checkout flows; use embedded mode for dedicated checkout pages
- **No tracking-id:** Checkout widget does not support the `tracking-id` parameter
- **Login handling:** Widget may prompt for login based on your organization settings
- **Handle loading:** Implement retry logic or use `DOMContentLoaded` to ensure SDK readiness
- **Theme customization:** Use `theme-primary` to maintain brand consistency throughout the checkout experience
