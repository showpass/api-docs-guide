# Showpass WordPress Plugin: Complete Shortcode Reference

Quick reference guide for all available Showpass shortcodes. Each shortcode links to its detailed documentation.

---

## Event Shortcodes

### `[showpass_events]`

Display event lists or individual event detail pages.

**Use cases:**
- Show a list of upcoming events
- Display a single event detail page
- Filter events by tags, dates, or other criteria

**Documentation:**
- **[Event Lists](./03-adding-event-list)** – Display multiple events in grid or list format
- **[Event Detail Pages](./04-adding-event-detail-page)** – Create dedicated pages for individual events

**Quick examples:**
```text
[showpass_events type="list"]
[showpass_events type="detail"]
[showpass_events type="list" tags="concert" page_size="10"]
```

---

## Widget Shortcodes

### `[showpass_widget]`

Add purchase buttons or embed purchase widgets for events, products, or memberships.

**Use cases:**
- Add "Buy Tickets" buttons to pages
- Embed full purchase widgets directly on pages
- Sell products or memberships

**Documentation:**
- **[Adding Single Button or Embeddable Widget](./02-adding-single-button-embed-widget)** – Complete guide with all parameters

**Quick examples:**
```text
[showpass_widget slug="my-event"]
[showpass_widget slug="my-event" embedded="true"]
[showpass_widget type="product" id="12345"]
[showpass_widget type="membership" id="67890"]
```

---

## Calendar Shortcodes

### `[showpass_calendar]`

Display an interactive calendar view of events (legacy calendar).

**Use cases:**
- Show events in a traditional calendar format
- Month, week, and day views

**Documentation:**
- **[Adding Calendar Widget](./05-adding-calendar-widget)** – See "Older calendar shortcode" section

**Quick examples:**
```text
[showpass_calendar]
[showpass_calendar tags="workshop" starting_date="1-12-2024"]
```

---

### `[showpass_calendar_widget]`

Add a button that opens the modern calendar widget in a pop-up.

**Use cases:**
- Calendar button in headers or sidebars
- Quick access to event calendar

**Documentation:**
- **[Adding Calendar Widget](./05-adding-calendar-widget)** – See "Calendar button (pop-up)" section

**Quick examples:**
```text
[showpass_calendar_widget]
[showpass_calendar_widget label="View Calendar" tags="comedy"]
[showpass_calendar_widget is_attraction="true" event_id="123456"]
```

---

### `[showpass_embed_calendar]`

Embed the full calendar widget directly on a page.

**Use cases:**
- Dedicated calendar pages
- Full-page calendar views

**Documentation:**
- **[Adding Calendar Widget](./05-adding-calendar-widget)** – See "Embedded calendar" section

**Quick examples:**
```text
[showpass_embed_calendar]
[showpass_embed_calendar tags="workshop" lang="fr"]
[showpass_embed_calendar is_attraction="true" event_id="123456"]
```

---

## Product Shortcodes

### `[showpass_products]`

Display merchandise, add-ons, or other non-event products.

**Use cases:**
- Product catalog pages
- Merchandise stores
- Featured products

**Documentation:**
- **[Adding Product List](./06-adding-product-list)** – Complete guide with all parameters

**Quick examples:**
```text
[showpass_products]
[showpass_products template="list" page_size="12"]
[showpass_products product_ids="101,105,115"]
```

---

## Membership Shortcodes

### `[showpass_memberships]`

Display membership options for signup.

**Use cases:**
- Membership pricing pages
- Membership comparison tables
- Featured memberships

**Documentation:**
- **[Adding Membership List](./07-adding-membership-list)** – Complete guide with all parameters

**Quick examples:**
```text
[showpass_memberships]
[showpass_memberships page_size="10" membership_ids="15,25"]
[showpass_memberships lang="fr"]
```

---

## Shopping Cart Shortcode

### `[showpass_cart_button]`

Add a shopping cart/checkout button that opens the Showpass cart widget.

**Use cases:**
- Cart button in site header
- Checkout page entry point
- Embedded cart on dedicated checkout pages

**Documentation:**
- **[Adding Checkout Cart Button](./08-adding-checkout-cart-button)** – Complete guide

**Quick examples:**
```text
[showpass_cart_button]
[showpass_cart_button embedded="true"]
[showpass_cart_button lang="fr"]
```

---

## Pricing Table Shortcode

### `[showpass_pricing_table]`

Display multiple events side-by-side in a pricing comparison table.

**Use cases:**
- Compare ticket prices across events
- Package deals and multi-event pricing
- Seasonal pricing comparisons

**Documentation:**
- **[Adding Pricing Table](./14-adding-pricing-table)** – Complete guide with all parameters

**Quick examples:**
```text
[showpass_pricing_table ids="254,288,292"]
[showpass_pricing_table ids="123,456" show_event_details="false" lang="fr"]
```

---

## Shortcode Quick Reference Table

| Shortcode | Purpose | Primary Documentation |
|-----------|---------|----------------------|
| `[showpass_events]` | Display event lists or detail pages | [Event Lists](./03-adding-event-list), [Event Details](./04-adding-event-detail-page) |
| `[showpass_widget]` | Purchase buttons/widgets for events/products/memberships | [Single Button Widget](./02-adding-single-button-embed-widget) |
| `[showpass_calendar]` | Legacy calendar view | [Calendar Widget](./05-adding-calendar-widget) |
| `[showpass_calendar_widget]` | Calendar button (pop-up) | [Calendar Widget](./05-adding-calendar-widget) |
| `[showpass_embed_calendar]` | Embedded calendar | [Calendar Widget](./05-adding-calendar-widget) |
| `[showpass_products]` | Display products | [Product List](./06-adding-product-list) |
| `[showpass_memberships]` | Display memberships | [Membership List](./07-adding-membership-list) |
| `[showpass_cart_button]` | Shopping cart button | [Cart Button](./08-adding-checkout-cart-button) |
| `[showpass_pricing_table]` | Pricing comparison table | [Pricing Table](./14-adding-pricing-table) |

---

## Common Parameters Across Shortcodes

Many shortcodes share similar parameters:

### Language
**Parameter:** `lang="fr"`

Set the widget interface language (affects purchase widgets, not templates).

**Supported:** `fr` (French), or omit for English

**Available in:**
- `[showpass_widget]`
- `[showpass_events]`
- `[showpass_products]`
- `[showpass_memberships]`
- `[showpass_cart_button]`
- `[showpass_calendar_widget]`
- `[showpass_embed_calendar]`
- `[showpass_pricing_table]`

### Widget Description
**Parameter:** `show_widget_description="true|false"`

Control whether the purchase widget's description panel is shown.

**Available in:**
- `[showpass_widget]`
- `[showpass_events]`
- `[showpass_products]`
- `[showpass_memberships]`
- `[showpass_pricing_table]`

### Tracking ID
**Parameter:** `tracking_id="your-token"`

Set affiliate tracking ID directly in the shortcode.

**Available in:**
- `[showpass_widget]`
- `[showpass_events]` (for event lists)

See **[Widgets and Affiliate Tracking Links](./10-widgets-and-affiliate-tracking-links)** for complete tracking documentation.

---

## Advanced Features

### Custom Templates

Use `template="data"` to get raw JSON data for custom PHP templates.

**Available in:**
- `[showpass_events]`
- `[showpass_products]`
- `[showpass_memberships]`

**Documentation:**
- **[Creating Custom Templates](./11-creating-custom-templates)** – Complete guide

### Auto-Open Widgets

Use URL parameter `?auto=event-slug` to automatically open widgets on page load.

**Documentation:**
- **[Automatically Opening Pop-up Widgets](./12-automatically-opening-popup-widgets)** – Complete guide

### Dynamic Cart Counter

Build custom cart counters using JavaScript.

**Documentation:**
- **[Advanced: Dynamic Cart Counter](./09-advanced-dynamic-cart-counter-jquery)** – Complete guide

---

## Getting Help

### Troubleshooting

For common issues and solutions:
- **[Tips and Troubleshooting](./13-tips-and-troubleshooting)** – Common problems and fixes

### Installation & Configuration

If you haven't set up the plugin yet:
- **[Getting Started](./01-getting-started-install-and-configure)** – Installation and configuration guide

### Admin Tools

For generating shortcodes from URLs:
- **[Admin Meta Box: URL & Shortcode Generator](./15-admin-meta-box-shortcode-generator)** – Meta box documentation

---

## Additional Resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress Shortcode documentation:** [codex.wordpress.org/Shortcode](https://codex.wordpress.org/Shortcode)

