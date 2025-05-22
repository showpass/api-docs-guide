# Tips & troubleshooting for the Showpass WordPress plugin

Here are some common tips and troubleshooting steps to help you get the most out of the Showpass WordPress Plugin and resolve any issues you might encounter.

## Understanding shortcodes

Shortcodes are the backbone of this plugin. They are little snippets of text in square brackets `[]` that WordPress magically transforms into dynamic content from Showpass.

### Shortcode anatomy

Let's break down a typical Showpass shortcode:

`[showpass_events parameter="value" parameter_2="value"]`

- **`[ ]` (Square Brackets):** These are essential. All shortcodes start with `[` and end with `]`.
- **`showpass_events` (Shortcode Tag):** This is the main part of the shortcode. It tells WordPress _which_ Showpass function to run (e.g., `showpass_events` for event lists/details, `showpass_widget` for buy buttons, `showpass_products` for product lists).
- **`parameter` / `parameter_2` (Parameters):** These are like settings or options for the shortcode. They modify how the shortcode behaves or what it displays. Not all parameters are needed for every shortcode; many have default values.
- **`="value"` (Parameter Value):** This is the specific setting you're applying to a parameter. The value is usually enclosed in quotes.

**Key Points about Shortcodes:**

- You can have multiple parameters in a single shortcode.
- There's only one main shortcode tag per set of square brackets (e.g., you can't have `[showpass_events showpass_widget]`).
- If you don't provide a parameter, the plugin will use a default value for it.

## Common issues & solutions

### 1. My event list is showing the wrong events (or no events)

- **Check Your Organization ID:**
  - **Symptom:** The list is empty, or it shows events from a completely different organization.
  - **Solution:** The most common cause is an incorrect or missing Organization ID in the plugin settings.
    1.  In your WordPress admin dashboard, go to **Showpass API**. [1, 2]
    2.  Double-check that the **Organization ID** field contains the correct ID for your Showpass venue/organization. [1, 2]
    3.  You can find your Organization ID by logging into your Showpass account and navigating to `https://www.showpass.com/dashboard/venues/edit/` or the 'Organization Info' section. [1, 2]
    4.  Save the changes.

### 2. My shortcode isn't working or looks broken

- **Check Your Quotes:**

  - **Symptom:** The shortcode itself is displayed as plain text on your page, or the layout is completely broken.
  - **Solution:** WordPress shortcodes are picky about the type of quotation marks used for parameter values. You **must** use straight quotes (`"` or `'`), not curly (typographic) quotes (`" "` or `' '`).
    - Correct: `[showpass_events type="list" tags="concert"]`
    - Correct: `[showpass_events type='list' tags='concert']`
    - **Incorrect:** `[showpass_events type=" " tags=" " ]`
  - Many word processors or rich text editors automatically convert straight quotes to curly quotes. When pasting shortcodes, ensure they are plain text or manually correct the quotes in the WordPress editor (using the "Text" or "HTML" mode if necessary, or a "Shortcode" block which usually handles this better).
  - Don't mix quote types within the same parameter (e.g., `parameter="value'`).

- **Check for Typos:**

  - **Symptom:** Shortcode doesn't work, or a specific parameter seems ignored.
  - **Solution:** Carefully check the spelling of the shortcode tag (e.g., `showpass_events`, not `showpass_event`) and all parameter names (e.g., `page_size`, not `pagesize`). Refer to the documentation for correct spellings.

- **Ensure Plugin is Active:**
  - **Symptom:** Shortcode displays as plain text.
  - **Solution:** Go to **Plugins** in your WordPress admin and make sure the "Showpass Wordpress Extension" is activated. [1]

### 3. The purchase widget isn't loading the correct event/product

- **Check the `slug` or `id`:**
  - **Symptom:** You click a "Buy Tickets" button (`[showpass_widget]`), and it shows the wrong event, a "not found" message, or just spins.
  - **Solution (for Events):** Ensure the `slug` parameter in your `[showpass_widget slug="your-event-slug"]` shortcode is correct. The slug is **only** the part of the Showpass event URL _after_ `showpass.com/`.
    - Example: If URL is `https://showpass.com/my-big-show-2024/`, the slug is `my-big-show-2024`.
    - Do NOT include `https://showpass.com/` or any trailing slashes in the `slug` value itself. No spaces.
  - **Solution (for Products/Memberships):** Ensure the `id` parameter in your `[showpass_widget type="product" id="12345"]` (or `type="membership"`) is the correct numerical ID from your Showpass dashboard.

### 4. "Connection is blocked" or widget issues

- **Add Your Domain in Showpass Dashboard:**
  - **Symptom:** The Showpass widget fails to load, shows an error message related to domains or permissions, or you get a "connection is blocked" type of error.
  - **Solution:** Your website's domain name needs to be authorized in your Showpass organization settings.
    1.  Log in to your Showpass dashboard.
    2.  Navigate to your Organization Info (or similar section, often under settings or profile).
    3.  Look for an "Integrations" or "Allowed Domains" section.
    4.  Add your full website domain (e.g., `yourwebsite.com`) to the list.
    5.  Save the changes in Showpass.

### 5. Styles look off or conflict with theme

- **CSS Conflicts:**
  - **Symptom:** Buttons, lists, or widgets look strange, misaligned, or don't match your website's style.
  - **Solution:** This can happen if your WordPress theme's CSS rules conflict with the plugin's default styles.
    - You can use your browser's "Inspect" tool (right-click on the element and choose "Inspect" or "Inspect Element") to identify the CSS rules being applied.
    - You may need to write more specific CSS rules in your theme's `style.css` (or child theme's stylesheet) to override the plugin's styles or your theme's conflicting styles.
    - For `[showpass_widget]` buttons, you can use the `class="your-custom-class"` parameter to add your own CSS class and style it precisely.

### 6. Changes not appearing immediately

- **Caching:**
  - **Symptom:** You've made changes to a shortcode or plugin settings, but you're not seeing them on the live site.
  - **Solution:** This is often due to caching.
    - **Browser Cache:** Try clearing your browser's cache and cookies, or do a "hard refresh" (Ctrl+F5 or Cmd+Shift+R).
    - **WordPress Caching Plugins:** If you use a caching plugin (e.g., WP Rocket, LiteSpeed Cache, W3 Total Cache), clear the cache through that plugin's settings.
    - **Server-Side Caching:** Your web host might also implement server-side caching. Check your hosting control panel for options to clear this.
    - **Showpass Data Cache:** The plugin itself might have a short cache for API data to improve performance. Changes made in Showpass (like new events) might take a few minutes to reflect. Check if the plugin has a "Clear Cache" option in its settings, or wait a bit.

If you've tried these steps and are still having trouble, you can look for support options through Showpass or check the plugin's page on WordPress.org for FAQs or support forums.
