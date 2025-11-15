# Tips & troubleshooting for the Showpass WordPress plugin

Here are some common tips and troubleshooting steps to help you get the most out of the Showpass WordPress plugin and resolve issues quickly.

---

## Understanding shortcodes

Shortcodes are the backbone of this plugin. They are small snippets of text in square brackets `[]` that WordPress transforms into dynamic content from Showpass.

### Shortcode anatomy

Example:

```text
[showpass_events parameter="value" parameter_2="value"]
````

* **`[ ]` (square brackets):** Required. Every shortcode starts with `[` and ends with `]`.
* **`showpass_events` (shortcode tag):** Tells WordPress which Showpass feature to load (e.g., `showpass_events` for event lists/details, `showpass_widget` for buy buttons, `showpass_products` for products).
* **`parameter` / `parameter_2` (parameters):** Options that control what the shortcode displays or how it behaves.
* **`="value"` (parameter value):** The specific setting for each parameter. Values are usually quoted.

**Key points:**

* You can include multiple parameters in a single shortcode.
* Only one shortcode tag per set of brackets (no `[showpass_events showpass_widget]`).
* If you omit a parameter, the plugin uses a default value (when one exists).

---

## Common issues & solutions

### 1. Event list is empty or showing the wrong events

**Likely cause:** Incorrect or missing **Organization ID**.

**What to check:**

1. Go to **Showpass API** in your WordPress admin.
2. Confirm that **Organization ID** matches your Showpass organization.
3. In your Showpass dashboard, verify the ID under Organization/Venue settings (e.g., in your “Organization Info” or venues edit page).
4. Save changes in WordPress.

If the Organization ID is wrong or blank, no (or incorrect) events will display.

---

### 2. Shortcode is visible as text or looks broken

#### a) Check your quotes

**Symptoms:**

* The shortcode shows as plain text on the page.
* Layout is broken or shortcode doesn’t render.

**Solution:**

Use **straight quotes**, not curly “smart” quotes.

* ✅ Correct:

  * `[showpass_events type="list" tags="concert"]`
  * `[showpass_events type='list' tags='concert']`
* ❌ Incorrect (curly quotes):

  * `[showpass_events type=”list” tags=”concert”]`

Curly quotes are often introduced when copying from Word, Google Docs, email, etc. Paste as plain text or switch to the **Shortcode** block / HTML mode and fix them manually.

Also avoid mixing quote types within the same value (e.g., `type="list'`).

#### b) Check for typos

* Ensure the shortcode tag is correct:
  `showpass_events`, `showpass_widget`, `showpass_products`, `showpass_memberships`, etc.
* Check parameter names: `page_size`, `detail_page`, `ordering`, etc. (not `pagesize`, `details_page`, etc.).

#### c) Make sure the plugin is active

If shortcodes show as plain text:

1. Go to **Plugins** in WordPress admin.
2. Confirm **Showpass WordPress Extension** is installed and **Activated**.

---

### 3. The purchase widget opens, but shows the wrong item or an error

**Check the `slug` (events) or `id` (products/memberships).**

#### For events

```text
[showpass_widget slug="your-event-slug"]
```

* `slug` = the part of the Showpass URL after `showpass.com/`.
* Example:

  * Event URL: `https://www.showpass.com/my-big-show-2024/`
  * Slug: `my-big-show-2024`
* Do **not** include:

  * `https://www.showpass.com/`
  * Extra spaces
  * Trailing slashes

#### For products / memberships

```text
[showpass_widget type="product" id="12345"]
[showpass_widget type="membership" id="67890"]
```

* `id` = the numeric ID from your Showpass dashboard.
* Make sure you’re using the correct ID and type.

---

### 4. "Connection is blocked" / widget not loading

**Likely cause:** Your website domain is not authorized in Showpass.

**Fix:**

1. Log into your Showpass dashboard.
2. Go to your organization / venue settings (look for **Integrations**, **Allowed Domains**, or similar).
3. Add your site domain, e.g.:

   * `yourwebsite.com`
   * (Include both `www.yourwebsite.com` and `yourwebsite.com` if needed.)
4. Save changes.

If the domain isn’t whitelisted, the widget may refuse to load.

---

### 5. Styles look wrong or conflict with your theme

**Symptoms:**

* Buttons look strange or misaligned.
* Event or product grids don’t line up.
* Fonts/colors don’t match your brand.

**What to do:**

1. Open your browser’s **Inspect / Inspector** tool on the problematic element.
2. Check which CSS rules are being applied (theme vs. plugin).
3. Add custom CSS in your theme or child theme to override as needed:

   * Target plugin elements (e.g., `.showpass-widget-button`).
   * Or add your own class via shortcode, for example:

     ```text
     [showpass_widget slug="my-event" class="my-custom-button"]
     ```

   Then style `.my-custom-button` in your CSS.

Using a **child theme** is recommended so your changes aren’t lost on theme updates.

---

### 6. Changes don’t appear right away

**Likely cause:** Caching.

**Steps to try:**

* **Browser cache**

  * Hard refresh the page:

    * Windows: `Ctrl + F5`
    * macOS: `Cmd + Shift + R`
  * Or open the page in a private/incognito window.

* **WordPress caching plugins**

  * If you use plugins like WP Rocket, LiteSpeed Cache, W3 Total Cache, etc., clear their caches from the plugin settings.

* **Server-side caching**

  * Some hosts provide server-level caching (e.g., via your hosting control panel). Clear or purge caches there if available.

* **Showpass data caching**

  * The plugin or API may cache event data briefly for performance.
  * New events or updates may take a few minutes to show.
  * If the plugin offers a **Clear Cache** option in its settings, try using it.

---

If you’ve gone through these steps and still have issues, check:

* The Showpass plugin page on WordPress.org for FAQs and support.
* Showpass support/documentation for known issues, requirements, or recent changes.

