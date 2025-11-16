# Getting started with the Showpass WordPress plugin

Welcome to the Showpass WordPress plugin. This guide will help you install and configure it on your WordPress site to display events, sell tickets, and manage products seamlessly.


## Prerequisites

Before you start, ensure you have:

- **WordPress website** with admin access (typically `yourwebsite.com/wp-admin`)
- **Showpass account** with an Organization ID
- **Admin permissions** to install and activate plugins

> **Don't have a Showpass account?** Register at [showpass.com/organizations/register](https://www.showpass.com/organizations/register/)

---

## Installation

### Method 1: Automatic installation (recommended)

1. Log in to your WordPress dashboard
2. Go to **Plugins → Add New**
3. In the search bar (top right), type **"Showpass"**
4. Find **"Showpass WordPress Extension"** in the results
5. Click **Install Now**

![Showpass WordPress Extension search result](/images/wordpress/wp-install.png)

6. When installation finishes, click **Activate**

---

### Method 2: Manual installation

If automatic installation doesn't work:

1. Download the plugin ZIP file from the WordPress plugin repository
2. Go to **Plugins → Add New → Upload Plugin**
3. Click **Choose File** and select the ZIP file
4. Click **Install Now**
5. After installation, click **Activate Plugin**

---

## Configuration

After activating the plugin, connect it to your Showpass account.

### Access plugin settings

1. In your WordPress admin dashboard, click **Showpass API** in the left-hand sidebar
2. You'll see the plugin configuration page

---

### Required settings

#### Organization ID

**Parameter:** Organization ID (required)

This is your venue/organization ID in Showpass. The plugin uses it to load your events and products.

**How to find it:**

1. Log in to your Showpass dashboard
2. Go to `https://www.showpass.com/dashboard/venues/edit/`
3. Look for **Organization Info** in your organizer dashboard
4. Copy the **Organization ID**
5. Paste it into the WordPress plugin settings

**Example:** If your Organization ID is `3823`, the plugin will fetch all events for organization `3823`.

---

#### Widget Color

**Parameter:** Widget Color (optional)

The primary color of the Showpass purchase widget (the pop-up checkout modal).

**Value:** Hex color code (e.g., `#ff0000` for red)

**Purpose:** Match the widget to your site's branding

**Example:**
```text
#9e2a2b (Showpass red)
#0066cc (Blue)
#28a745 (Green)
```

---

#### Keep Shopping Button

**Parameter:** Keep Shopping (optional)

Controls the text on the button that closes the purchase widget.

**Default:** "Keep Shopping"

**Common alternatives:**
- "Close"
- "Back to Events"
- "Continue Browsing"
- "Return to Site"

---

### Save your settings

1. After filling in all fields, click **Save Changes**
2. You should see a success message

![Showpass plugin config](/images/wordpress/wp-config.png)

---

## Important: Website domain whitelisting

For the plugin and widgets to work correctly, your website's domain must be added in the **Integrations** section of your Showpass dashboard.

### How to whitelist your domain

1. Log in to your Showpass dashboard
2. Go to **Settings → Website Integration**
3. Add your WordPress domain to the **Allowed Domains** list:
   - Include both: `https://yourwebsite.com` and `https://www.yourwebsite.com`
4. Save changes

**If widgets don't load or appear blocked, check this setting first.**

> **Why is this required?** This is a security feature that prevents unauthorized sites from embedding your ticketing content.

---

## Verify installation

After configuration, verify everything works:

### Test 1: Check plugin status

1. Go to **Plugins → Installed Plugins**
2. Confirm **Showpass WordPress Extension** shows as **Active**

### Test 2: Add a test shortcode

1. Create a new page or post
2. Add a Shortcode block
3. Enter: `[showpass_events type="list"]`
4. Preview the page
5. You should see your events displayed

If events appear, your installation is successful!

---

## Troubleshooting installation issues

### Plugin not appearing in search

- **Check WordPress version:** Ensure you're running a compatible version
- **Try manual installation:** Use Method 2 above
- **Clear WordPress cache:** If using a caching plugin, clear it

### "Connection blocked" error

- **Whitelist your domain** in Showpass dashboard (see above)
- **Check for HTTPS:** Ensure your site uses HTTPS if required
- **Test different pages:** Try the widget on various pages

### Events not loading

- **Verify Organization ID** is correct
- **Check event status** in Showpass dashboard (must be published)
- **Clear browser cache** and test again

---

## Next steps

Your Showpass WordPress plugin is now installed and configured! You're ready to start adding Showpass content to your site.

### Explore these guides next

- **[Adding a "Buy Now" button](./02-adding-single-button-embed-widget)** – Create ticket purchase buttons for events, products, or memberships
- **[Display event lists](./03-adding-event-list)** – Show your upcoming events in grid or list format
- **[Add event detail pages](./04-adding-event-detail-page)** – Create dedicated pages for individual events
- **[Embed a calendar widget](./05-adding-calendar-widget)** – Display an interactive event calendar

---

## Getting help

If you encounter issues:

1. **Check documentation:** Review all plugin guides thoroughly
2. **Contact Showpass support:** Visit [help.showpass.com](https://help.showpass.com/hc/en-us) for assistance
3. **Review troubleshooting guide:** See the [Tips and Troubleshooting](/wordpress/13-tips-and-troubleshooting) section

---

## Additional resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress documentation:** [wordpress.org/documentation](https://wordpress.org/documentation/)
- **Plugin repository:** [wordpress.org/plugins](https://wordpress.org/plugins/)
