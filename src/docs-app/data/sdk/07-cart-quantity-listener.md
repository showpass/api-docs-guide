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

- Ensure the Showpass SDK is included on your page, preferably using the Asynchronous Loader (Option 1) described in the "SDK Getting Started" guide. This loader creates the `window.__shwps` command queue, which is the recommended way to call SDK functions.
- This listener should typically be set up once the page is ready (e.g., DOMContentLoaded) to ensure the SDK is available.

## Basic example

This example simply logs the cart count to the console whenever it changes. For reliable execution, especially on initial page load, use the `window.__shwps` method shown in the "Robust Implementation Examples."

```javascript
function handleCartUpdate(count) {
  console.log("Showpass Cart Count Changed:", count);
  // You could update a UI element here directly
  // document.getElementById('my-cart-display').innerText = 'Cart: ' + count;
}

// Example assuming SDK is ready (for illustration only)
// showpass.tickets.addCartCountListener(handleCartUpdate);

// Robust way using command queue:
window.__shwps("tickets.addCartCountListener", handleCartUpdate);
console.log("Showpass cart count listener queued via __shwps.");
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
  document.addEventListener("DOMContentLoaded", function () {
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
      window.__shwps("tickets.shoppingCartWidget", widgetParams);
      // Or: window.__shwps('tickets.checkoutWidget', widgetParams);
      console.log("Showpass SDK call queued for cart widget pop-up.");
    }

    cartLinkElement.addEventListener("click", openCartWidget);

    // Initialize cart listener with the Showpass SDK via command queue
    window.__shwps("tickets.addCartCountListener", updateCartDisplay);
    console.log("Showpass cart count listener queued via __shwps.");

    // Optional: Display cart quantity from cookie on page load
    if (typeof Cookies !== "undefined") {
      const savedCartText = Cookies.get("showpassCartDisplay");
      if (savedCartText) {
        cartTextElement.innerHTML = savedCartText;
      }
    }
  });
</script>
```

**Explanation:**

1.  **`cartTextElementId` & `cartLinkElementId`:** Set these to the IDs of your HTML elements.
2.  **`updateCartDisplay(count)`:** This function is passed to `addCartCountListener`. It updates the `innerHTML` of your `cartTextElement` and optionally sets a cookie.
3.  **`openCartWidget(event)`:** Attached as a click listener to your `cartLinkElement`, it opens the Showpass shopping cart (or checkout) widget using `window.__shwps`.
4.  **Initialization:** The `addCartCountListener` is now directly queued using `window.__shwps` within the `DOMContentLoaded` listener, removing the need for a separate initialization function with retries if the primary method of SDK inclusion is the async loader.
5.  **Cookie on Load (Optional):** Sets initial cart text from a cookie if available.

**Customization:**

- Update `cartTextElementId` and `cartLinkElementId` to match your HTML.
- Adjust `widgetParams` for the cart/checkout widget as needed.
- Remove cookie logic if not using `js-cookie`.

**Note on direct SDK calls (without `window.__shwps`):**
If you use a direct `<script async/defer src="...">` tag for the SDK instead of the recommended async loader, you would call `showpass.tickets.addCartCountListener(...)` directly, but only after ensuring the SDK is loaded (e.g., by checking `if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') { ... }` or similar). The `window.__shwps` method handles this automatically with the loader.
