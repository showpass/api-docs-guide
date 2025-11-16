# Advanced: Dynamic cart counter with custom JavaScript

The standard `[showpass_cart_button]` shortcode includes a text-based cart counter (e.g., **"Shopping Cart (3)"**). For custom cart displays in your header, navigation, or layout, hook into the Showpass JavaScript SDK to update elements dynamically.

> **⚠️ Advanced customization:** Requires familiarity with HTML, CSS, JavaScript/jQuery, and adding custom code to your theme or via a code-snippets plugin.

---

## What this custom cart counter does

This approach will:

1. **Listen for cart updates** – Detects when the cart item count changes via the Showpass SDK
2. **Update your HTML** – Dynamically updates specified elements (e.g., `Cart` → `Cart (3)`)
3. **Open the Showpass cart** – Makes elements clickable to trigger the checkout widget

---

## Prerequisites

Before you begin, ensure you have:

- **Showpass WordPress plugin activated** (loads the Showpass SDK and `showpass` global object)
- **jQuery** (WordPress loads jQuery by default)
- **JS-Cookie library** (the Showpass plugin loads this automatically)
- **HTML elements to target:**
  - One element for displaying the cart count text
  - One element that should open the cart when clicked

If working outside the plugin context, add JS-Cookie manually:

```html
<script src="https://cdn.jsdelivr.net/npm/js-cookie@3/dist/js.cookie.min.js"></script>
```

---

## Implementation

### Custom JavaScript code

> **Important:** Update the jQuery selectors (`.your-cart-count-display-element` and `.your-cart-click-trigger-element`) to match your theme's HTML structure.

```javascript
(function ($) {
  $(function () {
    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined" &&
      typeof Cookies !== "undefined"
    ) {
      // Listen for cart count changes
      showpass.tickets.addCartCountListener(function (count) {
        var cartDisplayText = count > 0 ? "Cart (" + count + ")" : "Cart";
        $(".your-cart-count-display-element").text(cartDisplayText);
      });

      // Open checkout widget when clicked
      $(".your-cart-click-trigger-element").on("click", function (event) {
        event.preventDefault();
        showpass.tickets.checkoutWidget({
          "theme-primary": "#9e2a2b",
          "keep-shopping": true
        });
      });
    } else {
      console.warn("Showpass SDK or JS-Cookie not detected.");
    }
  });
})(jQuery);
```

---

## Adding the code to WordPress

### Option 1: Create a custom JS file

1. In your (child) theme, create:
   ```text
   wp-content/themes/your-child-theme/js/my-showpass-cart.js
   ```

2. Paste the JavaScript code above

3. Update the selectors before deploying

4. Enqueue the script in `functions.php`:

```php
function my_theme_enqueue_showpass_cart() {
    wp_enqueue_script(
        'my-showpass-cart',
        get_stylesheet_directory_uri() . '/js/my-showpass-cart.js',
        array('jquery'),
        filemtime( get_stylesheet_directory() . '/js/my-showpass-cart.js' ),
        true
    );
}
add_action('wp_enqueue_scripts', 'my_theme_enqueue_showpass_cart');
```

---

### Option 2: Use a code-snippets plugin

1. Install **Code Snippets** or **Simple Custom CSS and JS**
2. Create a new "Front-end JS" snippet
3. Paste the JavaScript code
4. Update the selectors
5. Save and activate

> **Note:** Some snippet plugins automatically wrap code in jQuery's `$(document).ready()`. If yours does, remove the outer wrapper.

---

## Customizing the selectors

### Step 1: Identify your theme's cart element

1. Right-click your cart link and select **Inspect**
2. Note the class or ID (e.g., `<a class="my-theme-cart-link">Cart</a>`)

### Step 2: Update the JavaScript selectors

```javascript
// Replace placeholders with your actual classes:
$(".my-theme-cart-link").text(cartDisplayText);
$(".my-theme-cart-link").on("click", function (event) {
```

**Selector tips:**
- Use a **specific class** or **ID** to avoid conflicts
- Target the correct element if multiple cart links exist
- Test in browser console: `$(".my-theme-cart-link").length` should return `1`

---

## Testing

1. Add an item to your cart using a `[showpass_widget]` button
2. Check if the counter updates to "Cart (1)"
3. Click the cart element to verify the widget opens
4. Add/remove items to test real-time updates

---

## Troubleshooting

### Cart counter doesn't update

- **Verify plugin is active** and shortcodes are on the page
- **Check browser console** for JavaScript errors
- **Confirm selectors match** your theme's HTML structure
- **Test if SDK is loaded:** Type `showpass` in browser console – should see an object

### Cart doesn't open when clicked

- **Ensure `event.preventDefault()`** is present if element is an `<a>` tag
- **Verify click handler selector** matches your clickable element
- **Check for JavaScript conflicts** with other plugins/themes

### Styles look wrong

Add custom CSS to match your theme:

```css
.my-theme-cart-link {
  font-weight: 600;
  color: #9e2a2b;
}
```

---

## Additional resources

- **Showpass SDK documentation:** Contact Showpass support for detailed reference
- **WordPress JavaScript guide:** [developer.wordpress.org/themes/basics/including-css-javascript](https://developer.wordpress.org/themes/basics/including-css-javascript/)
- **jQuery documentation:** [api.jquery.com](https://api.jquery.com/)
