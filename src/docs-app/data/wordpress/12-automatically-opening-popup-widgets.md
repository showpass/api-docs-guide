# Automatically opening pop-up widgets on page load

In some cases, you may want the Showpass ticket widget to open automatically as soon as a visitor lands on a page. This is useful for dedicated landing pages where the main goal is to buy tickets for a specific event.

The Showpass WordPress plugin supports this via a URL query parameter: `auto`.

---

## How it works

Add `?auto=your-event-slug` to the URL of a WordPress page that already loads the Showpass widget scripts (for example, a page that contains `[showpass_widget]` or `[showpass_events]`).

- `your-event-slug` is the event slug from Showpass.
- Example event URL on Showpass:  
  `https://www.showpass.com/my-big-concert/` → **slug** is `my-big-concert`.

When a user visits a URL like:

```text
https://yourwebsite.com/featured-event/?auto=my-big-concert
```

the plugin:

1. Detects the `auto` parameter.
2. Uses the slug value (`my-big-concert`) to automatically open the Showpass ticket widget for that event in a pop-up.

---

## Common use cases

* **Ad campaigns**
  Link ads directly to a page on your site with `?auto=event-slug` so the purchase widget opens immediately.

* **Dedicated event landing pages**
  If a page exists solely to sell one event, auto-opening the widget can remove an extra click and streamline checkout.

* **Email marketing**
  Include links like `https://yourwebsite.com/event-landing/?auto=event-slug` in newsletters so recipients see the widget right away.

---

## Best practices and considerations

* **User experience**
  Auto-opening widgets can be powerful but also intrusive if overused. Reserve this for clearly promotional pages where users expect to buy.

* **Page content still matters**
  The underlying WordPress page should still include event information (hero image, description, etc.). This is important if:

  * The user closes the widget.
  * There’s a delay while the widget loads.

* **Pop-up blockers**
  The Showpass widget typically appears as an in-page modal (not a browser pop-up), so most pop-up blockers should not interfere. Still, behavior can vary by browser and extensions.

* **Shortcode required**
  The page should include at least one Showpass shortcode (for example, `[showpass_widget]`, `[showpass_events]`, `[showpass_products]`, or `[showpass_memberships]`) so that the plugin’s scripts are loaded. The `auto` parameter relies on those scripts being present.

Using the `auto` parameter is a simple way to build high-conversion landing pages that take visitors straight into the purchase flow for a specific event.