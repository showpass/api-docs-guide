# Adding a calendar widget

Showpass offers a modern calendar widget to display your events. This is ideal for venues with many time-slot–based events or when you want to provide a visual calendar view for your users.

There are two main ways to add the new calendar:

1. **As a button that opens the calendar in a pop-up.**
2. **As a calendar embedded directly onto your page.**

> **Note**  
> The plugin refers to this as **“Calendar Widget V2.0”** in the GitHub readme and recommends it over the older `[showpass_calendar]` shortcode.

---

## Prerequisite: Organizer ID

All calendar shortcodes require your **Showpass Organizer ID** to be configured:

1. In your WordPress dashboard, go to the Showpass plugin settings.
2. Set the **Organizer ID** (this is stored as `option_organization_id`).
3. Save your changes.

If this value is not set, the calendar shortcodes will return:

> `Please add your Showpass Organizer ID to your Wordpress Dashboard.`

---

## 1. Calendar button (pop-up) with `[showpass_calendar_widget]`

This shortcode adds a button to your page. When a user clicks this button, the Showpass event calendar opens in a pop-up.

### How to add

1. Go to the WordPress page or post where you want the button.
2. Add a **Shortcode** block.
3. Use:

```text
[showpass_calendar_widget]
````

**Basic usage:**

```text
[showpass_calendar_widget]
```

This creates a button with the default label **“Get Tickets”**.

### Parameters for `[showpass_calendar_widget]`

* **`label="Your Button Text"`**

  * **Use case:** Change the text displayed on the button.
  * **Default:** `"Get Tickets"`
  * **Example:**

    ```text
    [showpass_calendar_widget label="View Event Calendar"]
    ```

* **`tags="your-tag"`** (or `tags="tag1,tag2"`)

  * **Use case:** Filter events by specific Showpass tags (categories). If omitted, all events for the organizer are shown.
  * **Example – only “comedy” events:**

    ```text
    [showpass_calendar_widget label="Comedy Shows Calendar" tags="comedy"]
    ```
  * **Example – show all events:**

    ```text
    [showpass_calendar_widget label="Full Event Calendar"]
    ```

* **`is_attraction="true"`**

  * **Use case:** Enable **attraction mode** (for time-slot attractions, day passes, etc.). This tells the widget to treat the events as an attraction calendar.
  * **Important:** The value must be the string `"true"` (not `true` or `is_attraction: true`).
  * **Example – attraction calendar button:**

    ```text
    [showpass_calendar_widget label="Buy Single Day Tickets" tags="Daily" is_attraction="true"]
    ```

* **`event_id="123456"`**

  * **Use case:** Optionally scope the attraction calendar to a specific parent event ID.
  * **Example:**

    ```text
    [showpass_calendar_widget label="Buy Tickets" is_attraction="true" event_id="123456"]
    ```

* **`class="your-css-class"`**

  * **Use case:** Override the default button class for custom styling.
  * **Default:** `"showpass-button"`
  * **Example:**

    ```text
    [showpass_calendar_widget label="View Calendar" class="my-custom-button"]
    ```

* **`lang="fr"`**

  * **Use case:** Set the widget UI language. If not specified, it defaults to English.
  * **Currently supported:** `"fr"` for French.
  * **Example:**

    ```text
    [showpass_calendar_widget label="Voir le calendrier" lang="fr"]
    ```

---

## 2. Embedded calendar with `[showpass_embed_calendar]`

This shortcode embeds the full calendar directly into your WordPress page or post.

### How to add

1. Go to the WordPress page or post where you want the calendar embedded.
2. Add a **Shortcode** block.
3. Use:

```text
[showpass_embed_calendar]
```

**Basic usage:**

```text
[showpass_embed_calendar]
```

This embeds a calendar showing all events for your organizer.

### Layout considerations

For the embedded calendar to display correctly on desktop, the container or section where you place this shortcode should be **at least ~1200px wide**. If the container is too narrow, the calendar may appear cramped or misaligned.

### Parameters for `[showpass_embed_calendar]`

* **`tags="your-tag"`** (or `tags="tag1,tag2"`)

  * **Use case:** Filter events in the embedded calendar by Showpass tags. If omitted, all events are shown.
  * **Example – only “workshop” events:**

    ```text
    [showpass_embed_calendar tags="workshop"]
    ```
  * **Example – show all events:**

    ```text
    [showpass_embed_calendar]
    ```

* **`is_attraction="true"`**

  * **Use case:** Enable attraction mode for the embedded calendar, similar to the widget button.
  * **Example:**

    ```text
    [showpass_embed_calendar tags="Daily" is_attraction="true"]
    ```

* **`event_id="123456"`**

  * **Use case:** Scope the embedded attraction calendar to a specific event ID.
  * **Example:**

    ```text
    [showpass_embed_calendar is_attraction="true" event_id="123456"]
    ```

* **`lang="fr"`**

  * **Use case:** Set the embedded calendar UI language.
  * **Default:** English
  * **Example:**

    ```text
    [showpass_embed_calendar tags="workshop" lang="fr"]
    ```

---

## Which calendar option should I use?

* **Button (`[showpass_calendar_widget]`):**

  * Best when you want to keep the page layout clean.
  * Users only see the calendar when they click the button.
  * Works well in headers, sidebars, or call-to-action sections.

* **Embedded (`[showpass_embed_calendar]`):**

  * Best when the calendar is the main content of the page (e.g., a “What’s On” or “Events Calendar” page).
  * Needs more horizontal space for an optimal layout.

Both options use the same modern Showpass calendar engine.

---

## Older calendar shortcode `[showpass_calendar]` (legacy)

The plugin still includes an older calendar shortcode:

```text
[showpass_calendar]
```

This works, but for **new implementations** you should use:

* `[showpass_calendar_widget]` (button pop-up), or
* `[showpass_embed_calendar]` (embedded calendar).

If you need to maintain an existing `[showpass_calendar]` setup, here is a brief reference for the key parameters:

* **`starting_date="D-M-YYYY"`**

  * **Format:** `day-month-year` (no leading zeros).
  * **Example:** `starting_date="1-12-2024"` → December 1, 2024.
  * Sets the initial month/day the calendar displays.

* **`tags="tagname"`**

  * Filter events by a specific tag (similar to the newer shortcodes).

* **`hide_schedule="true"` / `"false"`**

  * Controls the horizontal daily schedule display under the calendar.
  * **Default:** `hide_schedule="true"` (schedule is hidden).
  * Set `hide_schedule="false"` to show the schedule.

* **Recurring event controls**

  * **`hide_children="true|false"`**
  * **`only_parents="true|false"`**
  * Both default to `"false"`, which shows all instances of recurring events.
  * Use these if you want to hide individual child occurrences or show only parent events.

* **View configuration**

  * **`week="disabled"`** – disable week view.
  * **`month="disabled"`** – disable month view.
  * If omitted, both views are available along with day view.

* **Navigation styling**

  * **`arrows="white-arrows"`**

    * Adds a CSS class that can be used to style the previous/next arrows (commonly to white).

* **View selector**

  * **`hide_view_select="true"`**

    * Hides the dropdown that lets users switch between **month**, **week**, and **day** views.
    * **Default:** `"false"` (the selector is shown).

For any new pages or redesigns, prefer:

```text
[showpass_calendar_widget]
```

or

```text
[showpass_embed_calendar]
```
