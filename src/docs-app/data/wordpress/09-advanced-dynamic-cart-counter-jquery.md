# Advanced: Adding a Dynamic Cart Counter with Custom JavaScript

The standard Showpass WordPress plugin provides a `[showpass_cart_button]` shortcode that conveniently includes a text-based cart counter (e.g., "Shopping Cart (3)"). This is perfect for most users.

However, if you're looking for a more integrated cart display—perhaps a dynamic counter directly in your website's main navigation menu or a custom header element—you can achieve this with a bit of custom JavaScript. This guide outlines how to implement such a feature.

**Please Note:** This is an advanced customization. It requires familiarity with HTML, CSS, JavaScript (jQuery), and adding custom code to your WordPress theme. If you're not comfortable with these steps, consider working with a web developer.

## What This Custom Cart Counter Does

This custom JavaScript solution will:

1.  **Listen for Cart Updates:** It actively listens for changes in the Showpass cart (e.g., when a customer adds a ticket).
2.  **Dynamically Update Your HTML:** It updates a specific element on your webpage to show the current number of items in the cart (e.g., "Cart (2)" or "Cart" if empty).
3.  **Enable Click-to-Open Cart:** It allows you to designate an element (like your custom counter or a menu item) that, when clicked, will open the Showpass checkout widget.

## Before You Begin: Prerequisites

- **Showpass WordPress Plugin:** Ensure the Showpass plugin is installed and activated.
- **jQuery:** WordPress includes jQuery by default, so this should be available on your site.
- **JS-Cookie Library:** This JavaScript library is used to interact with cookies. You'll need to add it to your site.
  - You can download it from [GitHub](https://github.com/js-cookie/js-cookie) or use a CDN.
  - A common way to include it is by adding the following line to your theme (ideally via `wp_enqueue_script`, or for testing, in your theme's header before `wp_head()`):
    `<script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>`
- **Identifiable HTML Elements:** Your website's theme needs to have specific HTML elements that you can target with jQuery:
  - An element where the cart count text will be displayed (e.g., a `<span>` inside a menu link).
  - An element that will act as the click trigger to open the cart (e.g., the menu item itself or the link).

## The Custom JavaScript Code

Here's the JavaScript code that powers the dynamic cart counter. You will need to customize parts of this code to match your website's specific HTML structure.

```javascript
(function ($) {
  // Wait for the document to be fully loaded and ready
  $(document).on("ready", function () {
    // Check if Showpass SDK and JS-Cookie library are available
    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined" &&
      typeof Cookies !== "undefined"
    ) {
      // This function runs every time the cart item count changes
      showpass.tickets.addCartCountListener(function (count) {
        var cartDisplayText = "";
        if (count > 0) {
          cartDisplayText = "Cart (" + count + ")";
        } else {
          cartDisplayText = "Cart";
        }

        // !!! IMPORTANT ACTION !!!
        // Update the HTML content of YOUR specific cart display element.
        // Replace '.your-cart-count-display-element' with the correct jQuery selector for your site.
        $(".your-cart-count-display-element").html(cartDisplayText);

        // Optional: The original code also set a cookie with this text.
        // You can uncomment the line below if you have a specific need for this cookie.
        // Cookies.set('showpass_cart_display_text', cartDisplayText, { expires: 7, path: '/' });
      });

      // This makes your chosen element open the Showpass cart widget when clicked
      // !!! IMPORTANT ACTION !!!
      // Replace '.your-cart-click-trigger-element' with the correct jQuery selector for your site.
      $(".your-cart-click-trigger-element").on("click", function (event) {
        event.preventDefault(); // Important if your trigger element is a link (<a> tag)

        showpass.tickets.checkoutWidget({
          // Optional: Customize the appearance of the checkout widget
          "theme-primary": "#9e2a2b", // Example: Showpass default red
          "keep-shopping": true, // true = "Keep Shopping", false = "Close"
        });
      });
    } else {
      // Log a message to the browser console if dependencies are missing
      console.warn(
        "Showpass SDK or JS-Cookie library not detected. Custom cart counter may not function."
      );
    }
  });
})(jQuery);
```

## How to Add This Code to Your WordPress Site

1.  **Include JS-Cookie Library:**

    - **Recommended (Production):** Enqueue the script in your theme's `functions.php` file.
      ```php
      function my_theme_enqueue_custom_scripts() {
          // Enqueue JS-Cookie from a CDN
          wp_enqueue_script('js-cookie', 'https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js', array(), '3.0.1', true);

          // Enqueue your custom cart script (see step 2)
          wp_enqueue_script('my-showpass-custom-cart', get_stylesheet_directory_uri() . '/js/my-showpass-cart.js', array('jquery', 'js-cookie'), '1.0.0', true);
      }
      add_action('wp_enqueue_scripts', 'my_theme_enqueue_custom_scripts');
      ```
      This assumes you will create a file named `my-showpass-cart.js` inside a `js` folder in your theme's directory.
    - **Simple (Testing):** Add the CDN link for JS-Cookie directly into your theme's `header.php` file, before `<?php wp_head(); ?>`.

2.  **Add the Custom JavaScript:**

    - **Recommended:** Create a new JavaScript file (e.g., `my-showpass-cart.js`) in your theme's directory (e.g., inside a `js` subfolder). Paste the customized JavaScript code (from above) into this file. Ensure it's enqueued as shown in step 1.
    - **Alternative:** For quick tests, you can wrap the JavaScript code in `<script>...</script>` tags and add it to your theme's footer (e.g., in `footer.php` before `</body>`) or using a "Custom HTML/JavaScript" feature if your theme or a plugin provides one.

3.  **CRITICAL STEP: Customize jQuery Selectors:**
    The most important part is to tell the script _which_ HTML elements on your page to interact with. You need to replace the placeholder selectors in the JavaScript:

    - `$('.your-cart-count-display-element')`: Change this to the jQuery selector that targets the HTML element where you want the "Cart (X)" text to appear.
    - `$('.your-cart-click-trigger-element')`: Change this to the jQuery selector that targets the HTML element that users will click to open the cart.

    **How to Find Your Selectors:**
    Use your web browser's "Inspect" or "Inspect Element" tool (usually by right-clicking on the element on your page). This will show you the HTML structure and the IDs or classes of your elements.

    - **Example Scenario:**
      Imagine your theme has a menu item in the header like this:
      ```html
      <li id="main-nav-cart-item" class="menu-item special-cart-link">
        <a href="/cart-page">
          <!-- This link might go to a placeholder page -->
          <i class="fa fa-shopping-cart"></i>
          <!-- An icon -->
          <span class="cart-items-text-holder">Cart</span>
          <!-- Where the text will update -->
        </a>
      </li>
      ```
      Your customized selectors in the JavaScript might be:
      - For the display element: `$('#main-nav-cart-item .cart-items-text-holder')`
      - For the click trigger: `$('#main-nav-cart-item a')` (to make the link itself open the widget) or `$('#main-nav-cart-item')` (to make the whole list item clickable).

4.  **Adjust Widget Options (Optional):**
    In the `showpass.tickets.checkoutWidget({ ... });` section of the script, you can change:
    - `'theme-primary'`: Set this to your preferred hex color code to style the primary elements of the Showpass widget.
    - `'keep-shopping'`: Set to `true` for the close button to say "Keep Shopping," or `false` for it to say "Close."

## Important Considerations

- **Child Themes:** If you're modifying theme files or adding custom `functions.php` code, always use a [WordPress child theme](https://developer.wordpress.org/themes/advanced-topics/child-themes/). This ensures your customizations aren't lost when you update your main theme.
- **JavaScript Errors:** If the counter isn't working, open your browser's JavaScript console (usually by pressing F12 and clicking the "Console" tab). Errors here can provide clues, such as the JS-Cookie library not being loaded, the `showpass.tickets` object not being available, or issues with your jQuery selectors.
- **Showpass SDK:** This script depends on the Showpass ticketing SDK (`showpass.tickets` object) being loaded on the page. The Showpass plugin usually handles this, but if the SDK is not present, the script won't function.
- **Theme Structure:** The reliability of this custom solution depends on your theme's HTML structure remaining consistent. If your theme updates and changes the IDs or classes of the elements you've targeted, you may need to update your jQuery selectors.

This advanced method offers great flexibility for integrating a Showpass cart counter seamlessly into your website's design. Test thoroughly after implementation!
