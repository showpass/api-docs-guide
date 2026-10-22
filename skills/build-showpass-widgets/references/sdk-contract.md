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
| `startNewCheckout`         | `(options?: { signal?: AbortSignal }) => Promise<boolean>` | Requires coordinated SDK and hosted checkout deployment; capability-check older bundles. Opens confirmation, verifies expiry, and returns true on completion or false on cancellation before expiry starts. Failure and abort reject. Remount previews after either boolean result; keep them closed with retry after rejection. Abort cannot undo confirmed server expiry. |

## Modal and embedded modes

Modal mode:

- Omit `containerId`.
- The SDK creates an overlay and iframe, locks page scrolling, and restores scroll when the modal closes.

Embedded mode:

- Render a unique container element before calling the method.
- Pass that element's ID as the final argument.
- The SDK throws when the element does not exist.
- The SDK adds `showpass-widget-embedded-wrapper`, creates an iframe with `allow="payment *"`, and passes `isEmbedded=true` to the widget route.
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
jump-to-event
keep-shopping
prompt-for-quantity
redirect-url
show-specific-tickets
theme-dark
theme-primary
theme-secondary
ticket-type-selection-required
tracking-id
show-description
lang
```

Do not treat this as proof that every parameter is meaningful for every widget. Check the relevant published page and downstream route before using uncommon parameters.

Common consumer-safe options include:

```ts
{
  "theme-primary": "#24727b",
  "theme-secondary": "#1b5359",
  "keep-shopping": true,
  "show-description": true,
  lang: "fr",
  "tracking-id": "partner-campaign",
}
```

### Current falsy-value limitation

The shared query serializer omits falsy values. As a result, `false`, `0`, and empty strings are not sent to the iframe. Do not rely on an option such as `"keep-shopping": false` or `"show-description": false` without verifying the deployed behavior.

### Parameter enrichment

Before opening purchase and checkout widgets, the SDK:

- adds parent-page UTM parameters unless explicitly supplied;
- adds an encoded clean `redirect-url` unless supplied;
- saves enriched options in session storage for off-site payment return handling;
- removes payment-provider return parameters from the visible parent URL after redirect recovery.

Do not duplicate this behavior in an application wrapper.

## Calendar variants

Standard calendar:

```ts
await tickets.calendarWidget(venueId, {
  "theme-primary": "#24727b",
  tags: "featured,comedy",
});
```

Attraction calendar:

```ts
await tickets.calendarWidget(venueId, {
  "theme-primary": "#24727b",
  is_attraction: true,
  event_id: attractionEventSlug,
  "ticket-type-selection-required": true,
  "prompt-for-quantity": true,
});
```

Attraction routing requires both `is_attraction: true` and a non-empty `event_id`. Without both, the SDK uses the standard calendar route.

Although the option is named `event_id`, the current attraction route consumes an event **slug** (`pages/widget/calendar/attraction/[eventSlug].tsx`). Pass the organizer-provided attraction slug, not a numeric database ID.

### Typed calendar options and URL mapping

`calendarWidget` accepts `CalendarWidgetParams`. SDK callers use the camelCase options below; `features/calendar.ts` maps them to snake_case iframe query parameters. Do not pass the URL aliases as the preferred SDK object API.

| SDK option | Type | Outgoing URL parameter | Effect |
| --- | --- | --- | --- |
| `calendarDate` | String | `calendar_date` | Venue-local date in `YYYY-MM-DD` format, such as `"2026-12-14"`. Selects the date before proceeding to time selection. |
| `calendarTimeslot` | String | `calendar_timeslot` | Public timeslot slug on `calendarDate`, such as `"evening-show"`. Requires `calendarDate`; use the actual slug, not a display label or clock time. |
| `calendarSpecialEvent` | String or string array | `calendar_special_event` | Configured stable special-event key, multiple keys, or the single reserved value `"all"` to select every currently filterable special event. |
| `calendarOpenState` | `"calendar"` or `"special-events"` | `calendar_open_state` | Initial discovery view. Falls back to Calendar when no rich Special Events panel exists. |
| `displayPricePatronTypeId` | Number | `display_price_patron_type_id` | Positive venue-local PatronType ID. Affects display pricing only, without filtering availability, dates, or purchasable ticket types. |
| `hidePrice` | Boolean | `hide_price` | Hides calendar price text and the price-range filter when true. Does not change availability or ticket selection. |
| `highlightMultiDayEventsOnStartDateOnly` | Boolean | `highlight_multi_day_events_on_start_date_only` | Highlights a multi-day event only on its venue-local start date when true. |

The option mapping follows `packages/core/src/app-contexts/sdk/services/Widget/Widget-types.ts` and `packages/core/src/app-contexts/sdk/features/calendar.ts`. `calendarOpenState` and the reserved `calendarSpecialEvent: "all"` require the matching frontend and rebuilt SDK release; see the [calendar guide](https://dev.showpass.com/sdk/event-calendar-widget#calendar-targeting-and-display-options) for availability. This source check does not establish that a deployed bundle contains those additions.

Use venue-local `YYYY-MM-DD` dates and actual public timeslot slugs. Special-event keys refer to configured attraction special events, not ordinary event tags or database IDs. A string selects one key; an array selects multiple keys and is transported as repeated `calendar_special_event` query parameters. Omit options to keep defaults. The falsy-value serializer limitation described above still applies; do not assume an explicit false overrides a non-default deployed setting.

Modal display-pricing example:

```ts
await tickets.calendarWidget(venueId, {
  displayPricePatronTypeId: 17,
  hidePrice: true,
});
```

Embedded attraction direct-target example, after the SDK and container are ready:

```ts
await tickets.calendarWidget(venueId, {
  is_attraction: true,
  event_id: attractionEventSlug,
  calendarDate: "2026-12-14",
  calendarTimeslot: "evening-show",
  calendarSpecialEvent: ["opening-night", "holiday-show"],
  displayPricePatronTypeId: 17,
  hidePrice: false,
}, "attraction-calendar");
```

Use `calendarSpecialEvent: "opening-night"` for a single configured key. Use `"all"` on its own to select all currently filterable special events after the corresponding SDK release. `calendarOpenState: "special-events"` opens the rich Special Events panel independently of filter selection; a configured quantity prompt remains first, and calendars without that panel retain the Calendar view.

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
- Published option tables and TypeScript types do not agree on every uncommon parameter, including `show-specific-tickets`.
- Examples using explicit `false` do not account for the current falsy-value serializer behavior.
