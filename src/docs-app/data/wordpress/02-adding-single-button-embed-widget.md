# Adding a single button or embeddable widget

The Showpass WordPress plugin lets you add **"Buy Now"** buttons or embed the full **purchase widget** directly on your pages using the `[showpass_widget]` shortcode. Perfect for linking to specific events, products, or memberships.


## What is a shortcode?

A shortcode is a small piece of text wrapped in square brackets `[]` that WordPress replaces with dynamic content. WordPress transforms `[showpass_widget]` into a button or embedded purchase interface.

---

## How to add the widget shortcode

### Step 1: Open the page editor

1. Go to the WordPress page or post where you want the button
2. Click **Edit** to open the block editor

### Step 2: Add a Shortcode block

1. In the editor, click the **+** icon to add a new block
2. Search for and add the **Shortcode** block

![Shortcode](/images/wordpress/shortcode.png)

3. Type your `[showpass_widget]` shortcode with parameters
4. Click **Update** or **Publish**

![Shortcode add](/images/wordpress/showpass-events.png)

> **Tip:** You can also paste the shortcode directly into a Paragraph block in most themes.

---

## Basic button usage

Create a simple button that opens the Showpass purchase widget in a pop-up:

```text
[showpass_widget slug="your-event-slug"]
```

**Example:** For `https://showpass.com/my-awesome-concert`, use:

```text
[showpass_widget slug="my-awesome-concert"]
```

This creates a button with the default label **"Tickets"**. When clicked, the widget opens for ticket purchases.

---

## Embedding the widget directly

Display the purchase widget directly on the page (no button, no pop-up):

```text
[showpass_widget slug="your-event-slug" embedded="true"]
```

**Use case:** Dedicated ticketing pages where customers can purchase immediately without clicking a button.

---

## Widget types

The `[showpass_widget]` shortcode supports three types via the `type` parameter.

### Events (default)

**Parameter:** `type="event"`

For selling event tickets.

**Required:** `slug`

**Examples:**

```text
[showpass_widget type="event" slug="annual-gala"]
[showpass_widget type="event" slug="annual-gala" embedded="true"]
```

> **Note:** If `type` is omitted, `event` is assumed.

---

### Products

**Parameter:** `type="product"`

For selling merchandise or other products.

**Required:** `id` (numeric product ID from Showpass)

**Examples:**

```text
[showpass_widget type="product" id="12345"]
[showpass_widget type="product" id="12345" embedded="true"]
```

---

### Memberships

**Parameter:** `type="membership"`

For selling memberships.

**Required:** `id` (numeric membership group ID from Showpass)

**Examples:**

```text
[showpass_widget type="membership" id="67890"]
[showpass_widget type="membership" id="67890" embedded="true"]
```

---

## Customization parameters

Control what the widget loads and how it behaves using these parameters.

### Event slug

**Parameter:** `slug="your-event-slug"`

**Use case:** Link to a specific event (required for `type="event"`)

**Value:** The unique part of your Showpass event URL

**Example:** For `showpass.com/halloween-party`, the slug is `halloween-party`

```text
[showpass_widget slug="halloween-party"]
```

---

### Product or membership ID

**Parameter:** `id="12345"`

**Use case:** Link to a product or membership

**Value:** Numeric ID from your Showpass dashboard

**Finding the ID:**

1. Log in to Showpass dashboard
2. Go to Products or Memberships
3. Note the numeric ID next to the item name

**Examples:**

```text
[showpass_widget type="product" id="5021"]
[showpass_widget type="membership" id="9847"]
```

---

### Button text

**Parameter:** `button_text="Your Custom Text"`

**Use case:** Change the button label

**Default:** "Tickets"

**Examples:**

```text
[showpass_widget slug="summer-fest" button_text="Buy Tickets"]
[showpass_widget slug="workshop" button_text="Register Now"]
[showpass_widget type="product" id="123" button_text="Shop Now"]
```

---

### Embedded mode

**Parameter:** `embedded="true"`

**Use case:** Display the widget directly on the page (no button)

**Default:** `false` (shows a button)

**Example:**

```text
[showpass_widget slug="concert" embedded="true"]
```

**When to use:**
- Dedicated ticketing pages
- Checkout pages
- Landing pages with single purchase focus

---

### Height

**Parameter:** `height="600px"`

**Use case:** Set custom height for embedded widgets

**Default:** Auto-adjusts based on content

**Valid values:** Any CSS height value (px, vh, rem)

**Example:**

```text
[showpass_widget slug="event" embedded="true" height="800px"]
```

---

### Width

**Parameter:** `width="100%"`

**Use case:** Set custom width for embedded widgets

**Default:** `100%`

**Valid values:** Any CSS width value (%, px, vw, rem)

**Example:**

```text
[showpass_widget slug="event" embedded="true" width="800px"]
```

---

### Hide sold out events

**Parameter:** `hide_sold_out="true"`

**Use case:** Automatically hide tickets that are sold out

**Default:** `false` (shows sold out items)

**Example:**

```text
[showpass_widget slug="festival" hide_sold_out="true"]
```

---

## Complete examples

### Basic event button

```text
[showpass_widget slug="summer-concert"]
```

---

### Custom button with text

```text
[showpass_widget slug="summer-concert" button_text="Get Your Tickets"]
```

---

### Embedded event widget

```text
[showpass_widget slug="summer-concert" embedded="true"]
```

---

### Product purchase button

```text
[showpass_widget type="product" id="12345" button_text="Buy Merchandise"]
```

---

### Membership signup (embedded)

```text
[showpass_widget type="membership" id="67890" embedded="true" height="700px"]
```

---

### Custom sized embedded widget

```text
[showpass_widget slug="annual-gala" embedded="true" height="800px" width="90%"]
```

---

## Styling the button

Customize the button appearance with CSS in your theme:

```css
/* Target the Showpass widget button */
.showpass-widget-button {
    background-color: #9e2a2b !important;
    color: white !important;
    padding: 15px 30px !important;
    border-radius: 8px !important;
    font-size: 18px !important;
    font-weight: 600 !important;
}

.showpass-widget-button:hover {
    background-color: #7d2122 !important;
}
```

**Where to add:**
- **Appearance → Customize → Additional CSS**
- Or in your child theme's `style.css`

---

## Common use cases

### Event landing page

Create a dedicated page for each event with embedded widget:

```text
[showpass_widget slug="spring-gala" embedded="true"]
```

---

### Multiple events on one page

Add multiple buttons for different events:

```text
[showpass_widget slug="concert-a" button_text="Concert A Tickets"]
[showpass_widget slug="concert-b" button_text="Concert B Tickets"]
[showpass_widget slug="concert-c" button_text="Concert C Tickets"]
```

---

### Sidebar widget

Add a button in your sidebar (using a Shortcode widget or block):

```text
[showpass_widget slug="next-show" button_text="Buy Tickets"]
```

---

### Product showcase

Embed product purchase widgets on product pages:

```text
[showpass_widget type="product" id="501" embedded="true" height="600px"]
```

---

## Troubleshooting

### Button doesn't appear

- **Check plugin is active:** Plugins → Installed Plugins
- **Verify shortcode syntax:** Ensure straight quotes, not curly quotes
- **Clear cache:** Browser and WordPress caching plugins

---

### Widget shows wrong event/product

- **Verify slug or ID:** Check the exact value from Showpass
- **Test directly on Showpass:** Confirm the event/product exists
- **Check for typos:** Slugs and IDs are case-sensitive

---

### "Connection blocked" error

- **Whitelist your domain** in Showpass dashboard
- **Check HTTPS:** Ensure consistent protocol usage
- **Review browser console:** Look for specific error messages

---

### Embedded widget is too small/large

- **Adjust height parameter:** Use `height="800px"` or other values
- **Test different sizes:** Try various heights until optimal
- **Use responsive units:** Consider `vh` units for viewport-relative sizing

---

## Next steps

Now that you know how to add purchase buttons and widgets, explore:

- **[Display event lists](./03-adding-event-list)** – Show multiple events in grid/list format
- **[Create event detail pages](./04-adding-event-detail-page)** – Build dedicated pages for each event
- **[Add a calendar widget](./05-adding-calendar-widget)** – Display interactive event calendar
- **[Customize with templates](./11-creating-custom-templates)** – Build custom layouts with raw data

---

## Additional resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress Shortcode documentation:** [codex.wordpress.org/Shortcode](https://codex.wordpress.org/Shortcode)
- **CSS customization guide:** [wordpress.org/support/article/css](https://wordpress.org/support/article/css/)
