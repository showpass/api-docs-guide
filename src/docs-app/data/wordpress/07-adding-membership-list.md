# Adding a membership list with `[showpass_memberships]`

If your organization offers memberships through Showpass, you can showcase them on your WordPress site using the `[showpass_memberships]` shortcode. This lets visitors see your membership options and sign up directly from your site.

---

## Basic membership list

To add a basic membership list:

1. Go to the WordPress page or post where you want to display your memberships.
2. Add a **Shortcode** block.
3. Enter:

```text
[showpass_memberships]
```

By default, memberships are displayed in a **grid** layout, showing **8 membership groups per page** (with pagination if there are more).

---

## Customizing your membership list: parameters

You can control the layout and which memberships are shown using these parameters:

---

### `template="grid|data"`

* **Use case:** Change how the membership list is rendered, or return raw data.
* **Values:**

  * `"grid"` (default) – Memberships in a grid layout (standard behavior).
  * `"data"` – Returns raw membership data (JSON) for use in a custom PHP template.
* **Example:**

  ```text
  [showpass_memberships template="grid"]
  ```

*(For fully custom layouts, see “Creating Custom Templates”.)*

---

### `page_size="number"`

* **Use case:** Control how many membership groups are shown per page.
* **Default:** `8`
* **Example (show 10 memberships per page):**

  ```text
  [showpass_memberships page_size="10"]
  ```

---

### `membership_ids="id1,id2,id3"`

* **Use case:** Show only specific membership groups instead of all available memberships.
* **What it is:** A comma-separated list of Showpass **Membership Group IDs**, found in your Showpass dashboard.
* **Example (show only memberships 2, 6, and 7):**

  ```text
  [showpass_memberships membership_ids="2,6,7"]
  ```

---

### `show_widget_description="true|false"`

* **Use case:** Force the purchase widget’s description panel to show or hide when a membership is opened, overriding the global admin setting.
* **Example:**

  ```text
  [showpass_memberships show_widget_description="true"]
  ```

---

### `lang="fr"`

* **Use case:** Set the **widget** interface language when a membership is opened.
* **Behavior:**

  * If omitted, widgets default to English.
  * `lang="fr"` switches the widget UI to French.
* **Example:**

  ```text
  [showpass_memberships lang="fr"]
  ```
* **Important:**
  `lang` affects the **purchase widgets only**, not the membership list template. For a fully French page, use `template="data"` with your own template and keep `lang="fr"` so widgets match the page language.

---

## Example: a customized membership list

```text
[showpass_memberships page_size="10" membership_ids="15,25"]
```

This shortcode will:

1. Display memberships using the default **grid** layout.
2. Show **10 membership groups per page** (`page_size="10"`).
3. Only include membership groups with IDs **15** and **25** (`membership_ids="15,25"`).

When a visitor clicks a membership option in the list, the Showpass widget typically opens so they can purchase that membership.