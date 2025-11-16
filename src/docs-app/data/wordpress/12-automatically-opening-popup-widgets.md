# Automatically opening pop-up widgets on page load

Make the Showpass ticket widget open automatically when visitors land on specific pages. Perfect for dedicated landing pages and ad campaigns where the primary goal is immediate ticket purchases.


## How it works

**Parameter:** `auto=your-event-slug`

Add this query parameter to any WordPress page URL that loads Showpass widget scripts:

```text
https://yourwebsite.com/featured-event/?auto=my-big-concert
```

**What happens:**

1. Plugin detects the `auto` parameter
2. Extracts the event slug value (`my-big-concert`)
3. Automatically opens the Showpass ticket widget for that event in a pop-up

> **Note:** The event slug is the part after `showpass.com/` in your event URL. For example: `https://www.showpass.com/my-big-concert/` → slug is `my-big-concert`

---

## Example URLs

### Basic auto-open

```text
https://yourwebsite.com/events/?auto=summer-festival-2024
```

### Combined with other parameters

```text
https://yourwebsite.com/landing-page/?auto=concert-series&utm_source=facebook
```

### Multiple landing pages

```text
Event A: https://yourwebsite.com/promo/?auto=event-a-slug
Event B: https://yourwebsite.com/promo/?auto=event-b-slug
Event C: https://yourwebsite.com/promo/?auto=event-c-slug
```

---

## Common use cases

### Ad campaigns

Link paid ads directly to pages with auto-open widgets:

```text
Facebook Ad: https://yourwebsite.com/summer-sale/?auto=festival-2024
Google Ad: https://yourwebsite.com/limited-offer/?auto=concert-series
Instagram Ad: https://yourwebsite.com/exclusive/?auto=vip-event
```

**Benefits:**
- Reduces friction by eliminating extra clicks
- Streamlines the purchase flow
- Improves conversion rates for time-sensitive campaigns

---

### Dedicated event landing pages

For pages that exist solely to sell tickets for one event:

```text
https://yourwebsite.com/annual-gala/?auto=annual-gala-2024
```

Auto-opening removes barriers between the visitor and purchase completion.

---

### Email marketing

Include direct purchase links in newsletters and promotional emails:

```text
https://yourwebsite.com/newsletter-special/?auto=exclusive-show&utm_campaign=march_newsletter
```

Recipients see the widget immediately upon clicking, maximizing conversion potential.

---

### QR codes

Generate QR codes for print materials:

```text
Poster: https://yourwebsite.com/scan/?auto=outdoor-concert
Flyer: https://yourwebsite.com/info/?auto=charity-event
```

---

## Requirements

### Page must include Showpass shortcode

The target page must include at least one Showpass shortcode to load the required scripts:

**Valid shortcodes:**
- `[showpass_widget]`
- `[showpass_events]`
- `[showpass_products]`
- `[showpass_memberships]`
- `[showpass_cart_button]`

The `auto` parameter relies on these scripts being present on the page.

### Event slug must be valid

The slug in the `auto` parameter must match an existing Showpass event:

**Finding your event slug:**

1. Log in to your Showpass dashboard
2. Go to your event details
3. Check the public event URL
4. Extract the slug (the part after `showpass.com/`)

**Example:**
- Event URL: `https://www.showpass.com/winter-wonderland-2024/`
- Slug: `winter-wonderland-2024`

---

## Best practices

### User experience considerations

**When to use auto-open:**
- Dedicated promotional landing pages
- Campaign-specific URLs from ads
- Email links to specific events
- Time-limited offers

**When NOT to use auto-open:**
- Homepage or general browse pages
- Multi-event listing pages
- Informational content pages
- Blog posts

> **Important:** Auto-opening widgets can feel intrusive on general content pages. Reserve this feature for pages where visitors explicitly expect to make a purchase.

---

### Provide fallback content

Even with auto-open, the underlying WordPress page should include:

- **Event name and description**
- **Hero image or banner**
- **Date, time, and location details**
- **Why attend information**

**Reasons:**
1. Users might close the widget to read more details
2. There may be a delay while the widget loads
3. Some users prefer to read before purchasing
4. SEO benefits from rich content

---

### Handle pop-up blockers

The Showpass widget typically appears as an **in-page modal** (not a browser pop-up window), so most pop-up blockers should not interfere.

**However:**
- Behavior can vary by browser and extensions
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Test with common ad blockers enabled
- Consider adding a manual "Buy Tickets" button as backup

---

### Track performance

Use UTM parameters alongside `auto` to measure campaign effectiveness:

```text
https://yourwebsite.com/event/?auto=concert&utm_source=facebook&utm_medium=cpc&utm_campaign=summer2024
```

Track in Google Analytics:
- Click-through rates
- Conversion rates
- Time to purchase
- Bounce rates

---

## Testing your setup

### Step 1: Verify the page has Showpass scripts

1. Open your target page (without `?auto=` parameter)
2. Open browser DevTools → Console
3. Type `showpass` and press Enter
4. You should see an object (not "undefined")

### Step 2: Test the auto parameter

1. Add `?auto=your-event-slug` to the URL
2. Reload the page
3. The widget should open automatically

### Step 3: Verify correct event loads

1. Check that the widget shows the correct event details
2. Test the purchase flow
3. Complete a test transaction (if possible)

---

## Troubleshooting

### Widget doesn't open automatically

**Check these items:**

1. **Page includes Showpass shortcode** – View page source and search for "showpass"
2. **Event slug is correct** – Match exactly with Showpass event URL
3. **Plugin is active** – Go to Plugins → Installed Plugins
4. **JavaScript errors** – Check browser console for errors
5. **Ad blocker interference** – Test in incognito mode

### Wrong event appears

- **Verify the slug** in the `auto` parameter matches your intended event
- **Check for typos** – slugs are case-sensitive
- **Test the event URL directly** on Showpass.com first

### Widget opens but shows error

- **Event may be inactive** – Check event status in Showpass dashboard
- **Sales may be paused** – Verify ticket sales are active
- **Event may have ended** – Check event date/time

---

## Advanced: Combining with affiliate tracking

You can combine `auto` with affiliate tracking (`aff`) parameters:

```text
https://yourwebsite.com/special-offer/?auto=concert-2024&aff=partner_xyz
```

This will:
1. Auto-open the widget for `concert-2024`
2. Attribute the sale to affiliate `partner_xyz`

**Learn more:** See [Widgets and affiliate tracking links](./10-widgets-and-affiliate-tracking-links)

---

## Alternative: Manual widget trigger

If auto-open isn't appropriate for your use case, consider using a prominent "Buy Tickets" button instead:

```text
[showpass_widget slug="your-event-slug" button_text="Buy Tickets Now"]
```

This gives users control over when they open the purchase widget while still providing a clear call-to-action.
