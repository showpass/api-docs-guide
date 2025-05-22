# Adding a Checkout / Shopping Cart Button with [showpass_cart_button]

The `[showpass_cart_button]` shortcode allows you to add a button to your site that opens the Showpass shopping cart and checkout widget. This is essential for allowing customers to review their selected tickets, products, or memberships and complete their purchase.

The button will dynamically update to show the number of items currently in the user's cart (e.g., "Shopping Cart (3)").

## How to Add the Cart Button

1.  Go to the WordPress page or post where you want the cart button. This is often placed in a website header or a persistent sidebar for easy access.
2.  Add a "Shortcode" block.
3.  Type the shortcode: `[showpass_cart_button]`

**Basic Usage (Button opens pop-up cart):**
`[showpass_cart_button]`

This will display a button, typically saying "Shopping Cart (x)". When clicked, the Showpass cart/checkout widget will open in a pop-up.

## Embedding the Cart Directly on the Page

You can also embed the entire shopping cart and checkout process directly onto a page, for instance, a dedicated "Checkout" page.

**How to Embed the Cart:**
`[showpass_cart_button embedded="true"]`

This will display the cart interface directly within your page content.

### Parameters for `[showpass_cart_button]`:

- **`embedded="true"`** (or `embedded="false"`)

  - **Use Case**: To display the cart/checkout widget directly on the page instead of as a button that opens a pop-up.
  - **`"false"` (Default)**: A button is shown.
  - **`"true"`**: The cart/checkout widget is embedded directly into the page content.
  - **Example (Embedded Cart)**: `[showpass_cart_button embedded="true"]`

- **`label="Your Cart Label"`** (This parameter is not explicitly listed in the readme for `showpass_cart_button` but is common for buttons. Test if needed. The default includes the item count.)
  - **Use Case**: Potentially to change the static part of the button's text, though the item count `(x)` is dynamic.
  - **Example**: `[showpass_cart_button label="View Your Cart"]` (Verify if this customizes the label as expected, or if it's overridden by the dynamic count text).

## Where to Place the Cart Button

- **Website Header**: Most common and user-friendly location.
- **Sidebar**: If your theme has a persistent sidebar.
- **Footer**: Less common, but possible.
- **Dedicated Checkout Page**: If using the `embedded="true"` option.

Having a clearly visible cart button is crucial for a smooth checkout experience.
