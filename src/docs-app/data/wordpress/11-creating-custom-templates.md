# Creating custom WordPress templates with Showpass data

Build custom layouts that match your theme by accessing raw Showpass data through the `template="data"` parameter. This advanced technique gives you full control over how events, products, and memberships are displayed.

> **Advanced topic:** Requires familiarity with PHP, HTML, and WordPress theme development.

---

## The `template="data"` parameter

**Parameter:** `template="data"`

The key to custom templates is using this parameter with Showpass shortcodes:

```text
[showpass_events template="data"]
[showpass_products template="data"]
[showpass_memberships template="data"]
```

**What it does:**
- Returns raw JSON data instead of HTML
- Allows processing with PHP's `do_shortcode()` and `json_decode()`
- Enables complete customization of markup and styling

---

## Workflow for custom templates

### Step 1: Inspect the data structure

Examine what data is available:

1. Create a test WordPress page
2. Add a shortcode with `template="data"`:
   ```text
   [showpass_events type="list" template="data"]
   ```
3. View page source or use `var_dump()` in a template to inspect JSON

**Key fields for events:**

- **`slug`** – Event slug (used in `[showpass_widget slug="..."]`)
- **`name`** – Event name
- **`starts_on`** – Event start datetime (UTC, e.g., `"2024-12-25T19:00:00Z"`)
- **`ends_on`** – Event end datetime (UTC)
- **`timezone`** – Timezone (e.g., `"America/Denver"`)
- **`description`** – HTML description (use `wp_kses_post()` when rendering)
- **`description_without_html`** – Plain text description (use `esc_html()`)
- **`frontend_details_url`** – Direct URL to event on Showpass.com
- **`image`** – Square image URL (thumbnail)
- **`image_banner`** – Banner image URL

> **Note:** Products and memberships have different structures. Inspect the JSON to see available fields.

---

### Step 2: Create a WordPress page template

Create a PHP template file in your (child) theme directory:

```text
wp-content/themes/your-child-theme/page-custom-showpass-events.php
```

Add a template header at the top:

```php
<?php
/*
Template Name: Custom Showpass Event Display
*/
```

**Learn more:** [WordPress Page Template Files](https://developer.wordpress.org/themes/template-files-section/page-template-files/)

---

### Step 3: Fetch and decode data

Use `do_shortcode()` to execute the Showpass shortcode and retrieve JSON:

```php
// Fetch raw JSON from Showpass
$json_data = do_shortcode('[showpass_events type="list" template="data"]');

// Decode into PHP object
$data = json_decode($json_data);

// Access results
if (!empty($data->results)) {
    foreach ($data->results as $event) {
        echo esc_html($event->name);
    }
}
```

---

### Step 4: Add custom styles

Create CSS in your theme's stylesheet:

```css
.custom-events-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.custom-event-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}
```

---

### Step 5: Assign the template to a page

1. In WordPress admin, go to **Pages → Add New** (or edit existing)
2. Under **Page Attributes** or **Template**, select your custom template
3. Publish or update the page

> **Important:** Do NOT place `[showpass_events template="data"]` in the page content. Your PHP template file handles the shortcode execution.

---

## Complete example template

Full working example of a custom page template:

```php
<?php
/*
Template Name: Custom Showpass Event Display
*/

get_header();
?>

<style>
.custom-events-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.custom-events-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.custom-event-item {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}

.custom-event-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.custom-event-image {
    width: 100%;
    height: 240px;
    object-fit: cover;
}

.custom-event-content {
    padding: 1.5rem;
}

.custom-event-name {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
}

.custom-event-date {
    font-size: 1rem;
    color: #666;
    margin-bottom: 1rem;
}

.custom-event-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #555;
    margin-bottom: 1.5rem;
}
</style>

<div class="custom-events-container">
    <h1>Upcoming Events</h1>
    
    <?php
    $json_data = do_shortcode('[showpass_events type="list" template="data"]');
    $data = json_decode($json_data);
    
    if (!empty($data->results) && is_array($data->results)) :
    ?>
        <div class="custom-events-list">
            <?php foreach ($data->results as $event) : 
                $event_date = '';
                if (!empty($event->starts_on)) {
                    $datetime = new DateTime($event->starts_on, new DateTimeZone('UTC'));
                    if (!empty($event->timezone)) {
                        $datetime->setTimezone(new DateTimeZone($event->timezone));
                    }
                    $event_date = $datetime->format('F j, Y \a\t g:i A');
                }
            ?>
                <div class="custom-event-item">
                    <?php if (!empty($event->image_banner)) : ?>
                        <img 
                            src="<?php echo esc_url($event->image_banner); ?>" 
                            alt="<?php echo esc_attr($event->name); ?>"
                            class="custom-event-image"
                        />
                    <?php endif; ?>
                    
                    <div class="custom-event-content">
                        <h2 class="custom-event-name">
                            <?php echo esc_html($event->name); ?>
                        </h2>
                        
                        <?php if ($event_date) : ?>
                            <div class="custom-event-date">
                                📅 <?php echo esc_html($event_date); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($event->description_without_html)) : ?>
                            <div class="custom-event-description">
                                <?php 
                                $description = esc_html($event->description_without_html);
                                if (strlen($description) > 150) {
                                    $description = substr($description, 0, 150) . '...';
                                }
                                echo $description;
                                ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if (!empty($event->slug)) : ?>
                            <?php
                            $widget_shortcode = '[showpass_widget slug="' . esc_attr($event->slug) . '"]';
                            echo do_shortcode($widget_shortcode);
                            ?>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else : ?>
        <p>No events found.</p>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
```

---

## Advanced customizations

### Filter events by tag

```php
$json_data = do_shortcode('[showpass_events type="list" template="data" tags="concert"]');
```

### Limit number of events

```php
$json_data = do_shortcode('[showpass_events type="list" template="data" page_size="6"]');
```

### Sort events

```php
$json_data = do_shortcode('[showpass_events type="list" template="data" ordering="starts_on"]');
```

### Add pagination

```php
$current_page = isset($_GET['event_page']) ? intval($_GET['event_page']) : 1;
$json_data = do_shortcode('[showpass_events type="list" template="data" page="' . $current_page . '"]');
$data = json_decode($json_data);

if (!empty($data->next)) {
    echo '<a href="?event_page=' . ($current_page + 1) . '">Next Page</a>';
}
```

---

## Best practices

### Security

- **Always escape output:** Use `esc_html()`, `esc_attr()`, `esc_url()`
- **Sanitize HTML content:** Use `wp_kses_post()` for descriptions
- **Validate integers:** Use `intval()` for page numbers and IDs

### Performance

- **Cache API responses** if displaying same data across multiple pages
- **Optimize images** using WordPress image functions
- **Limit page size** to reasonable numbers (10-20 events per page)

### Maintainability

- **Create helper functions** for repeated formatting logic
- **Use child themes** to prevent loss of customizations during updates
- **Document your code** for future reference
- **Test thoroughly** after Showpass plugin updates

---

## Troubleshooting

### Empty results

- **Check Organization ID** in Showpass API settings
- **Verify JSON structure** by viewing page source
- **Test shortcode separately** on a regular page first

### PHP errors

Enable WordPress debugging in `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

Check error log in `wp-content/debug.log`.

### Styling issues

- **Inspect element** in browser DevTools to identify CSS conflicts
- **Increase specificity** of your CSS selectors
- **Use `!important`** sparingly and only when necessary
