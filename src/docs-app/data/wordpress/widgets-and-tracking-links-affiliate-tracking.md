# Widgets and Tracking Links (Affiliate Tracking)

Showpass allows you to use affiliate tracking links to monitor the sales performance of different marketing channels or partners. When a customer arrives at your website through one of these special tracking links, the Showpass WordPress plugin can automatically associate any subsequent purchases made through the `[showpass_widget]` (for events) with that tracking link.

## How Affiliate Tracking Works with the Plugin

1.  **Create an Affiliate Tracking Link in Showpass:**

    - First, you need to generate an affiliate tracking link within your Showpass dashboard. For detailed instructions on how to do this, please refer to the Showpass support documentation: [http://support.showpass.com/event-organizers/tracking-links/affiliate-tracking-links](http://support.showpass.com/event-organizers/tracking-links/affiliate-tracking-links)
    - When you create this link, Showpass will provide you with a unique token (e.g., `8ee54af5`).

2.  **Customer Clicks the Tracking Link:**

    - You share this full tracking link (e.g., `https://www.showpass.com/your-event/?tracking-id=8ee54af5` or however Showpass formats it) in your campaign or with your affiliate.
    - When a customer clicks this link, they are taken to Showpass.

3.  **Using the `aff` Query Parameter on Your Website:**

    - To integrate this with your WordPress site where the Showpass plugin and `[showpass_widget]` shortcode are used, you'll need to get the customer to _your site_ with a special URL parameter.
    - Add the `aff` query parameter to the URL of your website page where the Showpass widget button is. The value of this parameter should be the unique token from your Showpass tracking link.
    - **Example URL for your website:**
      `https://yourwebsite.com/event-page/?aff=8ee54af5`
      (Replace `8ee54af5` with your actual tracking token).
    - When a user visits your site using such a URL, the plugin creates a cookie on their browser that stores this `aff` token.

4.  **Automatic Tracking ID Injection:**
    - The `[showpass_widget]` shortcode (specifically when `type="event"`) is automatically designed to look for this cookie.
    - If the cookie with the `aff` token is present, the plugin will inject the corresponding `tracking-id` into the Showpass purchase widget when it opens.
    - This ensures that the sale is attributed to the correct affiliate or campaign in your Showpass sales reports.

## Examples of URLs with the `aff` Parameter:

- **Linking to a general page on your site:**
  `https://yourwebsite.com/upcoming-events/?aff=your_tracking_token`

- **Linking to a specific event detail page (if using `?event=` or `?slug=` for other plugin functions):**
  `https://yourwebsite.com/event-detail-page/?slug=my-cool-event&aff=your_tracking_token`

## Important Notes:

- **Currently Supported for Events:** The GitHub readme states that this tracking is currently supported for the `[showpass_widget type="event"]` parameter. Check for updates or test if you need it for products or memberships.
- **Cookie-Based:** This method relies on browser cookies. If a user has cookies disabled or clears their cookies, tracking might not work.
- **Widget Interaction:** The tracking ID is applied when the Showpass widget is opened via the `[showpass_widget]` shortcode on your site, after the user has visited your site with the `aff` parameter in the URL.

By using tracking links this way, you can effectively measure the ROI of your promotional efforts and partnerships.
