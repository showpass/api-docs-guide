# Widget parameter naming and migration

Public widget option names use snake_case in SDK objects, widget URL queries and WordPress shortcode attributes. HTML data attributes still use dashes, as in `data-calendar-date`. JavaScript function names, DOM container IDs, event names, organizer content and saved Website Builder configuration are unchanged.

## Release availability

This convention requires the SPW-20291 frontend and rebuilt SDK release. WordPress must use that SDK before its matching plugin update is published. Until deployment is verified, existing integrations should continue using their current names. Do not assume a cached SDK bundle supports the new names.

## SDK and URL compatibility aliases

Existing names remain supported. There is no scheduled removal in this release. New integrations should use the preferred names; existing integrations can migrate one option at a time.

| Preferred name | Existing alias |
| :--- | :--- |
| `calendar_date` | `calendarDate` |
| `calendar_timeslot` | `calendarTimeslot` |
| `calendar_special_event` | `calendarSpecialEvent` |
| `calendar_open_state` | `calendarOpenState` |
| `display_price_patron_type_id` | `displayPricePatronTypeId` |
| `hide_price` | `hidePrice` |
| `highlight_multi_day_events_on_start_date_only` | `highlightMultiDayEventsOnStartDateOnly` |
| `jump_to_event` | `jump-to-event` |
| `keep_shopping` | `keep-shopping` |
| `prompt_for_quantity` | `prompt-for-quantity` |
| `redirect_url` | `redirect-url` |
| `show_specific_tickets` | `show-specific-tickets` |
| `theme_dark` | `theme-dark` |
| `theme_primary` | `theme-primary` |
| `theme_secondary` | `theme-secondary` |
| `ticket_type_selection_required` | `ticket-type-selection-required`, historical `ticket-type-selection-requried` |
| `tracking_id` | `tracking-id` |
| `show_description` | `show-description` |
| `branding_style` | `branding-style` |
| `is_embedded` | `isEmbedded` |
| `is_widget` | `isWidget` |

Existing snake_case names such as `event_id`, `event_id__in`, `is_attraction`, `customer_attribution_token`, `purchase_source_platform` and UTM parameters keep their names. Single word options such as `lang`, `tags`, `screen`, `start` and `venue` are unchanged. An option is supported only by the widget or shortcode that already implements its behavior; consistent naming does not add capabilities to other widgets.

## Conflict resolution

An explicitly defined snake_case value wins over its alias, including `false`, `0` and an empty string. If the snake_case value is `undefined`, the alias is used. Normalization leaves the caller's object unchanged, preserves unknown keys, and sends only one name for each recognized option. Existing validation and defaults remain with each feature.

```js
const params = {
  calendar_date: "2026-12-14",
  hide_price: false,
  theme_primary: "24727b",
  keep_shopping: false,
};

// Modal
showpass.tickets.calendarWidget(42, params);

// Embedded, on a separate page with this container already present
showpass.tickets.calendarWidget(42, params, "calendar-container");
```

Equivalent direct URL:

```text
/widget/calendar/venue/42/?calendar_date=2026-12-14&hide_price=false&theme_primary=24727b&keep_shopping=false
```

Equivalent WordPress calendar attribute names, after the matching plugin release:

```text
[showpass_embed_calendar calendar_date="2026-12-14" hide_price="false" theme_primary="24727b" keep_shopping="false"]
```

WordPress gets the organization from plugin settings and uses quoted strings for values. Multiple special event keys are comma separated; SDK objects also accept an array. WordPress lowercases attribute names, so use snake_case rather than camelCase when authoring shortcodes. The existing `show_widget_description` attribute remains an alias for `show_description`. Plugin settings and older generated HTML continue to work.

For an attraction calendar, keep `is_attraction: true` and pass the attraction event slug as `event_id`. Display pricing options affect presentation only, not inventory or ticket choices. Calendar dates and timeslots retain their existing validation and fallback behavior.

## Migrate an existing integration

1. Confirm that the frontend and rebuilt SDK containing SPW-20291 are deployed. For WordPress, also install plugin 4.0.10 after that deployment.
2. Rename options in your SDK calls or widget URLs using the table above. Keep each value and the widget function unchanged. You can migrate one option at a time.
3. Test modal and embedded calendars separately, including date and special event selection, price visibility, language, tracking and checkout return behavior.
4. Remove duplicate spellings from your configuration after testing. Existing aliases remain supported, so reverting to your previous names is safe.

Before:

```js
showpass.tickets.calendarWidget(42, {
  calendarDate: "2026-12-14",
  hidePrice: true,
  "keep-shopping": false,
});
```

After:

```js
showpass.tickets.calendarWidget(42, {
  calendar_date: "2026-12-14",
  hide_price: true,
  keep_shopping: false,
});
```

If both `hidePrice: true` and `hide_price: false` are present, the price remains visible. Rename object keys only; do not rename SDK functions such as `calendarWidget`, callback options, event names or HTML data attributes.

WordPress 4.0.10 accepts the old `show_widget_description` name and dashed shared options on the modern widget shortcodes. Calendar aliases also accept camelCase names after WordPress lowercases them and dashed forms such as `calendar-date`. Prefer snake_case in saved shortcode content. Legacy event-list templates retain their own supported attributes; consult the [shortcode reference](/wordpress/shortcode-reference).
