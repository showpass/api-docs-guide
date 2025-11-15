# Adding a single button or embeddable widget with `[showpass_widget]`

The Showpass WordPress plugin lets you add **“Buy Now”** buttons or embed the full **purchase widget** directly on your pages and posts using the `[showpass_widget]` shortcode. This is ideal for linking to a specific event, product, or membership, or for creating a dedicated ticketing page.

## What is a shortcode?

A shortcode is a small piece of text wrapped in square brackets `[]` that WordPress replaces with dynamic content. In this case, WordPress replaces `[showpass_widget]` with a button or an embedded Showpass widget.

---

## How to add the `[showpass_widget]` shortcode

1. Go to the WordPress page or post where you want the button or embedded widget.

2. In the editor, click the **+** icon to add a new block.

3. Search for and add the **Shortcode** block.

   ![Shortcode](/images/wordpress/shortcode.png)

4. Inside the Shortcode block, type the `[showpass_widget]` shortcode with the parameters you need.

5. Click **Update** or **Publish** on your page/post.

   ![Shortcode add](/images/wordpress/showpass-events.png)

> You can also paste the shortcode directly into a standard Paragraph block in most themes/editors.

---

## Basic button usage

To add a simple button that opens the Showpass purchase widget in a pop-up:

```text
[showpass_widget slug="your-event-slug"]
```

* Replace `your-event-slug` with the actual slug from your event URL.
  Example: For `https://showpass.com/my-awesome-concert`, the slug is `my-awesome-concert`.

This creates a button with the default label **“Tickets”**. When clicked, the Showpass widget opens and allows customers to purchase tickets for that event.

---

## Embedding the widget directly on the page

To place the purchase widget directly on the page (embedded mode), instead of showing a button:

```text
[showpass_widget slug="your-event-slug" embedded="true"]
```

This is useful when you want a dedicated ticketing page where customers can purchase without opening a pop-up.

---

## Widget types: events, products, and memberships

The `[showpass_widget]` shortcode supports three types of items via the `type` parameter:

### `type="event"` (default)

For event tickets.

* **Requires:** `slug`
* **Examples:**

  ```text
  [showpass_widget type="event" slug="annual-gala"]
  [showpass_widget type="event" slug="annual-gala" embedded="true"]
  ```

If `type` is omitted, `event` is assumed.

### `type="product"`

For selling merchandise or other products.

* **Requires:** `id` (the product’s numeric ID in Showpass)
* **Examples:**

  ```text
  [showpass_widget type="product" id="12345"]
  [showpass_widget type="product" id="12345" embedded="true"]
  ```

### `type="membership"`

For selling memberships.

* **Requires:** `id` (the membership group’s numeric ID in Showpass)
* **Examples:**

  ```text
  [showpass_widget type="membership" id="67890"]
  [showpass_widget type="membership" id="67890" embedded="true"]
  ```

---

## Customizing your widget: parameters

Parameters are settings you add inside the shortcode to control what the widget loads and how it behaves. Each parameter is written as `name="value"`.

### `slug="your-event-slug"`

* **Use case:** Link to a specific **event** (required for `type="event"` or when no `type` is given).
* **What it is:** The unique part of your Showpass event URL.
  For `showpass.com/halloween-party`, the slug is `halloween-party`.
* **Example:**

  ```text
  [showpass_widget slug="halloween-party"]
  ```

### `id="12345"`

* **Use case:** Link to a **product** or **membership**.
* **What it is:** The numeric ID of the product or membership group in your Showpass dashboard.
* **Examples:**

  ```text
  [showpass_widget type="product" id="5021"]
  [showpass_widget type="membership" id="103"]
  ```

### `label="Button Label"`

* **Use case:** Change the text shown on the button.
  If omitted, the button shows **“Tickets”**.
* **Note:** Ignored when `embedded="true"` (no button is shown).
* **Example:**

  ```text
  [showpass_widget slug="workshop-series" label="Register Now"]
  ```

### `class="your-custom-class"`

* **Use case:** Apply a custom CSS class to style the button.
* **Note:** Ignored when `embedded="true"`.
* **Example:**

  ```text
  [showpass_widget slug="charity-run" class="special-button-style"]
  ```

### `keep_shopping="false"` (or `"true"`)

* **Use case:** Control the text/behavior of the widget’s close button.
* **Defaults:**

  * `"true"` – close button uses the **“Keep Shopping”** behavior/text.
  * `"false"` – close button uses **“Close”** behavior/text.
* **Example:**

  ```text
  [showpass_widget slug="comedy-night" keep_shopping="false"]
  ```

### `embedded="true"` (or `"false"`)

* **Use case:** Choose between a button + pop-up or an embedded widget.
* **Defaults:**

  * `"false"` – show a button that opens the widget in a pop-up.
  * `"true"` – display the widget directly on the page.
* **Example:**

  ```text
  [showpass_widget type="product" id="789" embedded="true"]
  ```

### `show_widget_description="true"` (or `"false"`)

* **Use case:** Force the widget’s description panel to show or hide, overriding the global setting in the Showpass API admin page.
* **Examples:**

  ```text
  [showpass_widget slug="concert-finale" show_widget_description="true"]
  [showpass_widget slug="silent-auction" show_widget_description="false"]
  ```

### `show_specific_tickets="123,456"`

* **Use case:** Show only specific ticket types for an event (e.g., only GA and VIP, hiding other ticket types).
* **What it is:** A comma-separated list of **Ticket Type IDs** (which must be public in Showpass).
* **Example:**

  ```text
  [showpass_widget slug="music-festival" show_specific_tickets="8001,8002"]
  ```

### `lang="fr"`

* **Use case:** Change the widget’s interface language.
* **Currently supported:** `"fr"` for French. If omitted, the widget defaults to English.
* **Examples:**

  ```text
  [showpass_widget slug="summer-fest" lang="fr"]
  [showpass_widget type="product" id="7734" embedded="true" lang="fr"]
  ```

---

## Examples

**Button for an event called “Summer Fest” with a custom label and CSS class:**

```text
[showpass_widget slug="summer-fest" label="Get Summer Fest Tickets!" class="red-button"]
```

**Embedded widget for a product (ID 7734) with the description panel shown:**

```text
[showpass_widget type="product" id="7734" embedded="true" show_widget_description="true"]
```

**Button for a membership (ID 205) that says “Join Our Club” and uses “Close” for the widget’s close button:**

```text
[showpass_widget type="membership" id="205" label="Join Our Club" keep_shopping="false"]
```

Remember to replace the example **slugs**, **IDs**, and **labels** with your actual Showpass data.
