# Admin meta box: URL & Shortcode Generator

The Showpass WordPress plugin includes a helpful meta box in the page and post editor that automatically generates shortcodes from Showpass event URLs. This feature saves time by eliminating the need to manually extract event slugs or IDs.

---

## What is the meta box?

When editing a page or post in WordPress, you'll see a **"Showpass URL & Shortcode Generator"** meta box that allows you to:

1. Paste a Showpass event URL
2. Automatically generate the correct `[showpass_widget]` shortcode
3. Copy the shortcode directly into your page content

---

## Requirements

### Access token must be configured

The meta box **only appears** when you have configured the `option_showpass_access_token` setting.

**Important:** The access token setting is not available in the admin settings page UI. It must be set programmatically (via code, database, or WordPress filter/hook).

**To enable the meta box:**

The access token needs to be set using one of these methods:
- Programmatically via code: `update_option('option_showpass_access_token', 'your-token-here');`
- Directly in the WordPress database
- Via a WordPress filter/hook

**Note:** If you don't see the meta box, check that:
- You have the access token configured (via one of the methods above)
- You're editing a **Page** or **Post** (not other post types)
- Your user account has permission to edit posts

---

## How to use

### Step 1: Open the page/post editor

1. Go to **Pages → Add New** (or edit an existing page)
2. Or go to **Posts → Add New** (or edit an existing post)

### Step 2: Locate the meta box

Scroll down in the editor to find the **"Showpass URL & Shortcode Generator"** meta box. It typically appears below the main content editor.

### Step 3: Paste a Showpass URL

1. Copy a Showpass event URL from your browser or Showpass dashboard
   - Example: `https://www.showpass.com/my-awesome-concert/`
2. Paste it into the **"Event URL"** field in the meta box
3. Click **Submit**

### Step 4: Copy the generated shortcode

After submitting, the meta box will display:
- **URL:** The processed URL (if applicable)
- **Shortcode:** The generated `[showpass_widget]` shortcode

**Example output:**
```
URL: https://www.showpass.com/my-awesome-concert/
Shortcode: [showpass_widget slug="my-awesome-concert" label="Get Tickets"]
```

### Step 5: Use the shortcode

1. Copy the generated shortcode
2. Paste it into your page content (in a Shortcode block or directly)
3. Publish or update your page

---

## What URLs are supported?

### Showpass event URLs

The meta box can process standard Showpass event URLs:

- `https://www.showpass.com/event-slug/`

**What happens:**
- The plugin extracts the event slug from the URL
- Generates a `[showpass_widget slug="event-slug"]` shortcode
- Includes default button label ("Get Tickets")

### Non-Showpass URLs

If you paste a URL that's not from Showpass, the plugin may attempt to create an event in Showpass (if your access token has permissions). This is an advanced feature and requires proper API credentials.

---

## Troubleshooting

### Meta box doesn't appear

**Check these items:**

1. **Access token is set:**
   - Go to **Showpass API** settings
   - Verify `option_showpass_access_token` has a value
   - Save if you just added it

2. **You're editing the right post type:**
   - Meta box only appears on **Pages** and **Posts**
   - Won't appear on custom post types unless specifically enabled

3. **User permissions:**
   - Your account must have `edit_posts` capability
   - Contact your WordPress administrator if needed

4. **Plugin is active:**
   - Go to **Plugins → Installed Plugins**
   - Ensure **Showpass WordPress Extension** is activated

### "Error" message appears

**Possible causes:**

- **Invalid URL format:** Ensure the URL is a complete, valid Showpass event URL
- **Event doesn't exist:** The event may have been deleted or the slug changed
- **Access token issues:** Your token may be invalid or expired
- **Network error:** Check your internet connection and try again

**Solutions:**

- Verify the URL works by opening it in a browser
- Check that the event exists in your Showpass dashboard
- Re-enter your access token in plugin settings
- Try again after a few moments

### Shortcode doesn't work after pasting

**Common issues:**

- **Curly quotes:** WordPress may convert straight quotes to curly quotes
  - **Solution:** Use the Shortcode block instead of pasting directly
- **Extra spaces:** Ensure no extra spaces around the shortcode
- **Plugin deactivated:** Verify the plugin is still active

---

## Tips and best practices

### Use Shortcode blocks

Instead of pasting the shortcode directly into a Paragraph block:

1. Add a **Shortcode** block to your page
2. Paste the generated shortcode into the block
3. This prevents WordPress from auto-formatting quotes

### Verify the shortcode

After generating, test the shortcode:

1. Preview the page
2. Click the generated button
3. Verify the correct event widget opens

### Keep URLs handy

Save Showpass event URLs in a document for quick reference when creating multiple pages.

---

## Alternative: Manual shortcode creation

If the meta box isn't available or you prefer manual entry:

1. Extract the event slug from the Showpass URL
   - From: `https://www.showpass.com/my-event/`
   - Slug: `my-event`
2. Create the shortcode manually:
   ```text
   [showpass_widget slug="my-event"]
   ```

See **[Adding a single button widget](./02-adding-single-button-embed-widget)** for complete parameter documentation.

---

## Next steps

Now that you know how to use the meta box generator:

- **[Adding a single button widget](./02-adding-single-button-embed-widget)** – Learn all widget parameters
- **[Adding event lists](./03-adding-event-list)** – Display multiple events
- **[Tips and troubleshooting](./13-tips-and-troubleshooting)** – Common issues and solutions

---

## Additional resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress Meta Boxes:** [developer.wordpress.org/plugins/metadata/custom-meta-boxes](https://developer.wordpress.org/plugins/metadata/custom-meta-boxes/)

