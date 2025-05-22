# Adding an event list with [showpass_events]

To display a list of your upcoming events on any WordPress page or post, you'll use the `[showpass_events]` shortcode. This is a powerful way to showcase multiple events at once, allowing visitors to browse what you have to offer.

By default, this shortcode will display events in a grid layout.

## Basic event list

To add a basic event list:

1.  Go to the WordPress page or post where you want to display your events.
2.  Add a "Shortcode" block (or paste directly into a Paragraph block).
3.  Type the following shortcode:

    `[showpass_events type="list"]`

This will display a list of your upcoming events, using the default settings (grid template, 20 events per page).

## Key parameter: `type="list"`

For the `[showpass_events]` shortcode to display a list of events, the `type="list"` parameter is **required**.

## Customizing your event list: Parameters

You can customize how your event list appears and which events are shown using various parameters. Remember, parameters are added inside the square brackets `[]` and follow the `parameter="value"` format.

Here are the common parameters for `[showpass_events type="list"]`:

- **`template="default|list|data"`**

  - **Use Case**: To change the visual layout of your event list.
  - **`"default"`**: Displays events in a grid view (this is the default if the parameter is not used).
  - **`"list"`**: Displays events in a vertical list view.
  - **`"data"`**: Returns the raw event data in JSON format. This is for advanced users who want to build completely custom templates with PHP. (See "Creating Custom Templates" page for more info).
  - **Example (List View)**: `[showpass_events type="list" template="list"]`

- **`page_size="number"`**

  - **Use Case**: To control how many events are shown per page. If you have more events than this number, pagination links (Next/Previous Page) will usually appear (depending on the template).
  - **Default**: `20`
  - **Example (Show 5 events per page)**: `[showpass_events type="list" page_size="5"]`

- **`detail_page="your-event-detail-page-slug"`**

  - **Use Case**: To link each event in the list to a dedicated event detail page on your WordPress site. This is highly recommended for a better user experience.
  - **What it is**: The slug (URL part) of the WordPress page you've created to show individual event details (this page will use `[showpass_events type="detail"]`).
  - **Example**: If your event detail page has the URL `yourwebsite.com/event-info`, the slug is `event-info`.
    `[showpass_events type="list" detail_page="event-info"]`
  - _(See "Adding an Event Detail Page" for instructions on creating this page)._

- **`tags="your-tag"`** (or `tags="tag1,tag2"`)

  - **Use Case**: To filter the list and show only events that have specific tags (categories) in Showpass. For best results, use one-word lowercase tags.
  - **Example (Show events tagged "featured")**: `[showpass_events type="list" tags="featured"]`
  - **Example (Show events tagged "music" or "concert")**: `[showpass_events type="list" tags="music,concert"]`
  - _Note_: You can also filter by tags by adding `?tags=your-tag` to the URL of the page where the event list is displayed.

- **`show_past_events="true"`** (or `show_past_events="false"`)

  - **Use Case**: To include events that have already happened in your list.
  - **`"false"` (Default)**: Only upcoming events are shown.
  - **`"true"`**: Past events are also included.
  - **Example**: `[showpass_events type="list" show_past_events="true"]`

- **`event_ids="id1,id2,id3"`**

  - **Use Case**: To display only a specific selection of events, rather than all upcoming (or past) events.
  - **What it is**: A comma-separated list of Showpass Event IDs.
  - **Example (Display only events with IDs 254, 288, and 292)**:
    `[showpass_events type="list" event_ids="254,288,292"]`

- **`ordering="parameter_name"`**

  - **Use Case**: To change the order in which events appear.
  - **Default**: Events are ordered by start date, earliest to latest (`starts_on`).
  - **Accepted values**:
    - `starts_on`: Order by event start date.
    - `name`: Order alphabetically by event name.
    - `id`: Order by event ID.
  - **To reverse the order**, add a hyphen `-` before the parameter name.
  - **Example (Order by name A-Z)**: `[showpass_events type="list" ordering="name"]`
  - **Example (Order by start date, latest to earliest)**: `[showpass_events type="list" ordering="-starts_on"]`

- **`show_widget_description="true"`** (or `show_widget_description="false"`)

  - **Use Case**: To explicitly show or hide the description panel within the purchase widget if an event from this list is clicked and opens a widget. This overrides the global admin setting.
  - **Example**: `[showpass_events type="list" show_widget_description="true"]`

- **Recurring Event Parameters**:

  - **`hide_children="true|false"`**:
    - **`"false"` (Default)**: Shows individual occurrences of recurring events.
    - **`"true"`**: Hides all individual recurring event occurrences.
  - **`only_parents="true|false"`**:
    - **`"true"` (Default)**: Shows non-recurring events AND only the main "parent" event of a recurring series (not each instance).
    - **`"false"`**: Shows non-recurring events AND all individual occurrences of recurring events.
  - **Use Case**: To control how events that repeat (e.g., a weekly workshop) are displayed in the list.
  - **Example (Show only the main parent event of a recurring series)**:
    `[showpass_events type="list" only_parents="true" hide_children="false"]` (or simply `[showpass_events type="list" only_parents="true"]` as `hide_children` defaults to false)
  - **Example (Hide all recurring events entirely)**:
    `[showpass_events type="list" hide_children="true"]`

- **`ends_on__gte="YYYY-MM-DDTHH:MM:SS.SSSZ"`** or **`ends_on__lt="YYYY-MM-DDTHH:MM:SS.SSSZ"`**

  - **Use Case**: To filter events based on when they end. `gte` means "greater than or equal to" (ending on or after this date). `lt` means "less than" (ending before this date).
  - **Format**: The date must be in ISO format.
  - **Example (Events ending on or after June 23, 2024, 7:30 PM UTC)**:
    `[showpass_events type="list" ends_on__gte="2024-06-23T19:30:00.000Z"]`

- **`show="all"`**
  - **Use Case**: For testing purposes. This will show all events from your organization, regardless of their visibility settings (e.g., draft or private events) in Showpass.
  - **Example**: `[showpass_events type="list" show="all"]`

## URL parameters for filtering

Some filtering can also be done by adding parameters directly to the URL of the page where your event list is. This is useful for creating dynamic links or allowing users to search/filter.

- **Search query**: `yourwebsite.com/events-page/?q=searchterm`
  - Will filter the list to events matching "searchterm".
- **Tags**: `yourwebsite.com/events-page/?tags=rock`
  - Will filter by the tag "rock". Works with multiple tags: `?tags=tag1,tag2`.
- **Date filtering (advanced)**: Parameters like `?starts_on__gte=YYYY-MM-DD` (starts on or after) or `?ends_on__lt=YYYY-MM-DD` (ends before) can also be used in the URL.

## Example: A customized event list

Here's an example combining several parameters:

`[showpass_events type="list" template="list" page_size="10" detail_page="event-details" tags="workshop" ordering="-starts_on"]`

This shortcode would:

1.  Display events because `type="list"`.
2.  Use a vertical list layout (`template="list"`).
3.  Show 10 events per page (`page_size="10"`).
4.  Link each event's "More Info" button to a page with the slug `event-details` (`detail_page="event-details"`).
5.  Only show events tagged with "workshop" (`tags="workshop"`).
6.  Order the events by their start date, with the newest events appearing first (`ordering="-starts_on"`).

Experiment with these parameters to create the perfect event listing for your site!
