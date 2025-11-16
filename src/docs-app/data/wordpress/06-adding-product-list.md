# Adding a product list

Display merchandise, add-ons, or other non-event items on your WordPress site using the `[showpass_products]` shortcode. Customers can browse and purchase products directly from your site.


## Basic usage

Add products to any page or post:

1. Open the WordPress page editor
2. Add a **Shortcode** block
3. Enter: `[showpass_products]`

By default, this displays products in a **grid layout** with **8 products per page** (pagination included).

---

## Customizing your product list

Control the layout and which products appear using these parameters.

### Layout template

**Parameter:** `template="grid|list|data"`

Choose how products are displayed:

- **`grid`** (default) - Products in a grid layout
- **`list`** - Products in a vertical list
- **`data`** - Returns raw JSON for custom PHP templates

**Example:**

```text
[showpass_products template="list"]
```

> **Note:** Any value other than `"list"` or `"data"` defaults to grid layout.

---

### Products per page

**Parameter:** `page_size="number"`

Control pagination density.

- **Default:** `8`
- **Range:** Any positive integer

**Example:**

```text
[showpass_products page_size="12"]
```

---

### Show specific products

**Parameter:** `product_ids="id1,id2,id3"`

Display only selected products instead of all available ones.

**What you need:** Comma-separated list of Showpass Product IDs (find these in your Showpass dashboard under Products).

**Example:**

```text
[showpass_products product_ids="2,6,7"]
```

---

### Widget description visibility

**Parameter:** `show_widget_description="true|false"`

Override the global admin setting to force show or hide the description panel in the purchase widget.

**Example:**

```text
[showpass_products show_widget_description="true"]
```

---

### Language

**Parameter:** `lang="fr"`

Set the widget interface language.

- **Default:** English
- **Supported:** `fr` (French)

**Example:**

```text
[showpass_products lang="fr"]
```

> **Note:** This only affects the purchase widget language, not the product list template.

---

## Complete example

Combine multiple parameters for precise control:

```text
[showpass_products template="list" page_size="12" product_ids="101,105,115"]
```

This configuration will:

- Display products in a **vertical list**
- Show **12 products per page**
- Include only products **101**, **105**, and **115**

When customers click a product, the Showpass purchase widget opens for checkout.
