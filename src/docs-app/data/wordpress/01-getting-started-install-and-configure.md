# Getting started with the Showpass WordPress plugin

Welcome to the Showpass WordPress plugin. This guide will help you install and configure it on your WordPress site.

## What you need before you start

- A WordPress website.
- Access to your WordPress admin dashboard (usually `yourwebsite.com/wp-admin`).
- A Showpass account with an Organization ID. If you don't have one, you can register at  
  [https://www.showpass.com/organizations/register/](https://www.showpass.com/organizations/register/).

## Installation

There are two ways to install the Showpass WordPress plugin.

### Method 1: Automatic installation (recommended)

1. Log in to your WordPress dashboard.
2. Go to **Plugins → Add New**.
3. In the search bar (top right), type **“Showpass”**.
4. Find the **“Showpass WordPress Extension”** in the results and click **Install Now**.

   ![Showpass WordPress Extension search result](/images/wordpress/wp-install.png)

5. When the installation finishes, click **Activate**.

## Configuration

After activating the plugin, you need to connect it to your Showpass account.

1. In your WordPress admin dashboard, click the **Showpass API** menu item in the left-hand sidebar.
2. On the settings page, fill in the following fields:

   - **Organization ID**  
     This is the ID of your venue/organization in Showpass. The plugin uses it to load your events and products.
     
     **How to find it:**  
     Log in to Showpass and go to `https://www.showpass.com/dashboard/venues/edit/` or look for **Organization Info** in your organizer dashboard. Copy the **Organization ID** from there and paste it into this field.
     
     _Example:_ If your Organization ID is `3823`, the plugin will fetch all events for organization `3823`.

   - **Widget Color**  
     The primary color of the Showpass purchase widget (the pop-up checkout). Use a hex color code to match your site’s branding.  
     _Example:_ `#ff0000` for red.

   - **Keep Shopping**  
     This controls the text on the button that closes the purchase widget. By default it says **“Keep Shopping”**, but you can change it to “Close”, “Back to Events”, or any text you prefer.

3. Click **Save Changes**.

   ![Showpass plugin config](/images/wordpress/wp-config.png)

### Important note on website domain

For the plugin and widgets to work correctly, your website’s domain must be added in the **Integrations** section under your organization’s settings in the Showpass dashboard. If the widget doesn’t load or appears blocked, check this setting first.

---

That’s it — your Showpass WordPress plugin is now installed and configured. You’re ready to start adding Showpass content (event listings, buy buttons, calendars, and more) to your site using shortcodes.

**Next steps:**

- Learn how to add a **“Buy Now”** button for your events, products, or memberships.
- Explore how to display lists of your events or products.
