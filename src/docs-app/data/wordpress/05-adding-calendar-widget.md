# Adding a calendar widget

Showpass offers a modern calendar widget to display your events. This is often a great solution for venues with many time-slot based events or if you want to provide a visual calendar view for your users.

There are two main ways to add the new calendar:

1.  **As a button that opens the calendar in a pop-up.**
2.  **As a calendar embedded directly onto your page.**

**Note:** The plugin refers to this as "Calendar Widget V2.0" in the GitHub readme and recommends it over the older `[showpass_calendar]` shortcode.

## 1. Calendar button (pop-up) with `[showpass_calendar_widget]`

This shortcode adds a button to your page. When a user clicks this button, the Showpass event calendar opens in a pop-up window.

**How to Add:**

1.  Go to the WordPress page or post where you want the button.
2.  Add a "Shortcode" block.
3.  Type the shortcode: `[showpass_calendar_widget]`

**Basic Usage:**
`[showpass_calendar_widget]`

This will create a button with the default label "Get Tickets".

### Parameters for `[showpass_calendar_widget]`:

- **`label="Your Button Text"`**

  - **Use Case**: To change the text displayed on the button.
  - **Default**: "Get Tickets"
  - **Example**: `[showpass_calendar_widget label="View Event Calendar"]`

- **`tags="your-tag"`** (or `tags="tag1,tag2"`)
  - **Use Case**: To filter the events displayed in the pop-up calendar by specific Showpass tags (categories). If you remove this parameter, all events will be shown.
  - **Example (Only show events tagged "comedy")**:
    `[showpass_calendar_widget label="Comedy Shows Calendar" tags="comedy"]`
  - **Example (Show all events)**:
    `[showpass_calendar_widget label="Full Event Calendar"]`

- **`lang="fr"`**
  - **Use Case**: To change the calendar widget interface language to French. If not specified, the widget will default to English.
  - **What it is**: A language code. Currently supports `"fr"` for French.
  - **Example**: `[showpass_calendar_widget label="View Event Calendar" lang="fr"]`

## 2. Embedded calendar with `[showpass_embed_calendar]`

This shortcode embeds the full calendar directly onto your WordPress page or post.

**How to Add:**

1.  Go to the WordPress page or post where you want the calendar embedded.
2.  Add a "Shortcode" block.
3.  Type the shortcode: `[showpass_embed_calendar]`

**Important Consideration for Embedded Calendar:**
For the embedded calendar to display correctly, especially on desktop computers, ensure the container or section of your page where you place this shortcode is **at least 1200 pixels wide**. If the container is too narrow, the calendar might not look right.

**Basic Usage:**
`[showpass_embed_calendar]`

This will embed the calendar showing all events.

### Parameters for `[showpass_embed_calendar]`:

- **`tags="your-tag"`** (or `tags="tag1,tag2"`)
  - **Use Case**: To filter the events displayed in the embedded calendar by specific Showpass tags (categories). If you remove this parameter, all events will be shown.
  - **Example (Only show events tagged "workshop")**:
    `[showpass_embed_calendar tags="workshop"]`
  - **Example (Show all events)**:
    `[showpass_embed_calendar]`

- **`lang="fr"`**
  - **Use Case**: To change the embedded calendar interface language to French. If not specified, the widget will default to English.
  - **What it is**: A language code. Currently supports `"fr"` for French.
  - **Example**: `[showpass_embed_calendar tags="workshop" lang="fr"]`

## Which calendar option to choose?

- **Button (`[showpass_calendar_widget]`):**
  - Good if you want to save space on your page and let users open the calendar only if they need it.
  - Less demanding on page layout.
- **Embedded (`[showpass_embed_calendar]`):**
  - Good if the calendar is a primary feature of the page (e.g., a dedicated "What's On" page).
  - Requires more page width for optimal display.

Both options provide a user-friendly, modern interface for browsing events by date.

---

### Older calendar shortcode `[showpass_calendar]` (not recommended for new implementations)

The plugin also contains an older calendar shortcode: `[showpass_calendar]`. While it still functions, the new `[showpass_calendar_widget]` and `[showpass_embed_calendar]` are recommended for better features and user experience.

If you are using the older calendar or need to maintain an existing setup, here's a brief overview of its parameters:

- **`starting_date="D-M-YYYY"`**: Sets the initial month the calendar displays (e.g., `1-12-2024`).
- **`tags="tagname"`**: Filters events by a specific tag.
- **`hide_schedule="true"`**: Hides the daily schedule list often shown with the calendar.
- **Recurring Event Parameters (`hide_children`, `only_parents`)**: Similar to `[showpass_events]` for controlling display of recurring events. Default is `hide_children='false'` and `only_parents='false'`, showing all occurrences.
- **`week="disabled"`** or **`month="disabled"`**: Disables week or month view.
- **`arrows="white-arrows"`**: Shows white navigation arrows.
- **`hide_view_select="true"`**: Hides the dropdown to switch between month, week, or day views.

For new websites, please use `[showpass_calendar_widget]` or `[showpass_embed_calendar]`.
