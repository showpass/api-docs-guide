# Creating custom WordPress templates with Showpass data

While the Showpass WordPress plugin provides default templates for displaying event lists, you may want to build your own layouts that match your theme or design system.

This is an advanced topic and assumes some familiarity with PHP, HTML, and WordPress theme development.

---

## The `template="data"` parameter

The key to custom templates is the `template="data"` parameter, available on the main Showpass shortcodes:

```text
[showpass_events template="data"]
[showpass_products template="data"]
[showpass_memberships template="data"]
```

When you use `template="data"`, the shortcode does **not** output HTML. Instead, it returns the raw data from the Showpass API as a JSON string. You can then:

1. Run the shortcode via `do_shortcode()` in a PHP template.
2. `json_decode()` the JSON.
3. Loop over the data and render your own markup.

---

## General workflow for custom templates

### 1. Inspect the data

1. Create a test page.

2. Add a shortcode such as:

   ```text
   [showpass_events type="list" template="data"]
   ```

3. View the page source, or temporarily `var_dump()` / `print_r()` the decoded JSON in a custom template to inspect the structure.

The GitHub README (sections 4.1 for a single event and 4.2 for a list) also shows example JSON.

For events, the main fields you’ll usually care about inside each item in `results` are:

* `slug` – Event slug, used for `[showpass_widget slug="..."]`.
* `name` – Event name.
* `starts_on` – Event start datetime (UTC, e.g. `"2024-12-25T19:00:00Z"`).
* `ends_on` – Event end datetime (UTC).
* `timezone` – Timezone (e.g. `"America/Denver"`), used with helper functions.
* `description` – HTML description (use `wp_kses_post()` when rendering).
* `description_without_html` – Plain text description (use `esc_html()`).
* `frontend_details_url` – Direct URL to the event on Showpass.com.
* `image` – Square image URL (thumbnail-style).
* `image_banner` – Banner image URL.

For products (`[showpass_products template="data"]`) and memberships (`[showpass_memberships template="data"]`), the structure is different but follows the same pattern: a top-level object with a `results` array of items. Inspect the JSON to see available fields.

---

### 2. Create a WordPress page template

In your (child) theme directory, create a PHP file, e.g.:

```text
wp-content/themes/your-child-theme/page-custom-showpass-events.php
```

At the top of the file, add a template header so WordPress can select it:

```javascript
<?php
/*
Template Name: Custom Showpass Event Display
*/
```

For background on page templates, see:
[https://developer.wordpress.org/themes/template-files-section/page-template-files/](https://developer.wordpress.org/themes/template-files-section/page-template-files/)

---

### 3. Fetch and decode data in the template

Use `do_shortcode()` to run the Showpass shortcode and get the JSON, then decode it into a PHP object or array.

You handle the loop, markup, and any helper functions directly in your template.

---

### 4. Style with CSS

Add your styles to your theme or child theme stylesheet (`style.css` or equivalent) and target the classes you output in your custom template (e.g. `.custom-events-list`, `.custom-event-item`, etc.).

---

### 5. Assign the template to a page

1. In WordPress admin, go to **Pages → Add New** (or edit an existing page).
2. In the **Template** dropdown (under “Page Attributes” or “Template”), select your custom template (e.g. **Custom Showpass Event Display**).
3. Publish or update the page.

> You **do not** place `[showpass_events template="data"]` in the page content. Your PHP template file already runs the shortcode and handles the data.

---

## Example: Custom event data display template

Below is a focused example of a custom Page Template that:

* Fetches event data via `[showpass_events type="list" template="data" page_size="5"]`.
* Loops through `results`.
* Uses Showpass helper functions for dates/times.
* Renders a “Buy Tickets” button via `[showpass_widget]` using the event slug.

You can adapt the same pattern for products or memberships.

```javascript
<?php
/*
Template Name: Custom Showpass Event Display
*/
get_header(); // Loads header.php
?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">

        <?php
        // 1. Fetch event data as JSON via the shortcode
        $json_event_data = do_shortcode(
            '[showpass_events type="list" template="data" page_size="5"]'
        );

        // 2. Decode JSON into a PHP object
        // Use json_decode($json_event_data, true) for an associative array instead
        $events_object = json_decode($json_event_data);

        // 3. Check for results
        if (
            $events_object &&
            isset($events_object->results) &&
            count($events_object->results) > 0
        ) {

            echo '<div class="custom-events-list">';

            // 4. Loop through each event
            foreach ($events_object->results as $event) {
                echo '<div class="custom-event-item">';

                // Event name
                if (isset($event->name)) {
                    echo '<h2>' . esc_html($event->name) . '</h2>';
                }

                // Banner image
                if (isset($event->image_banner)) {
                    echo '<img src="' . esc_url($event->image_banner) . '" alt="' .
                        esc_attr(isset($event->name) ? $event->name : '') .
                        '" style="max-width:100%;height:auto;" />';
                }

                // Date / time using plugin helpers (if available)
                if (
                    isset($event->starts_on) &&
                    isset($event->timezone) &&
                    function_exists('showpass_get_event_date') &&
                    function_exists('showpass_get_event_time') &&
                    function_exists('showpass_get_timezone_abbr')
                ) {
                    echo '<p><strong>Date:</strong> ' .
                        esc_html(showpass_get_event_date($event->starts_on, $event->timezone)) .
                        '</p>';

                    echo '<p><strong>Time:</strong> ' .
                        esc_html(showpass_get_event_time($event->starts_on, $event->timezone));

                    if (isset($event->ends_on)) {
                        echo ' - ' .
                            esc_html(showpass_get_event_time($event->ends_on, $event->timezone));
                    }

                    echo ' ' .
                        esc_html(showpass_get_timezone_abbr($event->timezone)) .
                        '</p>';
                }

                // Description with HTML (safe)
                if (isset($event->description)) {
                    echo '<div class="event-description-full">' .
                        wp_kses_post($event->description) .
                        '</div>';
                }

                // Example: plain text description if preferred
                /*
                if (isset($event->description_without_html)) {
                    echo '<p class="event-description-plain">' .
                        esc_html($event->description_without_html) .
                        '</p>';
                }
                */

                // “Buy Tickets” button using the event slug
                if (isset($event->slug)) {
                    $label = 'Buy Tickets';
                    if (isset($event->name)) {
                        $label = 'Buy Tickets for ' . $event->name;
                    }

                    $buy_button_shortcode = sprintf(
                        '[showpass_widget slug="%s" label="%s"]',
                        esc_attr($event->slug),
                        esc_attr($label)
                    );

                    echo do_shortcode($buy_button_shortcode);
                }

                // Optional: Fallback link to Showpass.com
                /*
                if (isset($event->frontend_details_url)) {
                    echo '<p><a href="' . esc_url($event->frontend_details_url) .
                        '" target="_blank" rel="noopener noreferrer">View on Showpass.com</a></p>';
                }
                */

                echo '</div>'; // .custom-event-item
            }

            echo '</div>'; // .custom-events-list

            // 5. Optional pagination example (if API returns page numbers)
            /*
            if (function_exists('showpass_get_events_next_prev')) {
                if (!empty($events_object->previous_page_number)) {
                    echo '<a href="' .
                        esc_url(showpass_get_events_next_prev($events_object->previous_page_number)) .
                        '">Previous Page</a>';
                }
                if (!empty($events_object->next_page_number)) {
                    echo '<a href="' .
                        esc_url(showpass_get_events_next_prev($events_object->next_page_number)) .
                        '">Next Page</a>';
                }
            }
            */

        } else {
            echo '<p>No events found.</p>';
        }
        ?>

    </main><!-- #main -->
</div><!-- #primary -->

<?php
get_footer(); // Loads footer.php
?>
```

You can extend this pattern to:

* Build fully custom event grids or cards.
* Show additional metadata from the API.
* Integrate with your theme’s existing components.
* Do the same for products (`[showpass_products template="data"]`) and memberships (`[showpass_memberships template="data"]`) by adjusting the shortcode and the fields you read from the decoded JSON.
