# Cart Quantity Listener

## Overview

The `addCartCountListener` function enables your website to react in real-time to changes in the Showpass shopping cart quantity. It invokes a callback function you provide, passing the current number of items in the cart, making it essential for creating dynamic cart counters and other cart-aware UI elements.

---

## SDK Function Signature

```javascript
showpass.tickets.addCartCountListener(callbackFunction);
```

### Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **callbackFunction** | Function | Required | A function executed whenever the cart count changes. Receives one argument: **count** (Integer) - the current number of items in the cart |

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- The listener should typically be set up once the page is ready (e.g., `DOMContentLoaded`)

---

## Basic Example

This simple example logs the cart count to the console whenever it changes. For production-ready implementations, see the "Advanced Implementation" section below.

```javascript
// Define callback function to handle cart updates
function handleCartUpdate(count) {
  console.log("Showpass Cart Count Changed:", count);
  
  // Update a UI element directly
  // document.getElementById('my-cart-display').innerText = 'Cart: ' + count;
}

// Check if SDK is loaded before adding listener
if (window.showpass && window.showpass.tickets) {
  window.showpass.tickets.addCartCountListener(handleCartUpdate);
  console.log("Showpass cart count listener added.");
} else {
  console.error("Showpass SDK not yet loaded");
}
```

---

## Advanced Implementation: Dynamic Cart Counter

This comprehensive example demonstrates how to:

1. Use `addCartCountListener` to update an HTML element with the current cart count
2. Optionally use cookies (via `js-cookie` library) to maintain cart display across page loads
3. Make the cart element clickable to open the Showpass Shopping Cart or Checkout widget

### Step 1: HTML Structure

Create an HTML element for your cart display. This could be a link, button, or any suitable element.

```html
<!-- Example: A cart link in a navigation menu -->
<a href="#" id="my-dynamic-cart-link" class="cart-link">
  <span id="my-cart-text">Cart</span>
</a>
```

---

### Step 2: Optional JavaScript Dependencies

- **jQuery (Optional):** Simplifies DOM manipulation and event handling
- **js-cookie (Optional):** Persists cart count visually across page loads ([GitHub: js-cookie](https://github.com/js-cookie/js-cookie))

```html
<!-- Include js-cookie from CDN -->
<script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>
```

---

### Step 3: JavaScript Implementation

Place this script after including the Showpass SDK and any optional libraries.

```javascript
function initializeCartListener() {
  const cartTextElementId = "my-cart-text";
  const cartLinkElementId = "my-dynamic-cart-link";

  const cartTextElement = document.getElementById(cartTextElementId);
  const cartLinkElement = document.getElementById(cartLinkElementId);

  if (!cartTextElement || !cartLinkElement) {
    console.error("Cart display or link element not found. Please check IDs.");
    return;
  }

  // Update cart display text
  function updateCartDisplay(count) {
    let displayText = "Cart";
    if (count > 0) {
      displayText = "Cart (" + count + ")";
    }
    cartTextElement.innerHTML = displayText;
    
    // Save to cookie if js-cookie is available
    if (typeof Cookies !== "undefined") {
      Cookies.set("showpassCartDisplay", displayText, {
        expires: 7,
        path: "/",
      });
    }
  }

  // Load initial display from cookie
  if (typeof Cookies !== "undefined") {
    const savedDisplay = Cookies.get("showpassCartDisplay");
    if (savedDisplay) {
      cartTextElement.innerHTML = savedDisplay;
    }
  }

  // Add cart count listener
  if (window.showpass && window.showpass.tickets) {
    window.showpass.tickets.addCartCountListener(updateCartDisplay);
    console.log("Cart listener successfully added.");
  } else {
    console.error("Showpass SDK not available.");
    // Retry after a short delay
    setTimeout(initializeCartListener, 500);
    return;
  }

  // Make cart element clickable to open checkout
  cartLinkElement.addEventListener("click", function (event) {
    event.preventDefault();
    if (window.showpass && window.showpass.tickets) {
      // Open checkout widget with your preferred styling
      window.showpass.tickets.checkoutWidget({
        "theme-primary": "#007bff",
      });
    } else {
      console.error("Showpass SDK not available for checkout.");
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCartListener);
} else {
  initializeCartListener();
}
```

---

### Alternative: Using Script Onload Callback

If you're dynamically loading the SDK, use the `onload` callback:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to add listener
  function handleCartUpdate(count) {
    console.log("Cart count updated:", count);
    document.getElementById("cart-badge").innerText = count || "";
  }
  
  window.showpass.tickets.addCartCountListener(handleCartUpdate);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Complete Example with jQuery

Here's a complete example using jQuery for simplified DOM manipulation:

```javascript
$(document).ready(function () {
  function initShowpassCartListener() {
    const $cartText = $("#my-cart-text");
    const $cartLink = $("#my-dynamic-cart-link");

    if ($cartText.length === 0 || $cartLink.length === 0) {
      console.error("Cart elements not found.");
      return;
    }

    // Update cart display function
    function updateCartDisplay(count) {
      const displayText = count > 0 ? `Cart (${count})` : "Cart";
      $cartText.html(displayText);
      Cookies.set("showpassCartDisplay", displayText, {
        expires: 7,
        path: "/",
      });
    }

    // Load from cookie
    const savedDisplay = Cookies.get("showpassCartDisplay");
    if (savedDisplay) {
      $cartText.html(savedDisplay);
    }

    // Add listener if SDK is ready
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.addCartCountListener(updateCartDisplay);
      
      // Handle cart link click
      $cartLink.on("click", function (e) {
        e.preventDefault();
        window.showpass.tickets.checkoutWidget({
          "theme-primary": "#28a745",
        });
      });
    } else {
      // Retry if SDK not ready
      setTimeout(initShowpassCartListener, 500);
    }
  }

  initShowpassCartListener();
});
```

---

## Key Takeaways

- **Real-time updates:** `addCartCountListener` provides instant feedback when cart contents change
- **Single callback:** The listener accepts one function that receives the cart count as an argument
- **Check SDK availability:** Always verify `window.showpass.tickets` exists before adding the listener
- **Cookie persistence:** Use cookies to maintain cart display across page loads
- **Clickable cart:** Combine with `checkoutWidget()` to create an interactive cart button
- **Retry logic:** Implement retry mechanism if SDK hasn't loaded when listener is initialized
- **jQuery optional:** jQuery simplifies implementation but isn't required
