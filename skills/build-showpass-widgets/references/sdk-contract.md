# Showpass SDK contract

## Evidence and version

This reference was verified on 2026-07-14 against:

- `showpass/showpass-frontend`, `packages/core/src/app-contexts/sdk/`
- the focused tests beside that source
- the production bundle at `https://www.showpass.com/static/dist/sdk.js`
- the SDK pages at `https://dev.showpass.com/sdk/01-sdk-getting-started`

The canonical URL currently redirects to a version deployed through Showpass's CDN. Keep the canonical URL in integrations; do not pin the CDN hostname.

If current source or live behavior differs, update the implementation from the newer evidence and call out the drift.

## Global API

Loading the SDK creates `window.showpass`:

```ts
window.showpass = {
  config,
  tickets,
};
```

Wait for the script `load` event and then check `window.showpass?.tickets`.

## Public methods

All widget factory methods below create and show their widget before resolving. A `containerId` switches from modal mode to embedded mode.

| Method                     | Current shape                                               | Notes                                                                                  |
| -------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `eventPurchaseWidget`      | `(slug = "", params = {}, containerId?) => Promise<Widget>` | Use the event slug. Secondary theme defaults to primary.                               |
| `productPurchaseWidget`    | `(id, params, containerId?) => Promise<Widget>`             | Product-to-checkout navigation preserves the embedded container.                       |
| `membershipPurchaseWidget` | `(id, params, containerId?) => Promise<Widget>`             | The route names this value `membershipSlug`; verify the organizer-provided identifier. |
| `calendarWidget`           | `(venueIdOrSlug, params, containerId?) => Promise<Widget>`  | Supports standard and attraction calendars.                                            |
| `checkoutWidget`           | `(params, containerId?) => Promise<Widget>`                 | Requires the browser's current Showpass cart state.                                    |
| `expressCheckoutWidget`    | `(params, containerId?) => Promise<Widget>`                 | Use only when the product flow explicitly requires it.                                 |
| `addCartCountListener`     | `(listener) => cleanup`                                     | The callback receives a numeric cart count. Always call the cleanup function.          |

## Modal and embedded modes

Modal mode:

- Omit `containerId`.
- The SDK creates an overlay and iframe, locks page scrolling, and restores scroll when the modal closes.

Embedded mode:

- Render a unique container element before calling the method.
- Pass that element's ID as the final argument.
- The SDK throws when the element does not exist.
- The SDK adds `showpass-widget-embedded-wrapper`, creates an iframe with `allow="payment *"`, and passes `is_embedded=true` to the widget route.
- Keep one SDK mount per container. The widget handle has lifecycle methods such as `unmount()` and `remount()`, but those are implementation-level APIs rather than a React component contract.

## Query params

The general source-level `WidgetQueryParams` inventory below is supplemented by the calendar URL mappings in [Typed calendar options and URL mapping](#typed-calendar-options-and-url-mapping):

```text
event_id
event_id__in
isWidget
is_attraction
purchase_source_platform
screen
start
tags
venue
utm_campaign
utm_content
utm_medium
utm_source
utm_term
jump_to_event
keep_shopping
prompt_for_quantity
redirect_url
show_specific_tickets
theme_dark
theme_primary
theme_secondary
ticket_type_selection_required
tracking_id
show_description
lang
```

Do not treat this as proof that every parameter is meaningful for every widget. Check the relevant published page and downstream route before using uncommon parameters.

Common consumer-safe options include:

```ts
{
  "theme_primary": "#24727b",
  "theme_secondary": "#1b5359",
  "keep_shopping": true,
  "show_description": true,
  lang: "fr",
  "tracking_id": "partner-campaign",
}
```

### Explicit false values

The SPW-20291 SDK preserves explicit boolean false when constructing iframe URLs, including `keep_shopping: false` and `show_description: false`. Older bundles may omit false; verify the deployed SDK version before relying on this correction. Zero and empty string still follow existing feature validation and serialization rules.

### Parameter enrichment

Before opening purchase and checkout widgets, the SDK:

- adds parent-page UTM parameters unless explicitly supplied;
- adds an encoded clean `redirect_url` unless supplied;
- saves enriched options in session storage for off-site payment return handling;
- removes payment-provider return parameters from the visible parent URL after redirect recovery.

Do not duplicate this behavior in an application wrapper.

## Calendar variants

Standard calendar:

```ts
await tickets.calendarWidget(venueId, {
  "theme_primary": "#24727b",
  tags: "featured,comedy",
});
```

Attraction calendar:

```ts
await tickets.calendarWidget(venueId, {
  "theme_primary": "#24727b",
  is_attraction: true,
  event_id: attractionEventSlug,
  "ticket_type_selection_required": true,
  "prompt_for_quantity": true,
});
```

Attraction routing requires both `is_attraction: true` and a non-empty `event_id`. Without both, the SDK uses the standard calendar route.

Although the option is named `event_id`, the current attraction route consumes an event **slug** (`pages/widget/calendar/attraction/[eventSlug].tsx`). Pass the organizer-provided attraction slug, not a numeric database ID.

### Typed calendar options and URL mapping

`calendarWidget` accepts `CalendarWidgetParams`. SDK callers use snake_case, matching URL parameters and WordPress attributes. Existing camelCase calendar names and dashed shared names remain supported aliases; canonical values take precedence, including false. Normalization is shared by SDK and route adapters through `shared/utils/urls/widget-params.ts`.

| SDK option | Type | Outgoing URL parameter | Effect |
| --- | --- | --- | --- |
| `calendar_date` | String | `calendar_date` | Venue-local date in `YYYY-MM-DD` format, such as `"2026-12-14"`. Selects the date before proceeding to time selection. |
| `calendar_timeslot` | String | `calendar_timeslot` | Public timeslot slug on `calendar_date`, such as `"evening-show"`. Requires `calendar_date`; use the actual slug, not a display label or clock time. |
| `calendar_special_event` | String or string array | `calendar_special_event` | Configured stable special-event key, multiple keys, or the single reserved value `"all"` to select every currently filterable special event. |
| `calendar_open_state` | `"calendar"` or `"special-events"` | `calendar_open_state` | Initial discovery view. Falls back to Calendar when no rich Special Events panel exists. |
| `display_price_patron_type_id` | Number | `display_price_patron_type_id` | Positive venue-local PatronType ID. Affects display pricing only, without filtering availability, dates, or purchasable ticket types. |
| `hide_price` | Boolean | `hide_price` | Hides calendar price text and the price-range filter when true. Does not change availability or ticket selection. |
| `highlight_multi_day_events_on_start_date_only` | Boolean | `highlight_multi_day_events_on_start_date_only` | Highlights a multi-day event only on its venue-local start date when true. |

The option mapping follows `packages/core/src/app-contexts/sdk/services/Widget/Widget-types.ts` and `packages/core/src/app-contexts/sdk/features/calendar.ts`. `calendar_open_state` and the reserved `calendar_special_event: "all"` require the matching frontend and rebuilt SDK release; see the [calendar guide](https://dev.showpass.com/sdk/event-calendar-widget#calendar-targeting-and-display-options) for availability. This source check does not establish that a deployed bundle contains those additions.

Use venue-local `YYYY-MM-DD` dates and actual public timeslot slugs. Special-event keys refer to configured attraction special events, not ordinary event tags or database IDs. A string selects one key; an array selects multiple keys and is transported as repeated `calendar_special_event` query parameters. Omit options to keep defaults. Explicit boolean false is preserved by the SPW-20291 SDK; verify deployment before relying on the correction.

Modal display-pricing example:

```ts
await tickets.calendarWidget(venueId, {
  display_price_patron_type_id: 17,
  hide_price: true,
});
```

Embedded attraction direct-target example, after the SDK and container are ready:

```ts
await tickets.calendarWidget(venueId, {
  is_attraction: true,
  event_id: attractionEventSlug,
  calendar_date: "2026-12-14",
  calendar_timeslot: "evening-show",
  calendar_special_event: ["opening-night", "holiday-show"],
  display_price_patron_type_id: 17,
  hide_price: false,
}, "attraction-calendar");
```

Use `calendar_special_event: "opening-night"` for a single configured key. Use `"all"` on its own to select all currently filterable special events after the corresponding SDK release. `calendar_open_state: "special-events"` opens the rich Special Events panel independently of filter selection; a configured quantity prompt remains first, and calendars without that panel retain the Calendar view.

Direct targets do not bypass availability. Malformed dates or a timeslot without a valid date discard the direct-target request. Past dates use normal discovery. A requested future day is selected only when returned by the regular calendar response; a missing day stays unselected in a nonempty target month, while an empty month falls back to first-event discovery. An unmatched timeslot leaves time selection to the customer. Unknown special-event keys discard the initial special-event filter selection.

For WordPress, use the corresponding snake_case shortcode attributes and comma-separated special-event keys. The plugin's `event_id` attribute forwards the attraction event slug to the same SDK route; it is not a numeric event ID. See the [WordPress calendar guide](https://dev.showpass.com/wordpress/adding-calendar-widget#calendar-targeting-and-display-options).

## Cart listener

```ts
const removeListener = window.showpass.tickets.addCartCountListener((count) => {
  updateCartBadge(count);
});

// On route/component teardown:
removeListener();
```

The SDK ignores unrelated messages and invalid numeric counts. Do not add a second raw `window.message` listener for the cart protocol.

## Source map

Use these paths when `showpass-frontend` is locally available:

- exports: `packages/core/src/app-contexts/sdk/features/tickets.ts`
- widget functions: `packages/core/src/app-contexts/sdk/features/`
- option types: `packages/core/src/app-contexts/sdk/services/Widget/Widget-types.ts`
- iframe lifecycle: `packages/core/src/app-contexts/sdk/services/Widget/Widget.ts`
- URL routing: `packages/core/src/app-contexts/sdk/services/config/`
- SDK entry point: `packages/core/src/app-contexts/sdk/index.ts`
- build: `packages/core/scripts/build-sdk.ts`
- widget pages: `packages/next-app/pages/widget/`

Published documentation lives at `https://dev.showpass.com/sdk/01-sdk-getting-started` through `/sdk/08-basic-integration-example`. The live playground is `https://dev.showpass.com/sdk/widget-playground`.

## Contract drift to check

- The playground labels its event input as an ID, while the public event method and documentation call for an event slug.
- Published option tables and TypeScript types do not agree on every uncommon parameter, including `show_specific_tickets`.
- Examples using explicit `false` must use a rebuilt SDK with the SPW-20291 serialization correction.
