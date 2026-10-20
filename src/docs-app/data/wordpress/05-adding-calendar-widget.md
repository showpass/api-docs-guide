# Adding a calendar widget

Use a calendar when customers need to browse dates before choosing tickets. The WordPress plugin offers two display options:

| Display | Shortcode | Customer experience |
| --- | --- | --- |
| Modal | `[showpass_calendar_widget]` | A button opens the calendar over the current page. |
| Embedded (inline) | `[showpass_embed_calendar]` | The calendar appears within the page layout. |

Both use the modern calendar, called **Calendar Widget V2.0** in the plugin readme. For new pages, use these shortcodes instead of the legacy `[showpass_calendar]`.

## Before you start

Set your **Organizer ID** in the Showpass plugin settings in WordPress and save the change. This setting is stored as `option_organization_id` and is required by the calendar shortcodes.

If it is missing, the plugin displays: `Please add your Showpass Organizer ID to your Wordpress Dashboard.`

## Add a calendar button

Open your page or post, add a **Shortcode** block, and enter:

```text
[showpass_calendar_widget label="Browse Dates"]
```

Publish or update the page. The button opens the calendar in a modal; if you omit `label`, its text is **Get Tickets**.

To show a selection of events, filter by tags:

```text
[showpass_calendar_widget label="Browse Workshops" tags="workshops"]
```

Use a comma-separated list for multiple tags, such as `tags="workshops,experiences"`.

## Embed one calendar

For a page where the calendar is the main content, use:

```text
[showpass_embed_calendar]
```

You can filter the embedded calendar too:

```text
[showpass_embed_calendar tags="workshops"]
```

These are alternative examples for a single calendar. Give it a wide content area and check the result in your theme on both desktop and mobile. Allow approximately 1200 px of width for the desktop layout.

## Configure an attraction calendar

For an attraction with recurring dates or time slots, add `is_attraction="true"`. Use `event_id` to scope the calendar to the parent event:

```text
[showpass_calendar_widget label="Book Admission" is_attraction="true" event_id="123456"]
```

For an inline version of the same calendar:

```text
[showpass_embed_calendar is_attraction="true" event_id="123456"]
```

These are **WordPress shortcode parameters**. For a direct JavaScript integration, use the separate [SDK Calendar Widget reference](/sdk/event-calendar-widget); its attraction example uses an event slug.

## Parameters

| Parameter | Applies to | Purpose |
| --- | --- | --- |
| `label` | Modal button | Button text; defaults to `"Get Tickets"` |
| `class` | Modal button | Custom CSS classes; defaults to `"showpass-button"` |
| `tags` | Both | Event tags, such as `"workshops"` or `"workshops,experiences"`; omit for all organizer events |
| `is_attraction` | Both | Set to `"true"` for attraction mode |
| `event_id` | Both | Scope the attraction calendar to a parent event |
| `lang` | Both | Use `"fr"` for French; English is the default |

For example, a French-language calendar button:

```text
[showpass_calendar_widget label="Voir les dates" lang="fr"]
```

## Calendar targeting and display options

The following options apply to both `[showpass_calendar_widget]` and `[showpass_embed_calendar]`.

> **Availability:** These shortcode options require plugin **4.0.9** and a matching calendar frontend and rebuilt SDK. The release work is tracked in [WordPress plugin PR #77](https://github.com/showpass/showpass-wordpress-plugin/pull/77) and [frontend PR #7283](https://github.com/showpass/showpass-frontend/pull/7283). Do not enable them before those updates are deployed. Legacy calendar routes and `[showpass_calendar]` do not implement these options.

| Shortcode attribute | Value | Effect |
| --- | --- | --- |
| `calendar_date` | Venue-local date, such as `"2026-12-14"` | Starts with that date selected before proceeding to time selection. |
| `calendar_timeslot` | Public timeslot slug, such as `"evening-show"` | Targets a time slot on `calendar_date`; use the actual slug for that calendar, not a display label or clock time. Requires `calendar_date`. |
| `calendar_special_event` | One configured special-event key, comma-separated keys, or `"all"` | Sets the initial special-event filters. Keys come from the calendar's special-event configuration. Use `all` on its own to select every currently filterable special event. |
| `calendar_open_state` | `"calendar"` or `"special-events"` | Chooses the initial discovery view independently of the special-event filters. Calendars without a rich Special Events panel stay in the calendar view. |
| `display_price_patron_type_id` | Positive venue-local PatronType ID, such as `"17"` | Changes display pricing only. It does not filter dates, availability, or the tickets customers can buy. |
| `hide_price` | `"true"` or `"false"` | Hides calendar price text and the price-range filter when true; availability and ticket selection are unchanged. |
| `highlight_multi_day_events_on_start_date_only` | `"true"` or `"false"` | Highlights a multi-day event only on its local start date when true. |

Omit an option to keep the calendar's default behavior. Use quoted shortcode values, including `"false"` when explicitly disabling a boolean option. Do not use JavaScript arrays or camelCase SDK option names in shortcodes.

### Open the Special Events view

For an attraction with Special Events configured:

```text
[showpass_calendar_widget label="Browse Special Events" is_attraction="true" event_id="123456" calendar_open_state="special-events" calendar_special_event="all"]
```

Opening the view and selecting filters are separate choices. Use only `calendar_open_state="special-events"` to open the panel without preselecting filters, or only `calendar_special_event="all"` to preselect filters while keeping the normal calendar view. `all` excludes ended special events and entries without usable stable keys.

Customers can switch back to Calendar. If a quantity prompt is configured, it appears first. An explicit Special Events opening view takes precedence over automatic navigation to a targeted date or time slot.

### Target a date and time slot

Replace the example date and timeslot slug with values for your calendar:

```text
[showpass_embed_calendar is_attraction="true" event_id="123456" calendar_date="2026-12-14" calendar_timeslot="evening-show"]
```

### Control display pricing and highlighting

Use a PatronType ID belonging to the organizer:

```text
[showpass_embed_calendar display_price_patron_type_id="17" hide_price="false" highlight_multi_day_events_on_start_date_only="true"]
```

These examples each use one embedded calendar. The [SDK reference](/sdk/event-calendar-widget#calendar-targeting-and-display-options) lists the equivalent JavaScript options and types.

## Combine calendars and event buttons

For admission, workshops, and experiences that customers should buy together, use calendar and [single-event buttons](/wordpress/adding-single-button-embed-widget) that all open modals. Keep the offerings under the same Showpass organization and add a visible [cart button](/wordpress/adding-checkout-cart-button):

```text
[showpass_calendar_widget label="Book Admission" is_attraction="true" event_id="123456"]
[showpass_calendar_widget label="Browse Workshops" tags="workshops"]
[showpass_widget slug="evening-experience" label="Book an Experience"]
[showpass_cart_button]
```

Closing one modal lets the customer browse another offering and return to the basket. Before launch, test adding items through each button and reopening the cart on the same website and browser.

## Maintaining the legacy calendar

Existing pages may use `[showpass_calendar]`. Keep these options for maintenance; choose one of the modern shortcodes above for new implementations.

| Legacy parameter | Purpose |
| --- | --- |
| `starting_date="1-12-2024"` | Initial date in `D-M-YYYY` format |
| `tags="workshops"` | Filter by tags |
| `hide_schedule="false"` | Show the daily schedule; default is `true` |
| `hide_children="true"` | Hide recurring child events; default is `false` |
| `only_parents="true"` | Show only parent events; default is `false` |
| `week="disabled"` | Disable week view |
| `month="disabled"` | Disable month view |
| `arrows="white-arrows"` | Apply the named arrow CSS class |
| `hide_view_select="true"` | Hide the view selector; default is `false` |

## Limitations and launch checks

**Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder.** This includes multiple embedded calendars or an embedded calendar beside an inline purchase widget. Separate inline widgets must not be relied on for one synchronized basket.

For a shared basket across several offerings, use modal buttons throughout. A single embedded calendar is a different layout. See [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket) before combining inline and modal widgets.

Test the full journey on desktop and mobile, including navigation between booking pages and adding items in different orders. Confirm the cart contains the expected items before checkout and before the basket expires.
