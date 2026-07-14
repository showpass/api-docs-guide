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

The current SDK does not expose the historical `window.__shwps` command queue. Wait for the script `load` event and then check `window.showpass?.tickets`.

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

### Deprecated compatibility methods

| Method                            | Replacement                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------- |
| `mountCalendarWidget(id, params)` | `calendarWidget(id, params, containerId)`                                       |
| `basketWidget(params)`            | `checkoutWidget(params)`                                                        |
| `shoppingCartWidget(params)`      | `checkoutWidget(params)`; this is an alias of `basketWidget`                    |
| `loginWidget(params)`             | No v2 replacement; authentication is handled inside purchase and checkout flows |

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

`mountCalendarWidget` is only a compatibility wrapper around the fixed element ID `showpass-calendar-widget`.

## Query params

The source-level `WidgetQueryParams` currently includes:

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

Despite the legacy `event_id` key, the current attraction route consumes an event **slug** (`pages/widget/calendar/attraction/[eventSlug].tsx`). Pass the organizer-provided attraction slug, not a numeric database ID.

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

Published documentation lives at `https://dev.showpass.com/sdk/01-sdk-getting-started` through `/sdk/08-basic-integration-example`. The live playground is `https://dev.showpass.com/widget-playground`.

## Known documentation drift to check

- Some older React examples use `window.__shwps`; the current SDK entry point only exposes `window.showpass`.
- Some examples poll for readiness; prefer the script `load` event and a shared promise.
- The playground labels its event input as an ID, while the public event method and documentation call for an event slug.
- Published option tables and TypeScript types do not agree on every uncommon parameter, including `show-specific-tickets`.
- Examples using explicit `false` do not account for the current falsy-value serializer behavior.
