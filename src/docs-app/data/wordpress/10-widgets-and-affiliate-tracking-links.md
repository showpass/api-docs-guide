# Widgets and affiliate tracking links

Showpass allows you to use affiliate tracking links to monitor sales performance across different marketing channels or partners. When customers arrive through special tracking links, the Showpass WordPress plugin automatically associates purchases made through `[showpass_widget]` with that tracking campaign.


## How affiliate tracking works

There are two ways to set tracking IDs for Showpass widgets:

1. **URL-based tracking** (using `?aff=` parameter) - Cookie-based, persists across page views
2. **Direct tracking** (using `tracking_id` parameter) - Set directly in the shortcode

### Method 1: URL-based tracking with `aff` parameter

#### Step 1: Create an affiliate tracking link in Showpass

1. Log in to your Showpass dashboard
2. Navigate to your event settings
3. Generate an affiliate tracking link for your event or campaign
4. Showpass will provide a unique token (e.g., `8ee54af5`)

> **Need help?** Visit the [Showpass Help Center](https://help.showpass.com/hc/en-us) for assistance with tracking link setup.

#### Step 2: Customer clicks the tracking link

Share your full tracking link in campaigns or with affiliates:

```text
https://www.showpass.com/your-event/?tracking-id=8ee54af5
```

When customers click this link, they're taken to Showpass and the tracking token is recorded.

#### Step 3: Use the `aff` parameter on your website

To integrate tracking with your WordPress site where `[showpass_widget]` is used:

**Parameter:** `aff=your_tracking_token`

Add this query parameter to your WordPress page URL where the Showpass widget button is located:

```text
https://yourwebsite.com/event-page/?aff=8ee54af5
```

**What happens:**
- When users visit this URL, the plugin creates a browser cookie storing the `aff` token
- The cookie persists across page views during the user's session

#### Step 4: Automatic tracking ID injection

The `[showpass_widget]` shortcode (specifically `type="event"`) automatically:

1. Looks for the `aff` cookie
2. If found, injects the `tracking-id` into the Showpass purchase widget
3. Attributes the sale to the correct affiliate/campaign in Showpass reports

### Method 2: Direct tracking with `tracking_id` parameter

**Parameter:** `tracking_id="your-tracking-token"`

You can also set tracking directly in the shortcode without using URL parameters:

```text
[showpass_widget slug="my-event" tracking_id="8ee54af5"]
```

**Advantages:**
- No cookie dependency
- Works immediately without URL parameters
- Can be different for each widget on the same page

**When to use:**
- When you want tracking set directly in the shortcode
- When you don't want to rely on cookies
- When different widgets on the same page need different tracking IDs

**Example:**
```text
[showpass_widget slug="event-a" tracking_id="campaign-a"]
[showpass_widget slug="event-b" tracking_id="campaign-b"]
```

---

## Example URLs

### Basic event page

```text
https://yourwebsite.com/upcoming-events/?aff=your_tracking_token
```

### Combined with event slug parameter

```text
https://yourwebsite.com/event-detail/?slug=my-cool-event&aff=your_tracking_token
```

### Multiple tracking campaigns

```text
Campaign A: https://yourwebsite.com/events/?aff=facebook_campaign
Campaign B: https://yourwebsite.com/events/?aff=email_newsletter
Campaign C: https://yourwebsite.com/events/?aff=partner_xyz
```

---

## Common use cases

### Email marketing campaigns

Include tracking URLs in newsletters:

```text
https://yourwebsite.com/featured-event/?aff=newsletter_march2024
```

Track performance of different email campaigns by using unique tokens per campaign.

### Social media advertising

Use different tracking tokens for each platform:

```text
Facebook: ?aff=fb_campaign_spring
Instagram: ?aff=ig_story_march
Twitter: ?aff=twitter_promo_q1
```

### Affiliate partnerships

Provide partners with unique tracking URLs:

```text
Partner 1: ?aff=partner_cityguide
Partner 2: ?aff=partner_eventblog
Partner 3: ?aff=partner_radiopromo
```

### QR codes

Generate QR codes pointing to tracking URLs:

```text
Print materials: ?aff=qr_poster_downtown
Event flyers: ?aff=qr_flyer_march
Business cards: ?aff=qr_businesscard
```

---

## Important considerations

### Current support scope

> **Note:** Affiliate tracking via URL `aff` parameter is currently supported for `[showpass_widget type="event"]`. The `tracking_id` shortcode parameter works for events, products, and memberships. Check with Showpass support or test if you need tracking for products or memberships via URL parameters.

### Cookie-based system

This method relies on browser cookies:

- **Cookie duration:** Typically 7 days (check Showpass documentation for current settings)
- **If cookies are disabled:** Tracking may not work
- **If cookies are cleared:** Attribution is lost
- **Cross-device:** Not supported (user must complete purchase on the same device/browser)

### Widget interaction required

The tracking ID is applied when:
1. User visits your site with `?aff=token`
2. Cookie is set
3. User clicks a `[showpass_widget]` button to open the purchase widget

**Direct links to Showpass.com with `tracking-id` parameter work independently of this WordPress plugin feature.**

---

## Testing your tracking setup

### Step 1: Verify cookie is set

1. Visit your page with `?aff=test_token`
2. Open browser DevTools → Application/Storage → Cookies
3. Look for a cookie containing your tracking token

### Step 2: Test widget opening

1. Click your `[showpass_widget]` button
2. Open browser DevTools → Network tab
3. Look for requests to Showpass with your `tracking-id` included

### Step 3: Check Showpass reports

1. Complete a test purchase (or use test mode if available)
2. Log in to your Showpass dashboard
3. Check affiliate reporting to confirm attribution

---

## Troubleshooting

### Tracking not appearing in reports

- **Verify the token matches** your Showpass tracking link
- **Check cookie expiration** – test shortly after clicking the tracking URL
- **Ensure the widget is for events** (products/memberships may not be supported)
- **Confirm the plugin is active** and up to date

### Cookie not being set

- **Check for HTTPS** – cookies may have restrictions on HTTP sites
- **Verify URL format** – use `?aff=token` not `?tracking-id=token`
- **Test in incognito mode** to rule out browser extensions blocking cookies

### Multiple tracking sources

If a user visits multiple tracking URLs:
- **Latest wins:** The most recent `aff` parameter overwrites previous values
- **Cookie is replaced:** Each new tracking URL updates the cookie

---

## Measuring ROI

Track the effectiveness of your marketing efforts by:

1. **Creating unique tokens** for each channel/campaign
2. **Using consistent naming conventions** (e.g., `platform_campaign_date`)
3. **Reviewing Showpass analytics** regularly to compare performance
4. **Calculating cost per acquisition** for paid campaigns
5. **Optimizing spend** based on which channels drive the most sales
