# Automatically opening pop-up widgets on page load

Sometimes, you might want the Showpass ticket-buying widget to open automatically as soon as a customer lands on a specific page on your website. This can be useful for targeted landing pages where the primary call to action is to purchase tickets for a particular event.

The Showpass WordPress plugin supports this functionality using a URL query parameter: `auto`.

## How it works

You append `?auto=your-event-slug` to the URL of the WordPress page where you want the widget to auto-open.

- `your-event-slug`: This is the slug of the Showpass event you want to feature in the pop-up widget. The slug is the unique part of the event's URL on Showpass (e.g., if the event is at `showpass.com/my-big-concert`, the slug is `my-big-concert`).

When a user visits this specially crafted URL, the plugin will detect the `auto` parameter and automatically trigger the Showpass ticket widget for the specified event slug to open in a pop-up.

## Use cases

- **Directing from Ad Campaigns:** If you run an ad campaign for a specific event, you can link the ad directly to a page on your site with the `?auto=event-slug` parameter. The widget for that event opens immediately, streamlining the purchase process.
- **Dedicated Event Landing Pages:** If you have a landing page on your WordPress site focused solely on one event, automatically opening the widget can reduce clicks and potentially increase conversions.
- **Email Marketing Links:** Link from an email newsletter about a specific event to your website page with the widget auto-opening.

## Examples

Let's say you have a WordPress page at `yourwebsite.com/featured-event/`.
Your Showpass event slug is `annual-gala-2024`.

To make the widget for "Annual Gala 2024" open automatically when someone visits that page, you would use or share this URL:

`https://yourwebsite.com/featured-event/?auto=annual-gala-2024`

**Important Considerations:**

- **User Experience:** While auto-opening widgets can be effective, use this feature thoughtfully. Unexpected pop-ups can sometimes be intrusive. Ensure it makes sense in the user's journey.
- **Page Content:** The underlying WordPress page should ideally still have some content related to the event, even if the widget opens on top. This helps if the user closes the widget or if there's any delay in it loading.
- **Pop-up Blockers:** Most modern browsers allow user-initiated pop-ups (like clicking a button), but aggressive pop-up blockers _might_ interfere, though this is less common for in-page modal dialogs which the Showpass widget typically uses.
- **Shortcode Prerequisite:** The page being linked to should ideally contain a Showpass shortcode, such as `[showpass_widget]` or `[showpass_events]`. The `auto` functionality relies on the plugin's scripts being active on the page, which are typically loaded when a Showpass shortcode is present. While it might work globally, it's best practice to have a relevant Showpass element on the destination page.

This `auto` parameter provides a simple yet powerful way to create a more direct path to purchase for specific events.
