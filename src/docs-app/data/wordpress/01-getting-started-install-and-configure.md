# Getting Started with the Showpass WordPress Plugin

Welcome to the Showpass WordPress Plugin! This guide will help you get the plugin installed and configured on your WordPress website. It's designed to be easy to follow, even if you're not a technical expert.

## What You Need Before You Start

- A WordPress website.
- Access to your WordPress admin dashboard (usually `yourwebsite.com/wp-admin`).
- A Showpass account with an Organization ID. If you don't have one, you can register at [showpass.com/organizations/register/](https://www.showpass.com/organizations/register/).

## Installation

There are two ways to install the Showpass WordPress Plugin:

**Method 1: Automatic Installation (Recommended)**

1.  Log in to your WordPress Dashboard.
2.  Navigate to **Plugins > Add New**. [1]
    - _(Suggested: Include a screenshot of the WordPress menu highlighting "Plugins" and then "Add New")_
3.  In the search bar in the top right-hand corner, type "Showpass".
4.  Locate the "Showpass Wordpress Extension" plugin in the search results and click **Install Now**. [1]
    - _(Suggested: Include a screenshot of the search results with the Showpass plugin highlighted and the "Install Now" button)_
5.  Once the installation is complete, click the **Activate** button. [1]
    - _(Suggested: Include a screenshot of the "Activate" button after installation)_

**Method 2: Manual Installation (If automatic installation fails)**

1.  Download the plugin `.zip` file from the [Showpass GitHub repository](https://github.com/showpass/showpass-wordpress-plugin) (Click on "Code" then "Download ZIP").
2.  Log in to your WordPress Dashboard.
3.  Navigate to **Plugins > Add New**.
4.  Click the **Upload Plugin** button at the top of the page.
5.  Choose the `showpass.zip` file you downloaded and click **Install Now**.
6.  Once the installation is complete, click the **Activate** button.

Alternatively, for manual installation, you can unzip `showpass.zip` and upload the `showpass` folder to the `/wp-content/plugins/` directory via FTP, then activate the plugin through the 'Plugins' menu in WordPress.

## Configuration

After activating the plugin, you need to configure it to connect to your Showpass account.

1.  In your WordPress admin dashboard, find the new "Showpass API" menu item (usually in the left-hand sidebar). Click on it. [1, 2]
    - _(Suggested: Include a screenshot of the WordPress admin menu highlighting the "Showpass API" link)_
2.  You'll see a settings page with the following fields: [1, 2]
    - _(Suggested: Include a screenshot of the Showpass API settings page in WordPress)_
    - **Organization ID**: This is a crucial setting. It's the ID of your venue or organization in Showpass. The plugin will display events and products from this organization.
      - **How to find your Organization ID**: Log in to your Showpass account and go to `https://www.showpass.com/dashboard/venues/edit/` or look for 'Organization Info' in your organizer dashboard. [1, 2] Enter this ID into the field.
      - _Example_: If your Organization ID is `3823`, the plugin will fetch all events from the venue with ID `3823`. [1, 2]
    - **Widget Color**: Enter a hex color code for the primary color of the Showpass purchase widget (the pop-up window where customers buy tickets). This helps match the widget to your website's branding.
      - _Example_: `#ff0000` for red. [1, 2]
    - **Keep Shopping**: This field allows you to customize the text of the button that closes the purchase widget. By default, it says "Keep Shopping". You can change it to "Close" or any other text you prefer. [1, 2]
3.  Click **Save Changes** (or the equivalent button on the page).

**Important Note on Website Domain:**
For the plugin and widgets to function correctly, ensure your website's domain is added to the "Integrations" section under your organization's settings in the Showpass dashboard. This is a common troubleshooting step if you find the connection is blocked.

That's it! Your Showpass WordPress Plugin is now installed and configured. You're ready to start adding Showpass content like event listings, buy buttons, and calendars to your website using simple shortcodes.

**Next Steps:**

- Learn how to add a "Buy Now" button for your events, products, or memberships.
- Explore how to display lists of your events or products.
