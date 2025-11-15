# Adding an event detail page with `[showpass_events]`

An Event Detail page is a dedicated page on your website that shows all the information for a single event: name, description, date, time, location, image, and the Showpass purchase widget.

Using event detail pages creates a richer experience than sending users straight to Showpass from an event list.

---

## How it works

1. You create a generic WordPress page (e.g. `yourwebsite.com/event-detail`).
2. You add the shortcode `[showpass_events type="detail"]` to that page.
3. Your event list shortcode (`[showpass_events type="list" ...]`) is configured with a `detail_page` parameter that points to this page.
4. When a user clicks an event in the list, they’re sent to the detail page with a URL like `?slug=…` or `?id=…`.  
   The detail shortcode reads those URL parameters and loads the correct event.

---

## Steps to create an event detail page

### 1. Create a new WordPress page

1. In the WordPress admin, go to **Pages → Add New**.
2. Give the page a title, such as **“Event Detail”** or **“Event Information”**.  
   The actual event name will be rendered by the shortcode.
3. Check the page **slug/permalink**. For example:
   - Title: `Event Detail`
   - Slug: `event-detail`  
   In this example, the page URL would be `yourwebsite.com/event-detail`.

### 2. Add the shortcode

1. On this new page, add a **Shortcode** block.
2. In the block, enter:

```text
[showpass_events type="detail"]
```

This tells the plugin to render the details for a single event based on the URL parameters.

### 3. Publish the page

Click **Publish** to make your event detail page live.

### 4. Update your event list shortcode(s)

1. Go to the page(s) where you display your event list using `[showpass_events type="list"]`.

2. Add the `detail_page` parameter to the shortcode, using the slug of the detail page you just created.

   **Example:** If your detail page slug is `event-detail`:

   ```text
   [showpass_events type="list" detail_page="event-detail"]
   ```

3. If you have multiple event lists, update each one so they all point to the correct detail page.

---

## How the URL works

When a user clicks an event in the list (with `detail_page="event-detail"`), they’re sent to a URL such as:

* `https://yourwebsite.com/event-detail/?slug=the-specific-event-slug`
  or
* `https://yourwebsite.com/event-detail/?id=12345`

The `[showpass_events type="detail"]` shortcode automatically:

1. Checks the URL for `slug` or `id`.
2. Fetches the corresponding event from Showpass.
3. Renders the event details on the page.

You don’t need to create a separate WordPress page for each event — the same detail page works for all events.

---

## Customizing your event detail page: parameters

The `[showpass_events type="detail"]` shortcode doesn’t need many parameters, since it focuses on one event at a time. However, you can customize its behavior with a few options.

### `template="data"`

* **Use case:** Build a completely custom PHP template for your event detail page.
* **Behavior:**

  * Default: Uses the plugin’s `default-detail.php` template.
  * With `template="data"`: Returns raw event data so you can handle output yourself.
* **Example:**

  ```text
  [showpass_events type="detail" template="data"]
  ```

*(See **“Creating Custom Templates”** for more details.)*

### `show_widget_description="true|false"`

* **Use case:** Force the purchase widget’s description panel to show or hide, overriding the global admin setting.
* **Example:**

  ```text
  [showpass_events type="detail" show_widget_description="false"]
  ```

### `lang="fr"`

* **Use case:** Change the **widget** interface language on the event detail page.
* **Behavior:**

  * If omitted, the widget uses English.
  * `lang="fr"` switches the widget UI to French.
* **Example:**

  ```text
  [showpass_events type="detail" lang="fr"]
  ```
* **Important:**
  `lang` affects the **purchase widget only**, not the HTML of the detail template itself.
  For a fully French detail page, use `template="data"` with your own French template and include `lang="fr"` so the widget matches.

---

## What an event detail page shows by default

With:

```text
[showpass_events type="detail"]
```

the default template typically includes:

* Event name
* Event image/banner
* Event date & time
* Event location
* Event description
* Embedded Showpass ticket purchasing widget

This gives each event a complete, self-contained page on your site, keeping visitors on your domain and providing a more polished experience than linking directly out to Showpass.