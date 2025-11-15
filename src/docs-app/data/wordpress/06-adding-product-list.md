# Adding a product list with `[showpass_products]`

If you sell merchandise, add-ons, or other non-event items through Showpass, you can display them on your WordPress site using the `[showpass_products]` shortcode. This lets customers browse and purchase your products directly from your site.

---

## Basic product list

To add a basic product list:

1. Go to the WordPress page or post where you want to display your products.
2. Add a **Shortcode** block.
3. Enter:

```text
[showpass_products]
````

By default, products are displayed in a **grid** layout, showing **8 products per page** (with pagination if there are more).

---

## Customizing your product list: parameters

You can control the layout and which products are shown using parameters on the shortcode:

---

### `template="grid|list|data"`

* **Use case:** Change the visual layout or return raw data.
* **Values:**

  * `"grid"` (default behavior) – Products in a grid format.
  * `"list"` – Products in a vertical list format.
  * `"data"` – Returns raw product data (JSON) for custom PHP templates.
* **Example (list view):**

  ```text
  [showpass_products template="list"]
  ```

> Note: Internally, any value other than `"list"` is treated as the grid template unless you explicitly use `"data"`.

---

### `page_size="number"`

* **Use case:** Control how many products appear per page.
* **Default:** `8`
* **Example (show 12 products per page):**

  ```text
  [showpass_products page_size="12"]
  ```

---

### `product_ids="id1,id2,id3"`

* **Use case:** Show only specific products instead of all available ones.
* **What it is:** A comma-separated list of Showpass Product IDs (found in your Showpass dashboard).
* **Example (show only products 2, 6, and 7):**

  ```text
  [showpass_products product_ids="2,6,7"]
  ```

---

### `show_widget_description="true|false"`

* **Use case:** Explicitly show or hide the description panel inside the purchase widget when a product is opened, overriding the global admin setting.
* **Example:**

  ```text
  [showpass_products show_widget_description="true"]
  ```

---

### `lang="fr"`

* **Use case:** Set the **widget** interface language when a product is opened.
* **Behavior:** If omitted, widgets default to English; `lang="fr"` switches them to French.
* **Example:**

  ```text
  [showpass_products lang="fr"]
  ```

---

## Example: a customized product list

```text
[showpass_products template="list" page_size="12" product_ids="101,105,115"]
```

This shortcode will:

1. Display products in a **vertical list** (`template="list"`).
2. Show **12 products per page** (`page_size="12"`).
3. Only include products with IDs **101**, **105**, and **115** (`product_ids="101,105,115"`).

With the standard templates, when a customer clicks on a product, the Showpass widget opens so they can add the product to their cart and purchase it.
