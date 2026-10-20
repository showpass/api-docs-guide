# Calendar Widget

Use `calendarWidget` when customers need to browse dates before choosing tickets. It supports two calendar types, each available as a modal or an inline embed:

| Calendar | Use it for | Required identifiers |
| --- | --- | --- |
| Standard | Events for an organization, optionally filtered by tags | Organization ID (`venueId`) |
| Attraction | A recurring attraction with dates and time slots | Organization ID and the attraction event's slug |

## Before you start

[Load the SDK once](/sdk/sdk-getting-started) and wait for it to be ready. Use the loading and button-handling pattern in that guide with the calls below.

Find your Organization ID in your venue settings in the Showpass dashboard. Attraction calendars also need the main event's **slug**. In the JavaScript SDK, the option named `event_id` takes that slug, not a numeric event ID.

## Open a standard calendar

Call this from a button handler. Omit `tags` to show the organization's events without a tag filter:

```javascript
window.showpass.tickets.calendarWidget(123, {
  "theme-primary": "#24727b",
  tags: "workshops",
});
```

The calendar opens in a modal. Use a comma-separated string, such as `"workshops,experiences"`, for multiple tags.

## Open an attraction calendar

Set `is_attraction: true` and supply the attraction slug:

```javascript
window.showpass.tickets.calendarWidget(123, {
  is_attraction: true,
  event_id: "daily-admission",
  "ticket-type-selection-required": true,
  "prompt-for-quantity": true,
});
```

This also opens a modal. Customers can choose a date and time slot before continuing with their tickets.

## Embed one calendar

Create a container and pass its ID as the third argument. Run the call after both the SDK and container are ready:

```html
<div id="showpass-calendar"></div>
```

```javascript
window.showpass.tickets.calendarWidget(
  123,
  { "theme-primary": "#24727b", tags: "workshops" },
  "showpass-calendar"
);
```

For an embedded attraction calendar, use the attraction options above as the second argument. The container argument controls the display mode; the options choose the calendar's content.

## Parameters

Pass `{}` when no options are needed.

| Parameter | Type | Purpose |
| --- | --- | --- |
| `venueId` | Number or string | Organization identifier |
| `params` | Object | Calendar and appearance options |
| `containerId` | String, optional | Existing container ID for inline mode; omit for a modal |
| `params['theme-primary']` | String | Primary color, such as `"#24727b"` |
| `params['lang']` | String | Use `"fr"` for French; English is the default |
| `params['tags']` | String | Comma-separated event tags for a standard calendar |
| `params['is_attraction']` | Boolean | Set to `true` for an attraction calendar |
| `params['event_id']` | String | Attraction event **slug**, required for attraction mode |
| `params['ticket-type-selection-required']` | Boolean | Require ticket-type selection before choosing a date |
| `params['prompt-for-quantity']` | Boolean | Prompt for quantity before adding tickets to the cart |

## Calendar targeting and display options

These options work in the second argument to `calendarWidget` for both modal and embedded calendars. Use the camelCase names below for SDK calls; [WordPress shortcodes](/wordpress/adding-calendar-widget#calendar-targeting-and-display-options) use snake_case attributes.

> **Availability:** Use a frontend and rebuilt SDK that implement these options. Special Events opening-view and `all` support are tracked in [frontend PR #7283](https://github.com/showpass/showpass-frontend/pull/7283); do not rely on them until that update is deployed. Legacy calendar routes do not implement the new targeting and display options.

| SDK option | Type | Outgoing URL parameter | Effect |
| --- | --- | --- | --- |
| `calendarDate` | String | `calendar_date` | Venue-local date in `YYYY-MM-DD` format, such as `"2026-12-14"`. Selects the date before proceeding to time selection. |
| `calendarTimeslot` | String | `calendar_timeslot` | Public timeslot slug on `calendarDate`, such as `"evening-show"`. Requires `calendarDate`; use the actual slug, not a display label or clock time. |
| `calendarSpecialEvent` | String or string array | `calendar_special_event` | Configured stable special-event key, multiple keys, or the single reserved value `"all"` to select every currently filterable special event. |
| `calendarOpenState` | `"calendar"` or `"special-events"` | `calendar_open_state` | Initial discovery view. Falls back to Calendar when no rich Special Events panel exists. |
| `displayPricePatronTypeId` | Number | `display_price_patron_type_id` | Positive venue-local PatronType ID. Affects display pricing only, without filtering availability, dates, or purchasable ticket types. |
| `hidePrice` | Boolean | `hide_price` | Hides calendar price text and the price-range filter when true. Does not change availability or ticket selection. |
| `highlightMultiDayEventsOnStartDateOnly` | Boolean | `highlight_multi_day_events_on_start_date_only` | Highlights a multi-day event only on its venue-local start date when true. |

The SDK maps these camelCase options to the snake_case URL parameters internally. Use the SDK option names in JavaScript objects; the URL names describe iframe transport. Arrays produce repeated `calendar_special_event` query parameters.

Omit an option to retain calendar defaults. Pass numbers and booleans as JavaScript values, such as `17` and `false`, rather than strings.

### Open Special Events and select all filters

Run this after the SDK is ready, using your own organization and attraction slug:

```javascript
window.showpass.tickets.calendarWidget(123, {
  is_attraction: true,
  event_id: "daily-admission",
  calendarOpenState: "special-events",
  calendarSpecialEvent: "all",
});
```

The two options are independent: `calendarOpenState` chooses the view, while `calendarSpecialEvent` chooses filters. To preselect specific keys instead, use `calendarSpecialEvent: ["opening-night", "holiday-show"]` with keys from that calendar's configuration. `"all"` excludes ended special events and entries without usable stable keys; do not combine it with individual keys in an array.

A configured quantity prompt appears first. An explicit Special Events opening view takes precedence over automatic date/timeslot navigation. Customers can switch back to Calendar and continue browsing.

### Embed a targeted date and time slot

Create the container before running the SDK call. Replace the example date, slug, and PatronType ID with values for your calendar:

```html
<div id="targeted-calendar"></div>
```

```javascript
window.showpass.tickets.calendarWidget(
  123,
  {
    is_attraction: true,
    event_id: "daily-admission",
    calendarDate: "2026-12-14",
    calendarTimeslot: "evening-show",
    displayPricePatronTypeId: 17,
    hidePrice: false,
    highlightMultiDayEventsOnStartDateOnly: true,
  },
  "targeted-calendar"
);
```

### Target several special events

For an attraction with configured special events, pass their stable keys, not event IDs, display labels, or ordinary event tags:

```javascript
window.showpass.tickets.calendarWidget(123, {
  is_attraction: true,
  event_id: "daily-admission",
  calendarDate: "2026-12-14",
  calendarTimeslot: "evening-show",
  calendarSpecialEvent: ["opening-night", "holiday-show"],
  displayPricePatronTypeId: 17,
  hidePrice: true,
});
```

Use `calendarSpecialEvent: "opening-night"` for a single key. These filters select configured attraction special events; they do not replace the standard calendar's `tags` filter.

### Direct-target fallback

Direct targets are initial selections, not a way to bypass availability or purchase tickets automatically:

- A malformed date, multiple date/timeslot values, or a timeslot without a valid date causes the direct-target request to be ignored. Normal calendar browsing remains available.
- A past date does not become the selected date. The calendar uses its normal discovery flow.
- A valid future date is selected only if the normal calendar response contains that day. If the month has events but the requested day does not, the calendar stays on that month without selecting the day. An empty month falls back to normal first-event discovery.
- If a timeslot slug does not match the selected date's public timeslots, customers choose from the available times instead.
- Unknown special-event keys do not create filters. If any requested key is unknown, the initial special-event filter selection is discarded.

Dates are interpreted in the venue's timezone. Normal ticket availability, quantity prompts, and checkout validation still apply.

## Shared-basket limitations

For several calendars or a calendar alongside single-event widgets, use buttons that open modals when customers need one basket. Keep the offerings within the same Showpass organization and provide a [checkout button](/sdk/checkout-widget).

**Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder.** This includes multiple embedded calendars and calendars beside inline purchase widgets. A single embedded calendar is a different layout.

Read [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket) for the full layout guidance and launch checks. Test adding items through each entry point, in different orders, and confirm the expected basket before checkout.
