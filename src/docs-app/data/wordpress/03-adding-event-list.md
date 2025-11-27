# Adding an event list

Display your upcoming events on any WordPress page or post using the `[showpass_events]` shortcode. Showcase multiple events and let visitors browse your offerings.


## Basic usage

Add an event list to any page or post:

1. Open the WordPress page editor
2. Add a **Shortcode** block
3. Enter: `[showpass_events type="list"]`

By default, this displays events in a **grid layout** with **8 events per page** (pagination included).

> **Note:** The `type="list"` parameter tells the shortcode to display a list/grid view (as opposed to a detail view for single events).

---

## Customizing your event list

Control the appearance and content using these parameters.

### Layout template

**Parameter:** `template="default|list|data"`

Choose how events are displayed:

- **`default`** (default) - Grid view layout
- **`list`** - Vertical list layout
- **`data`** - Returns raw JSON for custom PHP templates

**Example:**

```text
[showpass_events type="list" template="list"]
```

---

### `page_size="number"`

* **Use case:** Control how many events appear per page.
* **Default:** `8`
* **Example (show 5 events per page):**

  ```text
  [showpass_events type="list" page_size="5"]
  ```

---

### `detail_page="your-event-detail-page-slug"`

* **Use case:** Link each event in the list to a dedicated event detail page on your WordPress site.
* **What it is:** The slug of the WordPress page that uses `[showpass_events type="detail"]`.
* **Example:**
  If your detail page URL is `yourwebsite.com/event-info`, the slug is `event-info`:

  ```text
  [showpass_events type="list" detail_page="event-info"]
  ```

  *(See “Adding an Event Detail Page” for how to set this up.)*

---

### `tags="your-tag"` (or `tags="tag1,tag2"`)

* **Use case:** Show only events with specific tags from Showpass.
* **Tip:** Use simple, one-word, lowercase tags where possible.
* **Examples:**

  ```text
  [showpass_events type="list" tags="featured"]
  [showpass_events type="list" tags="music,concert"]
  ```
* **Note:** You can also filter by tags via URL (see **URL parameters** below).

---

### `show_past_events="true|false"`

* **Use case:** Switch between **upcoming** events and **past** events.
* **Behavior:**

  * `"false"` (or omitted) – Shows **upcoming** events (default behavior).
  * `"true"` – Shows **only past** events (events that have already ended).
* **Example (show only past events):**

  ```text
  [showpass_events type="list" show_past_events="true"]
  ```

---

### `event_ids="id1,id2,id3"`

* **Use case:** Display only specific events instead of all upcoming/past events.
* **What it is:** A comma-separated list of Showpass Event IDs.
* **Example:**

  ```text
  [showpass_events type="list" event_ids="254,288,292"]
  ```

---

### `ordering="parameter_name"`

* **Use case:** Control the order events are shown in.
* **Common values:**

  * `starts_on` – Order by start date (earliest first, default).
  * `name` – Order alphabetically by event name.
  * `id` – Order by event ID.
* **Reverse order:** Add `-` before the parameter name.
* **Examples:**

  ```text
  [showpass_events type="list" ordering="name"]
  [showpass_events type="list" ordering="-starts_on"]
  ```

---

### `show_widget_description="true|false"`

* **Use case:** Force the purchase widget’s description panel to show or hide when opening an event from this list, overriding the global admin setting.
* **Example:**

  ```text
  [showpass_events type="list" show_widget_description="true"]
  ```

---

### `lang="fr"`

* **Use case:** Set the **widget** interface language (when a user opens a purchase widget from this list).
* **Note:** This affects the widget only, not the list template itself (which is in English by default).
* **Example:**

  ```text
  [showpass_events type="list" lang="fr"]
  ```
* **Tip:** For a fully French page, use `template="data"` to build your own French template and keep `lang="fr"` so widgets also open in French.

---

### Recurring event parameters

Control how recurring events (events with multiple dates) appear in the list.

* **`hide_children="true|false"`**

  * `"false"` (default) – Keep individual occurrences visible.
  * `"true"` – Hide all child occurrences of recurring events.

* **`only_parents="true|false"`**

  * `"true"` (default) – Show non-recurring events **and** the main parent event for each recurring series.
  * `"false"` – Show non-recurring events **and** all individual occurrences.

**Important:** By default, `only_parents="true"` is automatically applied, meaning only parent events are shown unless you explicitly set `only_parents="false"`.

**Common patterns:**

* **Show only the parent event of each recurring series:**

  ```text
  [showpass_events type="list" only_parents="true"]
  ```

* **Show all individual occurrences of recurring events:**

  ```text
  [showpass_events type="list" only_parents="false"]
  ```

* **Hide all recurring events entirely:**

  ```text
  [showpass_events type="list" hide_children="true"]
  ```

---

### `ends_on__gte="..."` and `ends_on__lt="..."`

* **Use case:** Advanced filtering based on when events end.
* **Format:** ISO timestamp (`YYYY-MM-DDTHH:MM:SS.SSSZ`).
* **Example (events ending on or after June 23, 2024, 7:30 PM UTC):**

  ```text
  [showpass_events type="list" ends_on__gte="2024-06-23T19:30:00.000Z"]
  ```

---

### `show="all"`

* **Use case:** Show **all** events for your organization, including those that might be hidden or not normally visible. This is mainly for testing or internal views.
* **Example:**

  ```text
  [showpass_events type="list" show="all"]
  ```

---

### `override_q="true"`

* **Use case:** Prevent URL query parameter `q` (search query) from being applied to the API request.
* **Default:** `false` (URL `q` parameter is applied if present)
* **Example:**

  ```text
  [showpass_events type="list" override_q="true"]
  ```

**Note:** When `override_q="true"`, any `?q=searchterm` in the URL will be ignored. This is useful when you want to control search behavior entirely through shortcode parameters.

---

### `tracking_id="your-tracking-token"`

* **Use case:** Set an affiliate tracking ID for all events in this list.
* **Value:** Your Showpass tracking token
* **Example:**

  ```text
  [showpass_events type="list" tracking_id="campaign-123"]
  ```

**Note:** This applies tracking to all events displayed in the list. For per-event tracking, use the `tracking_id` parameter in individual `[showpass_widget]` shortcodes.

---

## URL parameters for filtering

You can also filter the event list using URL parameters on the page where `[showpass_events]` is placed. This is useful for dynamic links or search/filter pages.

Examples (assuming your event list page is `yourwebsite.com/events-page/`):

* **Search query:**

  ```text
  https://yourwebsite.com/events-page/?search_string=searchterm
  ```

  Filters to events matching `searchterm`.

* **Tags:**

  ```text
  https://yourwebsite.com/events-page/?tags=rock
  https://yourwebsite.com/events-page/?tags=rock,jazz
  ```

* **Date filtering (advanced):**

  ```text
  https://yourwebsite.com/events-page/?starts_on__gte=2024-07-01
  https://yourwebsite.com/events-page/?ends_on__lt=2024-08-01
  ```

---

## Example: A customized event list

```text
[showpass_events
  type="list"
  template="list"
  page_size="10"
  detail_page="event-details"
  tags="workshop"
  ordering="-starts_on"
]
```

This shortcode will:

1. Display events in list mode (`type="list"`).
2. Use a vertical list layout (`template="list"`).
3. Show 10 events per page (`page_size="10"`).
4. Link each event to the WordPress page with slug `event-details` (`detail_page="event-details"`).
5. Only show events tagged `workshop` (`tags="workshop"`).
6. Order events by start date, newest first (`ordering="-starts_on"`).

Experiment with these parameters to create the event list that best fits your site.
