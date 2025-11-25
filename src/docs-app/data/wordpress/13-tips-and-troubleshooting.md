# Tips and troubleshooting

Common solutions and best practices to help you get the most out of the Showpass WordPress plugin.


## Understanding shortcodes

Shortcodes are the backbone of this plugin—small snippets of text in square brackets `[]` that WordPress transforms into dynamic Showpass content.

### Shortcode anatomy

```text
[showpass_events parameter="value" parameter_2="value"]
```

**Components:**

- **`[ ]`** (square brackets) – Required to define a shortcode
- **`showpass_events`** (shortcode tag) – Tells WordPress which Showpass feature to load
- **`parameter="value"`** – Options that control behavior and display
- **Multiple parameters** – Can be combined in one shortcode

**Key points:**

- Use **straight quotes** (`"` or `'`), not curly quotes (`"` or `"`)
- Only one shortcode tag per set of brackets
- Parameters are optional; defaults are used when omitted
- Parameter order doesn't matter

---

## Common issues and solutions

### Event list is empty or shows wrong events

**Likely cause:** Incorrect or missing Organization ID

**Solution:**

1. Go to **WordPress Admin → Showpass API**
2. Verify **Organization ID** matches your Showpass account
3. Find your Organization ID in Showpass dashboard under **Organization/Venue Settings**
4. Save changes in WordPress

> **Note:** If the Organization ID is wrong or blank, no events (or incorrect events) will display.

---

### Shortcode appears as plain text

#### Issue A: Curly quotes

**Symptoms:**
- Shortcode shows as text on the page
- Layout is broken or nothing renders

**Solution:** Use straight quotes, not curly "smart" quotes

✅ **Correct:**
```text
[showpass_events type="list" tags="concert"]
[showpass_events type='list' tags='concert']
```

❌ **Incorrect (curly quotes):**
```text
[showpass_events type="list" tags="concert"]
```

> **Tip:** Curly quotes often come from copying from Word, Google Docs, or email. Paste as plain text or use the Shortcode block in WordPress.

---

#### Issue B: Typos in shortcode

**Common mistakes:**

- Incorrect tag: `showpas_events` instead of `showpass_events`
- Wrong parameter: `pagesize` instead of `page_size`
- Mixed quotes: `type="list'` (mixes double and single quotes)

**Solution:** Double-check spelling and syntax against documentation examples.

---

#### Issue C: Plugin not active

**Symptoms:** All shortcodes show as plain text

**Solution:**

1. Go to **Plugins** in WordPress admin
2. Find **Showpass WordPress Extension**
3. Click **Activate** if not already active

---

### Widget shows wrong item or error

**Issue:** Purchase widget opens but displays incorrect event or shows error

#### For events

```text
[showpass_widget slug="your-event-slug"]
```

**Finding the correct slug:**

1. Go to your event page on Showpass.com
2. Check the URL: `https://www.showpass.com/my-big-show-2024/`
3. The slug is: `my-big-show-2024`

**Do NOT include:**
- `https://www.showpass.com/`
- Trailing slashes
- Extra spaces

---

#### For products/memberships

```text
[showpass_widget type="product" id="12345"]
[showpass_widget type="membership" id="67890"]
```

**Finding the ID:**

1. Log in to Showpass dashboard
2. Go to Products or Memberships section
3. Note the numeric ID (not the name)
4. Ensure `type` matches (`product` or `membership`)

---

### "Connection is blocked" or widget not loading

**Likely cause:** WordPress site domain not whitelisted in Showpass settings

**Solution:**

1. Log in to your Showpass dashboard
2. Go to **Settings → Website Integration**
3. Add your WordPress domain to the **Allowed Domains** list:
   - Include: `https://yourwebsite.com`
   - Also add: `https://www.yourwebsite.com` if applicable
4. Save changes
5. Clear browser cache and test again

> **Note:** This is a security feature that prevents unauthorized sites from embedding your content.

---

### Styles conflict with theme

**Symptoms:**
- Widget button looks wrong
- Event list layout is broken
- Text colors are unreadable

**Solution:** Add custom CSS to override styles

#### Method 1: WordPress Customizer

1. Go to **Appearance → Customize → Additional CSS**
2. Add your custom styles:

```css
/* Override button styles */
.showpass-widget-button {
    background-color: #9e2a2b !important;
    color: white !important;
    padding: 12px 24px !important;
    border-radius: 6px !important;
}

/* Fix event list spacing */
.showpass-events-list {
    gap: 2rem !important;
}
```

3. Click **Publish**

---

#### Method 2: Child theme

Add styles to your child theme's `style.css`:

```css
/* Showpass custom overrides */
.showpass-event-item {
    border: 1px solid #ddd;
    border-radius: 8px;
}
```

> **Best practice:** Use a child theme to prevent loss of customizations when the parent theme updates.

---

#### Finding conflicting styles

1. Right-click the problematic element
2. Select **Inspect** or **Inspect Element**
3. View the **Styles** panel in DevTools
4. Identify which CSS rules are applying
5. Override with more specific selectors or `!important`

---

### Changes not appearing

**Issue:** Updated shortcode parameters or plugin settings but nothing changed

**Solutions to try (in order):**

#### 1. Clear browser cache

**Chrome/Edge:**
- Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"

**Or use incognito/private mode:**
- Chrome: `Ctrl+Shift+N` (Windows) or `Cmd+Shift+N` (Mac)
- Firefox: `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)

---

#### 2. Clear WordPress cache plugin

If using a caching plugin (W3 Total Cache, WP Super Cache, WP Rocket):

1. Find the cache plugin in WordPress admin
2. Look for "Clear Cache" or "Purge Cache"
3. Clear all caches

---

#### 3. Clear server-side cache

Some hosts have server-level caching:

- **Cloudflare:** Dashboard → Caching → Purge Everything
- **Host control panel:** Look for "Clear Cache" or "Purge CDN Cache"

---

#### 4. Disable caching temporarily

To test if caching is the issue:

1. Temporarily deactivate caching plugins
2. Test your changes
3. Reactivate if that wasn't the issue

---

### Images not displaying

**Issue:** Event images are broken or missing

**Possible causes:**

1. **Images not uploaded in Showpass:** Check your event in Showpass dashboard
2. **Incorrect image URLs:** View page source and check image `src` attributes
3. **HTTPS/HTTP mismatch:** Ensure images use HTTPS if your site uses HTTPS
4. **Firewall blocking:** Some firewalls block external images

**Solution:**

1. Verify images exist in Showpass dashboard
2. Check browser console for 404 errors
3. Test image URLs directly in a new browser tab
4. Contact Showpass support if images consistently fail

---

### Event list shows events from wrong organization

**Issue:** Seeing events that don't belong to you

**Solution:**

1. Go to **Showpass API** settings
2. Verify the **Organization ID** is correct
3. Get the correct ID from Showpass dashboard
4. Save and clear cache

**For multi-venue organizations:**

Use the `venue_ids` parameter to filter by specific venues:

```text
[showpass_events type="list" venue_ids="123,456"]
```

---

### Calendar widget not displaying correctly

**Issue:** Calendar appears broken or events don't show

**Solutions:**

1. **Check calendar slug:**
   ```text
   [showpass_calendar slug="your-calendar-slug"]
   ```

2. **Verify events are published** in Showpass dashboard

3. **Clear all caches** (browser, WordPress, server)

4. **Check for JavaScript errors:**
   - Open browser DevTools → Console
   - Look for red error messages
   - Share errors with Showpass support if needed

---

### Cart button doesn't update count

**Issue:** Cart counter shows "0" even after adding items

**Possible causes:**

1. Using custom cart counter without proper integration
2. Multiple Showpass scripts loading
3. JavaScript conflicts

**Solutions:**

1. Use standard `[showpass_cart_button]` shortcode first to test
2. Check browser console for JavaScript errors
3. Temporarily disable other plugins to identify conflicts
4. See [Advanced: Dynamic cart counter](./09-advanced-dynamic-cart-counter-jquery) for custom implementations

---

### Pricing table is empty or shows wrong events

**Issue:** `[showpass_pricing_table]` shortcode displays no events or incorrect events

**Possible causes:**

1. Invalid or missing event IDs
2. Events not published/visible
3. Spaces in the `ids` parameter
4. Organization ID mismatch

**Solutions:**

1. **Verify Event IDs:** Check that all IDs in the `ids` parameter exist in your Showpass dashboard
2. **Remove spaces:** Ensure no spaces in comma-separated IDs: `ids="123,456"` not `ids="123, 456"`
3. **Check event status:** Events must be published and visible to appear in the table
4. **Verify Organization ID:** Ensure your Organization ID in plugin settings matches the events' organization
5. **Test individual events:** Try using `[showpass_widget]` with each event ID to verify they're accessible

---

### Admin meta box doesn't appear

**Issue:** "Showpass URL & Shortcode Generator" meta box is not visible in page/post editor

**Possible causes:**

1. Access token not configured
2. Wrong post type
3. User permissions
4. Plugin not active

**Solutions:**

1. **Check access token:** Go to **Showpass API** settings and verify `option_showpass_access_token` is set
2. **Verify post type:** Meta box only appears on **Pages** and **Posts**, not custom post types
3. **Check permissions:** Your user account must have `edit_posts` capability
4. **Verify plugin:** Ensure Showpass WordPress Extension is activated
5. **Refresh page:** After adding access token, refresh the editor page

See [Admin meta box documentation](./15-admin-meta-box-shortcode-generator) for complete details.

---

### Default behaviors not working as expected

**Issue:** Events or widgets behave differently than documented

**Common default behaviors to be aware of:**

1. **`only_parents` defaults to `true`:** Event lists show only parent events by default, not individual occurrences
   - **Solution:** Add `only_parents="false"` to show all occurrences

2. **Custom `class` disables icon:** When using `class` parameter in `[showpass_widget]`, the default ticket icon is not included
   - **Solution:** Add your own icon via CSS or use the default `showpass-button` class

3. **Default button label:** Widget buttons default to "Get Tickets" (not "Tickets")
   - **Solution:** Use `label="Your Text"` to customize

---

## Best practices

### Use shortcode blocks

In the WordPress block editor:

1. Click **+** to add a new block
2. Search for "Shortcode"
3. Paste your shortcode into the Shortcode block

**Benefits:**
- Prevents WordPress from auto-formatting quotes
- Reduces chance of syntax errors
- Easier to edit later

---

### Test before deploying

Before launching:

1. **Test on staging site** if available
2. **View in multiple browsers** (Chrome, Firefox, Safari, Edge)
3. **Test on mobile devices** (phone and tablet)
4. **Complete a test purchase** (use test mode if available)
5. **Verify tracking** (affiliate links, Google Analytics)

---

### Keep plugin updated

Regularly check for updates:

1. Go to **Dashboard → Updates** in WordPress
2. Install Showpass plugin updates when available
3. Review release notes for new features and fixes

---

### Use child themes

Always use a child theme for customizations:

**Why:**
- Parent theme updates won't overwrite your changes
- Easier to troubleshoot issues
- More maintainable long-term

**How to create:** [WordPress Child Themes Guide](https://developer.wordpress.org/themes/advanced-topics/child-themes/)

---

### Document your customizations

Keep notes about:

- Custom CSS added
- Shortcode parameters used
- Template modifications
- JavaScript customizations

**Where to document:**

- WordPress page/post notes
- Separate documentation file
- Comments in code files
- Team wiki or shared document

---

## Getting help

### Check the documentation

1. Review all WordPress plugin documentation pages
2. Check Showpass support articles
3. Search for similar issues in support forums

---

### Contact Showpass support

When contacting support, provide:

1. **WordPress version** (Dashboard → Updates)
2. **Plugin version** (Plugins → Installed Plugins)
3. **Active theme name**
4. **Description of the issue** with specific examples
5. **Screenshots** if applicable
6. **Browser console errors** (copy/paste or screenshot)
7. **Steps to reproduce** the issue

---

### WordPress debugging

Enable WordPress debug mode in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check the log file at `wp-content/debug.log` for errors.

> **Important:** Disable debug mode on production sites after troubleshooting.

---

## Additional resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress documentation:** [wordpress.org/documentation](https://wordpress.org/documentation/)
- **WordPress support forums:** [wordpress.org/support](https://wordpress.org/support/)
