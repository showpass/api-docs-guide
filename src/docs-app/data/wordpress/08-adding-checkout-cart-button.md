# Adding a checkout / shopping cart button with `[showpass_cart_button]`

The `[showpass_cart_button]` shortcode adds a cart/checkout entry point to your site. It lets customers:

- Open the Showpass shopping cart and checkout widget.
- Review items they’ve selected (tickets, products, memberships).
- Complete their purchase.

The button is updated by the Showpass script to include the current item count (e.g. **“Shopping Cart (3)”**).

---

## Basic cart button

To add a standard cart button:

1. Go to the WordPress page or post where you want the cart button.
2. Add a **Shortcode** block.
3. Enter:

```text
[showpass_cart_button]
````

This displays a button that opens the Showpass cart/checkout widget in a pop-up.

---

## Embedding the cart directly on a page

You can also embed the full cart and checkout interface directly into a page (e.g. a dedicated **“Checkout”** page):

```text
[showpass_cart_button embedded="true"]
```

This renders the cart widget inline on the page instead of showing a button.

---

## Parameters for `[showpass_cart_button]`

### `embedded="true|false"`

* **Use case:** Choose between a button + pop-up or an embedded cart.
* **Values:**

  * `"false"` (default) – Show a button that opens the cart in a pop-up.
  * `"true"` – Embed the cart/checkout widget directly on the page.
* **Example (embedded checkout page):**

  ```text
  [showpass_cart_button embedded="true"]
  ```

### `lang="fr"`

* **Use case:** Set the cart/checkout widget interface language.
* **Behavior:**

  * If omitted, the widget uses English.
  * `lang="fr"` switches the widget UI to French.
* **Examples:**

  ```text
  [showpass_cart_button lang="fr"]
  [showpass_cart_button embedded="true" lang="fr"]
  ```

---

## Where to place the cart button

Common placements:

* **Site header** – Most visible and convenient.
* **Persistent sidebar** – If your theme supports it.
* **Dedicated checkout page** – Using `embedded="true"` for a full-page checkout experience.
* **Footer/menu item** – As an additional entry point.

A clearly visible cart button makes it easier for customers to find their cart and complete checkout, especially when they’re browsing multiple events or products.