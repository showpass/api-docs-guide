# Adding an Event Detail Page with [showpass_events]

An Event Detail page is a dedicated page on your website that shows all the information for a single event. This typically includes the event name, description, date, time, location, image, and the Showpass widget to purchase tickets.

Using event detail pages provides a much richer experience for your users compared to just linking directly to Showpass from an event list.

## How it Works

1.  You create a generic WordPress page (e.g., named "Event Details" with a URL like `yourwebsite.com/event-details`).
2.  You add a special shortcode `[showpass_events type="detail"]` to this page.
3.  When a user clicks on an event from your event list (which you've configured with the `detail_page` parameter), they are taken to this generic page.
4.  The plugin intelligently looks at the URL (specifically a `?slug=` or `?event=` part added to the URL) to figure out _which_ event's details to display on that page.

## Steps to Create an Event Detail Page

1.  **Create a New WordPress Page:**

    - In your WordPress admin dashboard, go to **Pages > Add New**.
    - Give your page a title. This title is usually for internal reference or can be generic like "Event Information" because the actual event name will be displayed by the shortcode. A common practice is to name it something like "Event Detail" or "Show".
    - The **permalink (slug)** of this page is important. For example, if you title it "Event Detail", the slug might become `event-detail`. Let's say you choose `event-detail` for this example.
      - _(Suggested: Include a screenshot of creating a new page and highlighting the permalink/slug field)_

2.  **Add the Shortcode:**

    - On the new page you just created, add a "Shortcode" block.
    - Inside the block, type the following shortcode:
      `[showpass_events type="detail"]`
      - _(Suggested: Include a screenshot of the shortcode block with `[showpass_events type="detail"]`)_
    - This is the basic shortcode. It tells the plugin to display details for a single event.

3.  **Publish the Page:**

    - Click **Publish** to make your event detail page live.

4.  **Update Your Event List Shortcode(s):**
    - Now, go to any page(s) where you have an event list displayed using `[showpass_events type="list"]`.
    - You need to tell this list where to send users when they click for more information on an event. You do this using the `detail_page` parameter.
    - Modify your event list shortcode to include the `detail_page` parameter, setting its value to the slug of the page you created in Step 1.
    - **Example**: If your event detail page slug is `event-detail`, your event list shortcode would become:
      `[showpass_events type="list" detail_page="event-detail"]`
    - If you have multiple event lists on your site, you'll need to update each one.

## How the Magic Happens: URL Parameters

When a user clicks an event in your list (that now has `detail_page="event-detail"`), they will be redirected to a URL like:
`yourwebsite.com/event-detail/?slug=the-specific-event-slug`
or
`yourwebsite.com/event-detail/?event=12345` (where 12345 is the event ID)

The `[showpass_events type="detail"]` shortcode on your "event-detail" page automatically detects the `?slug=` or `?event=` part of the URL and fetches and displays the correct event's information.

## Customizing Your Event Detail Page: Parameters

The `[showpass_events type="detail"]` shortcode itself doesn't have many parameters because it primarily relies on the event data fetched. However, one important aspect is the template:

- **`template="data"`**

  - **Use Case**: If you want to build a completely custom PHP template for your event detail page (for advanced users). By default, it uses `default-detail.php` from the plugin's files.
  - **Example**: `[showpass_events type="detail" template="data"]`
  - _(See "Creating Custom Templates" for more info)._

- **`show_widget_description="true"`** (or `show_widget_description="false"`)
  - **Use Case**: To explicitly show or hide the description panel within the purchase widget that appears on the detail page. This overrides the global admin setting.
  - **Example**: `[showpass_events type="detail" show_widget_description="false"]`

## What an Event Detail Page Typically Shows

By default, using `[showpass_events type="detail"]`, the page will display:

- Event Name
- Event Image/Banner
- Event Date & Time
- Event Location
- Event Description
- The Showpass ticket purchasing widget embedded directly on the page.

This provides a comprehensive, self-contained page for each event, enhancing the user experience and keeping them on your site.
