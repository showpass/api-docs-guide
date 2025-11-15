# Advanced: Adding a dynamic cart counter with custom JavaScript

The standard Showpass WordPress plugin provides a `[showpass_cart_button]` shortcode that includes a text-based cart counter (e.g. **“Shopping Cart (3)”**). For most sites, this is enough.

If you want a **custom cart counter** in your own header, nav menu, or layout (e.g. “Cart (2)” in the main menu), you can hook into the Showpass JavaScript SDK and update your own elements dynamically.

> ⚠️ This is an advanced customization. You should be comfortable with HTML, CSS, JavaScript/jQuery, and adding custom code to your theme or via a code-snippets plugin.

---

## What this custom cart counter does

This approach will:

1. **Listen for cart updates** – Uses the Showpass SDK to detect when the cart item count changes.
2. **Update your HTML** – Replaces the text of a specific element (e.g. `Cart` → `Cart (3)`).
3. **Open the Showpass cart** – Lets you make that element clickable to open the Showpass checkout widget.

---

## Before you begin

You’ll need:

- **Showpass WordPress plugin activated**  
  (This loads the Showpass SDK and the `showpass` global object.)
- **jQuery**  
  WordPress loads jQuery by default.
- **JS-Cookie library**  
  The Showpass plugin already loads JS-Cookie on the front-end. If you’re working outside that context, you can add it yourself (e.g. via CDN):

```html
<script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>
````

* **HTML elements to target**

  * One element where the **cart count text** should appear (e.g. `<span>Cart</span>` in your nav).
  * One element that should **open the cart** when clicked (often the same link/menu item).

---

## The custom JavaScript

> 🔁 You must update the jQuery selectors in this code (`.your-cart-count-display-element` and `.your-cart-click-trigger-element`) to match your theme.

```javascript
(function ($) {
  // Runs when the DOM is ready
  $(function () {
    // Ensure Showpass SDK and JS-Cookie are available
    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined" &&
      typeof Cookies !== "undefined"
    ) {
      // Listen for cart count changes
      showpass.tickets.addCartCountListener(function (count) {
        var cartDisplayText = count > 0 ? "Cart (" + count + ")" : "Cart";

        // Update your cart display element
        // TODO: Replace this selector with something that matches your theme
        $(".your-cart-count-display-element").text(cartDisplayText);

        // Optional: persist the display text in a cookie if needed
        // Cookies.set('showpass_cart_display_text', cartDisplayText, { expires: 7, path: '/' });
      });

      // Make a chosen element open the checkout widget when clicked
      // TODO: Replace this selector with a clickable element in your header/menu
      $(".your-cart-click-trigger-element").on("click", function (event) {
        event.preventDefault(); // important if it's an <a> tag

        showpass.tickets.checkoutWidget({
          "theme-primary": "#9e2a2b", // primary color (change to match your brand)
          "keep-shopping": true       // true = "Keep Shopping", false = "Close"
        });
      });
    } else {
      console.warn(
        "Showpass SDK or JS-Cookie library not detected. Custom cart counter will not work."
      );
    }
  });
})(jQuery);
```

---

## Adding the code to WordPress

### 1. Create a custom JS file

1. In your (child) theme, create a file such as:
   `wp-content/themes/your-child-theme/js/my-showpass-cart.js`
2. Paste the JavaScript code above into that file.
3. Update the selectors (see below) before deploying to production.

### 2. Enqueue the script in `functions.php`

In your child theme’s `functions.php` (or a custom plugin), enqueue your script:

```javascript
function my_theme_enqueue_showpass_cart() {
    // If you *need* to load JS-Cookie manually, uncomment below:
    // wp_enqueue_script(
    //     'js-cookie',
    //     'https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js',
    //     array(),
    //     '3.0.1',
    //     true
    // );

    wp_enqueue_script(
        'my-showpass-custom-cart',
        get_stylesheet_directory_uri() . '/js/my-showpass-cart.js',
        array('jquery'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_showpass_cart');
```

If you’re using a code-snippets plugin, you can instead paste the JavaScript into a “front-end JS” snippet (no need to enqueue a file).

---

## Customizing the jQuery selectors (critical)

You **must** point the code at real elements on your site.

### Example HTML

Imagine your theme has a nav item like:

```html
<li id="main-nav-cart-item" class="menu-item special-cart-link">
  <a href="/cart">
    <i class="fa fa-shopping-cart"></i>
    <span class="cart-items-text-holder">Cart</span>
  </a>
</li>
```

Then you might set:

```javascript
// Show "Cart (X)" here
$("#main-nav-cart-item .cart-items-text-holder").text(cartDisplayText);

// Make this link open the widget instead of going to /cart
$("#main-nav-cart-item a").on("click", function (event) {
  event.preventDefault();
  showpass.tickets.checkoutWidget({
    "theme-primary": "#9e2a2b",
    "keep-shopping": true
  });
});
```

To discover your own selectors:

1. Open your site in a browser.
2. Right-click the element you want to use and choose **Inspect**.
3. Note its `id` or `class` and update the jQuery selectors accordingly.

---

## Optional widget tweaks

Inside `showpass.tickets.checkoutWidget({...})` you can adjust:

* **`"theme-primary"`** – Hex color for the widget’s primary accents.
* **`"keep-shopping"`** –

  * `true` → close button says “Keep Shopping”.
  * `false` → close button says “Close”.

---

## Important considerations

* **Use a child theme**
  Custom code in parent theme files can be lost on update. A child theme or code-snippets plugin is safer.
* **Check the browser console**
  If the counter doesn’t work, press **F12 → Console** and look for errors like:

  * `showpass is not defined`
  * `Cookies is not defined`
  * `$(...).on is not a function` (usually a selector or jQuery loading issue)
* **SDK must be present**
  The code requires the Showpass SDK (`showpass.tickets`) to be loaded. The WordPress plugin handles this on normal pages.
* **Theme changes**
  If your theme update changes header markup, you may need to update your selectors.

With this approach, you can integrate a Showpass cart counter directly into your site’s navigation, keeping the cart experience consistent with your overall design.
