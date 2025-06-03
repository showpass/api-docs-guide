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

- Ensure the Showpass SDK is included on your page as described in the "SDK Getting Started" guide. You'll need to ensure the SDK is loaded before calling its functions.
- This listener should typically be set up once the page is ready (e.g., DOMContentLoaded) to ensure the SDK is available.

## Basic example

This example simply logs the cart count to the console whenever it changes. For reliable execution, especially on initial page load, see the "Advanced Implementation" below.

```javascript
function handleCartUpdate(count) {
  console.log("Showpass Cart Count Changed:", count);
  // You could update a UI element here directly
  // document.getElementById('my-cart-display').innerText = 'Cart: ' + count;
}

// Check if SDK is loaded before calling
if (window.showpass && window.showpass.tickets) {
  window.showpass.tickets.addCartCountListener(handleCartUpdate);
  console.log("Showpass cart count listener added.");
} else {
  console.error("Showpass SDK not yet loaded");
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

- **jQuery (Optional):** While not strictly necessary, jQuery can simplify DOM manipulation and event handling.
- **js-cookie (Optional):** If you want the cart count to persist visually across page loads, a cookie library is helpful. ([https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)).
  ```html
  <!-- Example: Include js-cookie from a CDN -->
  <script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>
  ```

### 3. JavaScript implementation

This script should be placed after you've included the Showpass SDK and any optional libraries like js-cookie.

```html
<script>
  function initializeCartListener() {
    const cartTextElementId = "my-cart-text";
    const cartLinkElementId = "my-dynamic-cart-link";

    const cartTextElement = document.getElementById(cartTextElementId);
    const cartLinkElement = document.getElementById(cartLinkElementId);

    if (!cartTextElement || !cartLinkElement) {
      console.error(
        "Cart display or link element not found. Please check IDs."
      );
      return;
    }

    function updateCartDisplay(count) {
      let displayText = "Cart";
      if (count > 0) {
        displayText = "Cart (" + count + ")";
      }
      cartTextElement.innerHTML = displayText;
      if (typeof Cookies !== "undefined") {
        Cookies.set("showpassCartDisplay", displayText, {
          expires: 7,
          path: "/",
        });
      }
    }

    function openCartWidget(event) {
      event.preventDefault();
      const widgetParams = {
        "theme-primary": "#9e2a2b",
        "keep-shopping": true,
      };

      // Check if SDK is loaded before calling
      if (
        window.showpass &&
        window.showpass.tickets &&
        window.showpass.tickets.shoppingCartWidget
      ) {
        window.showpass.tickets.shoppingCartWidget(widgetParams);
        console.log("Showpass SDK called for cart widget pop-up.");
      } else {
        console.error("Showpass SDK or shopping cart widget not available");
      }
    }

    cartLinkElement.addEventListener("click", openCartWidget);

    // Check if SDK is loaded before adding listener
    if (
      window.showpass &&
      window.showpass.tickets &&
      window.showpass.tickets.addCartCountListener
    ) {
      window.showpass.tickets.addCartCountListener(updateCartDisplay);
      console.log("Showpass cart count listener added.");
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeCartListener, 100);
      return;
    }

    // Optional: Display cart quantity from cookie on page load
    if (typeof Cookies !== "undefined") {
      const savedCartText = Cookies.get("showpassCartDisplay");
      if (savedCartText) {
        cartTextElement.innerHTML = savedCartText;
      }
    }
  }

  document.addEventListener("DOMContentLoaded", initializeCartListener);
</script>
```

**Explanation:**

1.  **`cartTextElementId` & `cartLinkElementId`:** Set these to the IDs of your HTML elements.
2.  **`updateCartDisplay(count)`:** This function is passed to `addCartCountListener`. It updates the `innerHTML` of your `cartTextElement` and optionally sets a cookie.
3.  **`openCartWidget(event)`:** Attached as a click listener to your `cartLinkElement`, it opens the Showpass shopping cart (or checkout) widget.
4.  **Initialization:** The function checks if the SDK is loaded before adding the listener, with a retry mechanism if not ready.
5.  **Cookie on Load (Optional):** Sets initial cart text from a cookie if available.

**Customization:**

- Update `cartTextElementId` and `cartLinkElementId` to match your HTML.
- Adjust `widgetParams` for the cart/checkout widget as needed.
- Remove cookie logic if not using `js-cookie`.

**Alternative: Using script onload callback**
If you're dynamically loading the SDK, you can use the onload callback approach:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call functions
  window.showpass.tickets.addCartCountListener(callbackFunction);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```
