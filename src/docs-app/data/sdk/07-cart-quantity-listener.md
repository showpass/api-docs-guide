Okay, I will combine the core functionality of the `addCartCountListener` with the more detailed implementation guide from the "Advanced Dynamic Cart Counter" (WordPress focused) document, but I'll make it generic (non-WordPress specific for the implementation steps) as requested.

The key is to keep the simple SDK call visible upfront, then provide a more comprehensive, yet generic, example of how it can be used to update an element and optionally persist the count using a cookie for navigation.

Here's the raw text content for the updated `sdk-cart-quantity-listener.md`:

# Cart quantity listener

## Overview

The `addCartCountListener` function allows your website to react in real-time to changes in the Showpass shopping cart quantity. It calls a function you provide, passing the current number of items in the cart.

This is essential for creating dynamic cart counters or other UI elements that reflect the cart's state.

**SDK Function Signature:**

```javascript
showpass.tickets.addCartCountListener(callbackFunction);
```

- `callbackFunction` (Function, Required): A function that will be executed whenever the cart count changes. This function will receive one argument: `count` (Integer), which is the current number of items in the cart.

## Prerequisites

- Ensure the Showpass SDK is included on your page and has fully loaded. See the "SDK Getting Started" guide.
- This listener should typically be set up once the page is ready (e.g., DOMContentLoaded) to ensure the SDK is available.

## Basic example

This example simply logs the cart count to the console whenever it changes.

```javascript
function handleCartUpdate(count) {
  console.log("Showpass Cart Count Changed:", count);
  // You could update a UI element here directly
  // document.getElementById('my-cart-display').innerText = 'Cart: ' + count;
}

// Ensure SDK is ready before adding listener
if (
  typeof showpass !== "undefined" &&
  typeof showpass.tickets !== "undefined"
) {
  showpass.tickets.addCartCountListener(handleCartUpdate);
}
// Fallback for asynchronous loader (Option 1 in Getting Started)
else if (typeof window.__shwps !== "undefined") {
  window.__shwps("tickets.addCartCountListener", handleCartUpdate);
} else {
  console.error("Showpass SDK not available to add cart count listener.");
}
```

## Advanced implementation: Dynamic cart counter with click-to-open cart

This more comprehensive example demonstrates how to:

1.  Use `addCartCountListener` to update the text of an HTML element (e.g., in your site header) with the current cart count.
2.  Optionally, use a cookie (with a library like `js-cookie`) to maintain the cart display text across page loads.
3.  Make this HTML element clickable to open the Showpass Shopping Cart or Checkout widget.

### 1. HTML structure

You'll need an HTML element for your cart display and trigger. This could be a link, a list item, or any other suitable element.

```html
<!-- Example: A cart link in a navigation menu -->
<a href="#" id="my-dynamic-cart-link" class="cart-link">
  <span id="my-cart-text">Cart</span>
  <!-- This span will be updated -->
</a>
```

### 2. JavaScript dependencies (optional but recommended)

- **jQuery (Optional):** While not strictly necessary, jQuery can simplify DOM manipulation and event handling. The example below will provide both plain JavaScript and jQuery-style selectors where applicable.
- **js-cookie (Optional):** If you want the cart count to persist visually across page loads (as the SDK might re-initialize the count on each page), a cookie library is helpful. You can get it from [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie).
  ```html
  <!-- Example: Include js-cookie from a CDN -->
  <script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>
  ```

### 3. JavaScript implementation

This script should be placed after you've included the Showpass SDK and any optional libraries like js-cookie.

```javascript
// Ensure this script runs after the DOM is ready and SDK might be available.
document.addEventListener('DOMContentLoaded', function() {

  const cartTextElementId = 'my-cart-text'; // ID of the span to update
  const cartLinkElementId = 'my-dynamic-cart-link'; // ID of the clickable element

  const cartTextElement = document.getElementById(cartTextElementId);
  const cartLinkElement = document.getElementById(cartLinkElementId);

  if (!cartTextElement || !cartLinkElement) {
    console.error('Cart display or link element not found. Please check IDs.');
    return;
  }

  // Function to update the cart display
  function updateCartDisplay(count) {
    let displayText = "Cart";
    if (count > 0) {
      displayText = "Cart (" + count + ")";
    }
    cartTextElement.innerHTML = displayText;

    // Optional: Update cookie if js-cookie is available
    if (typeof Cookies !== 'undefined') {
      Cookies.set('showpassCartDisplay', displayText, { expires: 7, path: '/' });
    }
  }

  // Function to handle opening the cart/checkout widget
  function openCartWidget(event) {
    event.preventDefault(); // Prevent default link behavior

    const widgetParams = {
      'theme-primary': '#9e2a2b', // Example theme color
      'keep-shopping': true
    };

    // You might open the shoppingCartWidget or directly the checkoutWidget
    if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') {
      showpass.tickets.shoppingCartWidget(widgetParams);
      // Or: showpass.tickets.checkoutWidget(widgetParams);
    } else if (typeof window.__shwps !== "undefined") {
      window.__shwps('tickets.shoppingCartWidget', widgetParams);
      // Or: window.__shwps('tickets.checkoutWidget', widgetParams);
    } else {
      console.error('Showpass SDK not available to open cart widget.');
      alert('Cart is currently unavailable.');
    }
  }

  // Add click listener to the cart link
  cartLinkElement.addEventListener('click', openCartWidget);

  // Initialize cart listener with the Showpass SDK
  function initializeShowpassCartListener() {
    if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') {
      showpass.tickets.addCartCountListener(updateCartDisplay);
    }
    // Fallback for asynchronous loader
    else if (typeof window.__shwps !== "undefined") {
      window.__shwps('tickets.addCartCountListener', updateCartDisplay);
      console.log('Showpass cart count listener queued via __shwps.');
    }
    else {
      console.warn('Showpass SDK not ready for cart listener, retrying...');
      setTimeout(initializeShowpassCartListener, 500); // Retry
    }
  }

  // Initial setup
  initializeShowpassCartListener();

  // Optional: Display cart quantity from cookie on page load if js-cookie is used
  if (typeof Cookies !== 'undefined') {
    const savedCartText = Cookies.get('showpassCartDisplay');
    if (savedCartText) {
      cartTextElement.innerHTML = savedCartText;
    }
  }
});
</script>
```

**Explanation:**

1.  **`cartTextElementId` & `cartLinkElementId`:** Set these to the IDs of your HTML elements.
2.  **`updateCartDisplay(count)`:** This function is passed to the `addCartCountListener`. It receives the `count` and updates the `innerHTML` of your `cartTextElement`.
    - It also optionally uses `Cookies.set()` (if `js-cookie` is present) to store the display text. This helps maintain the visual count if the user navigates to a new page on your site before the SDK fully re-initializes the live count.
3.  **`openCartWidget(event)`:** This function is attached as a click listener to your `cartLinkElement`. It prevents default link behavior and calls `showpass.tickets.shoppingCartWidget()` (or `checkoutWidget()`) to open the relevant widget.
4.  **`initializeShowpassCartListener()`:** This function robustly sets up the listener, checking for SDK availability and using the `__shwps` queue if needed, with a retry mechanism.
5.  **Cookie on Load (Optional):** On page load, if `js-cookie` is used and a cookie named `showpassCartDisplay` exists, its value is used to set the initial text of the cart display. This provides a faster visual update while the SDK initializes.

**Customization:**

- Modify the jQuery selectors (`$('#my-cart-text')`, `$('#my-dynamic-cart-link')`) or plain JavaScript (`document.getElementById(...)`) to target your specific HTML elements.
- Adjust the `widgetParams` for the `shoppingCartWidget` or `checkoutWidget` as needed.
- If not using `js-cookie`, remove the cookie-related lines.
- Change the `$(window).on("load", ...)` and `$(document).on("ready", ...)` if you are not using jQuery, to appropriate plain JavaScript equivalents like `window.onload = ...` or ensure your script is placed at the end of the body. The example was updated to use `DOMContentLoaded` for broader compatibility.
