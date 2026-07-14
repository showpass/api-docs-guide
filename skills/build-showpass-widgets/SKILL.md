---
name: build-showpass-widgets
description: Build, review, or debug current Showpass JavaScript SDK and widget integrations in HTML, React, Next.js, and other browser applications. Use when Codex needs to load the Showpass SDK; launch or embed event, product, membership, calendar, checkout, express-checkout, or cart widgets; add cart-count listeners; connect Discovery API event data to purchase widgets; diagnose iframe/widget behavior; or audit Showpass widget code.
---

# Build Showpass Widgets

Implement Showpass purchase experiences from the current browser SDK contract. Prefer one shared loader and small framework-native adapters over copied iframe URLs or a custom widget framework.

## Workflow

### 1. Inspect the target

- Read the target repository's `AGENTS.md` and local conventions first.
- Identify the framework, client/server boundary, existing script loader, global `Window` declarations, test stack, CSP, and any current Showpass code.
- Search for `showpass`, `sdk.js`, current widget method names, and hardcoded `/widget/` iframe URLs.
- Preserve unrelated changes and existing application architecture.

### 2. Establish the contract

Read [references/sdk-contract.md](references/sdk-contract.md) for every task. If the current `showpass/showpass-frontend` source is available, compare its `packages/core/src/app-contexts/sdk/` subtree with the reference before changing behavior.

Use this evidence order when sources disagree:

1. Current SDK source and focused tests
2. The live bundle served by the canonical SDK URL
3. Published developer documentation
4. Existing playground or application wrappers

Do not silently combine conflicting examples. State any unresolved discrepancy in the handoff.

### 3. Choose the integration

| Need                         | Method                     | Required identifier   |
| ---------------------------- | -------------------------- | --------------------- |
| Event tickets                | `eventPurchaseWidget`      | Event slug            |
| Product purchase             | `productPurchaseWidget`    | Product identifier    |
| Membership purchase          | `membershipPurchaseWidget` | Membership identifier |
| Venue or attraction calendar | `calendarWidget`           | Venue ID or slug      |
| Checkout                     | `checkoutWidget`           | Existing cart state   |
| Express checkout             | `expressCheckoutWidget`    | Product-flow params   |
| Cart badge                   | `addCartCountListener`     | Callback              |

- Omit `containerId` for a modal.
- Pass a real, already-rendered element ID as the final argument for an embedded widget.

### 4. Load the SDK once

Use the stable URL:

```text
https://www.showpass.com/static/dist/sdk.js
```

- In plain HTML, use `defer` and call the SDK after it loads.
- In React or Next.js, copy [assets/showpass-sdk.ts](assets/showpass-sdk.ts) into the application's shared client infrastructure and import its module-level loader from widget adapters. Trim only unused public method types.
- Check `window.showpass?.tickets` after the script load event.
- Do not poll with `setInterval` or inject the script from multiple components.
- Keep secrets out of widget params. Widget IDs, slugs, theme values, and tracking identifiers are browser-visible.

Read [references/integration-patterns.md](references/integration-patterns.md) before writing framework code.

When event cards come from `https://www.showpass.com/api/public/discovery/`, also read [references/public-api-to-widget.md](references/public-api-to-widget.md). Use the API for presentation data and the SDK for purchase behavior.

### 5. Respect lifecycle and navigation

- Treat widget factory methods as asynchronous and await their returned widget handle when lifecycle control is needed.
- Prevent concurrent modal factory calls and duplicate embedded mounts.
- Remember that a modal factory promise resolves when the first widget is shown, not when the full purchase flow closes.
- Mount only after the target container exists.
- Keep embedded identifiers and option objects stable across renders.
- Capture and invoke the cleanup function returned by `addCartCountListener`.
- Let the SDK preserve embedded container context while moving from calendar or product selection into checkout.
- Do not reproduce the SDK's iframe routes, payment redirect handling, or `postMessage` protocol in application code.

### 6. Verify

Resolve `SKILL_DIR` to the directory containing this `SKILL.md`, then run:

```bash
node "$SKILL_DIR/scripts/audit-widget-integration.mjs" <target-path>
```

Use `--json` for machine-readable output and `--strict` to fail on warnings. For implementation work, audit the changed integration directory first; scan a whole repository only when the task calls for a repository-wide review. Fix relevant findings, then run the target repository's formatter, lint, typecheck, tests, and production build.

When maintaining this skill on Node 22 or newer, run its dependency-free regression suite:

```bash
node --experimental-strip-types --test \
  "$SKILL_DIR/scripts/audit-widget-integration.test.mjs" \
  "$SKILL_DIR/scripts/showpass-sdk-loader.test.mjs"
```

For browser verification and debugging, follow [references/verification.md](references/verification.md). At minimum verify one open/close flow, the cart entry point, mobile layout, no duplicate SDK requests, and no console errors. Change cart contents only with authorized test inventory.

## Guardrails

- Use `{}` when a widget has no options; several current TypeScript methods require a params object.
- Do not invent options or assume an option applies to every widget.
- Do not assume a `false` option reaches the iframe; the current serializer omits falsy values. Verify any behavior that depends on explicit `false`.
- Require HTTPS and account for the SDK redirect/CDN in strict CSP configurations.
- Do not perform a real purchase, mutate organizer data, or use production credentials unless the user explicitly authorizes it.
- Keep the integration accessible: use a real button for modal triggers, retain focus styles, provide visible loading/error feedback, and label embedded regions.

## Handoff

Report:

- widget and display mode implemented;
- identifier and options expected from the caller;
- files changed;
- static and browser checks run;
- any contract drift, CSP requirement, or unverified checkout/payment behavior.
