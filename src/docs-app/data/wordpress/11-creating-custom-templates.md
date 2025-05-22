# Creating Custom Wordpress Templates with Showpass data

While the Showpass WordPress Plugin provides default templates for displaying event lists you might want to create your own unique layouts and designs.

This is an advanced topic that requires some knowledge of PHP, HTML, and WordPress theme development.

## The `template="data"` Parameter

The key to creating custom templates is the `template="data"` parameter available for the relevant shortcodes:

`[showpass_events template="data"]`

When you use `template="data"`, the shortcode doesn't output any HTML. Instead, it returns the raw data fetched from the Showpass API in JSON (JavaScript Object Notation) format. You can then use this JSON data within your own PHP WordPress template files to structure and style the information exactly how you want.

## General Workflow for Custom Templates

1.  **Identify the Data You Need:**

    - Use the shortcode with `template="data"` on a test page (e.g., `[showpass_events type="list" template="data"]`).
    - View the source of that page or temporarily print the output within your test template to see the full structure of the JSON data returned by the Showpass API. The GitHub Readme (Sections 4.1 for a single event and 4.2 for a list of events) also provides examples of the JSON structure.
    - While the full JSON contains many fields, for typical event displays, you'll likely focus on these key fields within each item of the `results` array:
      - `slug`: The event slug, crucial for initiating the Showpass purchase widget (e.g., for `[showpass_widget slug="your-event-slug"]`).
      - `name`: The display name of the event.
      - `starts_on`: The event's start date and time in UTC format (e.g., "2024-12-25T19:00:00Z").
      - `ends_on`: The event's end date and time in UTC format.
      - `timezone`: The timezone of the event (e.g., "America/Denver"). Used with helper functions to display local times.
      - `description`: The event description, which may include HTML formatting. Use `wp_kses_post()` when displaying this if you want to render the HTML safely.
      - `description_without_html`: The event description with all HTML tags stripped out (plain text). Use `esc_html()` when displaying this.
      - `frontend_details_url`: A direct URL to the event page on Showpass.com, useful as a fallback or direct link.
      - `image`: URL for a square image associated with the event (often a thumbnail or primary image).
      - `image_banner`: URL for a banner-style image for the event.
    - For products or memberships (`[showpass_products template="data"]` or `[showpass_memberships template="data"]`), the JSON structure and available fields will differ from events. You'll need to inspect that specific data output similarly. The PHP example below focuses on event data.

2.  **Create a WordPress Page Template:**

    - In your WordPress theme's directory (or child theme's directory, which is recommended), create a custom page template file. For example, `page-custom-event-display.php`.
    - Refer to the official WordPress documentation on Page Templates: [https://developer.wordpress.org/themes/template-files-section/page-template-files/](https://developer.wordpress.org/themes/template-files-section/page-template-files/)
    - Your template file will start with a template name comment, e.g.:
      ```php
      <?php /* Template Name: Custom Showpass Event Display */ ?>
      ```

3.  **Fetch and Decode the Data in Your Template:**

    - Inside your custom PHP template file, you'll use WordPress's `do_shortcode()` function to execute the Showpass shortcode and get the JSON data.
    - Then, you'll use `json_decode()` to convert the JSON string into a PHP object that you can easily work with.

4.  **Style with CSS:**

    - Add your custom CSS rules to your theme's `style.css` file (or your child theme's stylesheet) to style the HTML elements you've created in your template.

5.  **Assign the Template to a WordPress Page:**
    - Create a new page in WordPress (or edit an existing one).
    - In the page attributes section of the editor, select your newly created custom template from the "Template" dropdown.
      - _(Suggested: Include a screenshot of the Page Attributes meta box showing the Template dropdown)_
    - You do **not** put the `[showpass_events template="data"]` shortcode directly into the content editor of this page, because your PHP template file is already handling it.

## Focused Example: Custom Event Data Display

This example demonstrates how to fetch and display specific event fields within a custom WordPress page template. For product or membership data, the available fields in the JSON will differ.

```php
<?php
/*
Template Name: Custom Showpass Event Display
*/
get_header(); // Loads your theme's header.php file
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php
        // Fetch event data using the Showpass shortcode with template="data"
        // You can add other parameters like page_size, tags, etc., as needed.
        $json_event_data = do_shortcode('[showpass_events type="list" template="data" page_size="5"]');

        // Decode the JSON string into a PHP object.
        // Pass 'true' as the second argument to get an associative array instead of an object: json_decode($json_event_data, true);
        $events_object = json_decode($json_event_data);

        // Check if we have results and the 'results' array exists
        if ($events_object && isset($events_object->results) && count($events_object->results) > 0) {

            echo '<div class="custom-events-list">'; // Your custom wrapper for the list

            // Loop through each event in the 'results' array
            foreach ($events_object->results as $event) {
                echo '<div class="custom-event-item">'; // Your custom wrapper for each event

                // --- Using the Key Event Fields ---

                // results.name -> event name
                if (isset($event->name)) {
                    echo '<h2>' . esc_html($event->name) . '</h2>';
                }

                // results.image_banner -> banner image on the event
                if (isset($event->image_banner)) {
                    echo '<img src="' . esc_url($event->image_banner) . '" alt="' . esc_attr(isset($event->name) ? $event->name : '') . '" style="max-width:100%; height:auto;" />';
                }

                // results.image -> square image on the event (could be a thumbnail)
                if (isset($event->image)) {
                    // Example: Displaying it smaller, perhaps as an additional image
                    // echo '<img src="' . esc_url($event->image) . '" alt="Square image for ' . esc_attr(isset($event->name) ? $event->name : '') . '" style="width:150px; height:150px;" />';
                }

                // results.starts_on -> UTC time the event starts
                // results.ends_on -> UTC time of event end
                // results.timezone -> timezone of event
                // It's highly recommended to use the plugin's helper functions for dates and times
                // as they handle timezones and formatting settings from the Showpass admin page.
                if (isset($event->starts_on) && isset($event->timezone)) {
                    // Ensure the helper functions are available. They usually are if the plugin is active.
                    if (function_exists('showpass_get_event_date')) {
                        echo '<p><strong>Date:</strong> ' . showpass_get_event_date($event->starts_on, $event->timezone) . '</p>';
                    }
                    if (function_exists('showpass_get_event_time')) {
                        echo '<p><strong>Time:</strong> ' . showpass_get_event_time($event->starts_on, $event->timezone);
                        if (isset($event->ends_on) && function_exists('showpass_get_event_time')) {
                            echo ' - ' . showpass_get_event_time($event->ends_on, $event->timezone);
                        }
                        if (function_exists('showpass_get_timezone_abbr')) {
                            echo ' ' . showpass_get_timezone_abbr($event->timezone);
                        }
                        echo '</p>';
                    }
                }

                // results.description -> description with html tags/formatting
                // Use wp_kses_post() to allow safe HTML from the description.
                if (isset($event->description)) {
                    echo '<div class="event-description-full">' . wp_kses_post($event->description) . '</div>';
                }

                // results.description_without_html -> description without html
                // Use esc_html() if you want to display it as plain text.
                /*
                if (isset($event->description_without_html)) {
                    echo '<p class="event-description-plain">' . esc_html($event->description_without_html) . '</p>';
                }
                */

                // results.slug -> needed to initiate the widget via the SDK (Showpass Purchase Widget)
                // You can use this slug to create a "Buy Tickets" button using the [showpass_widget] shortcode.
                if (isset($event->slug)) {
                    $buy_button_shortcode = '[showpass_widget slug="' . esc_attr($event->slug) . '" label="Buy Tickets for ' . esc_attr(isset($event->name) ? $event->name : 'this event') . '"]';
                    echo do_shortcode($buy_button_shortcode);
                }

                // results.frontend_details_url -> if you need to redirect to showpass.com for whatever reason
                if (isset($event->frontend_details_url)) {
                    // Example: A fallback link to view on Showpass.com
                    // echo '<p><a href="' . esc_url($event->frontend_details_url) . '" target="_blank">View on Showpass.com</a></p>';
                }

                echo '</div>'; // End .custom-event-item
            }

            echo '</div>'; // End .custom-events-list

            // --- Basic Pagination Example (if data is available in $events_object) ---
            // The Showpass API typically provides 'next_page_number' and 'previous_page_number'
            // You would use the plugin's helper function showpass_get_events_next_prev() to build the links.
            // This requires the main page URL.
            /*
            if (function_exists('showpass_get_events_next_prev')) {
                if (isset($events_object->previous_page_number) && $events_object->previous_page_number) {
                    echo '<a href="' . showpass_get_events_next_prev($events_object->previous_page_number) . '">Previous Page</a>';
                }
                if (isset($events_object->next_page_number) && $events_object->next_page_number) {
                    echo '<a href="' . showpass_get_events_next_prev($events_object->next_page_number) . '">Next Page</a>';
                }
            }
            */

        } else {
            // Message if no events are found or if data is not in the expected format
            echo '<p>No events found.</p>';
        }
        ?>

    </main><!-- #main -->
</div><!-- #primary -->

<?php
get_footer(); // Loads your theme's footer.php file
?>
```
