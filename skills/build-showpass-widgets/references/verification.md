# Verification and debugging

## Static checks

Run the bundled audit first:

```bash
node "$SKILL_DIR/scripts/audit-widget-integration.mjs" <target-path>
node "$SKILL_DIR/scripts/audit-widget-integration.mjs" --strict --json <target-path>
```

Then run the target repository's formatter, lint, typecheck, focused tests, and production build. A development server alone does not exercise SSR boundaries or production CSP.

For implementation work, point the auditor at the changed integration directory or files first. Scan the entire repository only for an explicit repository-wide review; generated examples, vendored code, and unrelated fixtures can otherwise create distracting heuristic findings.

The dependency-free auditor is intentionally heuristic. Its method-call checks inspect script and module code, not executable inline HTML or framework template-attribute strings; review those manually. Treat ambiguous warnings as review prompts, then rely on the target's parser, typechecker, tests, and browser checks for final proof.

## Confirm the live SDK

When network access is allowed, confirm the stable endpoint and expected exports:

```bash
curl -fsSIL "https://www.showpass.com/static/dist/sdk.js"
curl -fsSL "https://www.showpass.com/static/dist/sdk.js" \
  | rg -o "eventPurchaseWidget|productPurchaseWidget|membershipPurchaseWidget|calendarWidget|checkoutWidget|addCartCountListener" \
  | sort -u
```

Do not hardcode the redirect target reported by `curl`; Showpass may change CDN hosts.

## Browser matrix

### Loader

- The SDK request succeeds once per page.
- `window.showpass.tickets` exists after load.
- A blocked script produces visible fallback UI and a useful logged error.
- Client-side navigation does not inject duplicate script elements.

### Modal

- A real button opens the intended widget once.
- Closing removes the overlay and restores page scrolling and position.
- Keyboard focus styles remain visible.
- Opening the same trigger repeatedly does not stack overlays.

### Embedded

- The target container exists before the call.
- Exactly one iframe is mounted in the container.
- The iframe has useful height on desktop and mobile.
- Route changes or component unmounts do not leave a visible iframe.
- Calendar → event → checkout transitions remain in the same embedded region.

### Cart and checkout

- Listener cleanup prevents updates after component teardown.
- Checkout opens with existing cart contents.
- UTM attribution survives widget transitions when present.
- Adding/removing an item updates the cart count once when authorized test inventory is available.
- Off-site payment return behavior is tested only with explicit authorization in an appropriate environment.

### Browsers and locales

- Test current Chrome and Safari behavior, including mobile viewport and payment iframe restrictions.
- Test in an incognito/privacy mode if third-party storage restrictions matter to the host site.
- Verify French when `lang: "fr"` is used.

## CSP and network diagnostics

The canonical SDK request redirects to a Showpass-managed CDN and widgets iframe content from `www.showpass.com`. For a strict Content Security Policy:

1. Load the page with browser developer tools open.
2. Inspect the actual redirect chain and CSP violations.
3. Allow only the required Showpass script and frame origins in the site's existing CSP mechanism.
4. Do not replace CSP with broad `*`, `unsafe-inline`, or `unsafe-eval` rules.

Recheck this after CDN changes rather than baking a transient hostname into application code.

## Common failures

| Symptom                             | Likely cause                                      | Check                                    |
| ----------------------------------- | ------------------------------------------------- | ---------------------------------------- |
| `showpass` is undefined             | Call ran before script load or CSP blocked it     | Network, console, shared loader          |
| Container not found error           | Embedded call ran before DOM commit or ID changed | Element ID and effect timing             |
| Modal opens instead of embedding    | Missing/undefined final `containerId`             | Function arguments                       |
| Multiple iframes or listeners       | Effect reruns, duplicate loader, missing cleanup  | Strict Mode and dependencies             |
| Event route fails                   | ID/display name used instead of event slug        | Public API response and URL              |
| Option set to `false` has no effect | Current query serializer omits falsy values       | Generated iframe query string            |
| Cart badge updates after unmount    | Listener cleanup was ignored                      | Return value from `addCartCountListener` |

## Safe testing boundary

Use this verification ladder and stop at the first level that proves the requested behavior:

1. Open and close the intended event, product, membership, or calendar widget.
2. Open checkout with the browser's current cart state; an empty-cart state is still useful integration evidence.
3. Change cart contents only with authorized test inventory in an appropriate environment, then verify one count transition and teardown.
4. Exercise off-site payment return or submit payment only with explicit authorization.

Do not create purchases, change organizer settings, or place production credentials in fixtures unless the user explicitly authorizes those actions.
