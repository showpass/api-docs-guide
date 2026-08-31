# Build a partner ticketing flow

This guide connects the Showpass event catalog, purchase widget, Partner API, and webhooks into one customer journey.

## Before you begin

You need:

- Partner API credentials provided by Showpass.
- The Showpass organization ID whose events you want to display.
- The Showpass JavaScript SDK installed in your frontend.
- A public HTTPS endpoint that can receive Showpass webhooks.

All `/api/partner/` requests belong in your backend. Event discovery and the purchase widget use their existing public integration paths.

## 1. Connect your customer to Showpass

When a customer registers—or before their first Showpass checkout—send their stable ID and verified identity information to Showpass:

```http
POST /api/partner/users/
```

```json
{
  "partner_user_id": "customer-42",
  "email": "buyer@example.com",
  "email_verified": true,
  "first_name": "Taylor",
  "last_name": "Buyer"
}
```

Use an immutable ID from your database for `partner_user_id`, not an email address. You will use the same ID to request checkout tokens and manage-order links. See [Sync a customer with Showpass](/api/partner-api-users).

## 2. Display the organization’s events

Query the Discovery API from your backend and render the results in your application:

```http
GET https://www.showpass.com/api/public/discovery/?venue=ORGANIZATION_ID
```

Keep the `slug` returned for each event. The purchase widget uses it to identify what the customer is buying.

For upcoming-only results, multiple organizations, recurring instances, pagination, and filters, see [List events by organization](/api/public-api-event-list-by-organization).

## 3. Create fresh checkout attribution

Immediately before opening checkout, ask your backend for a fresh token:

```http
POST /api/partner/customer-attribution-token/
```

```json
{
  "partner_user_id": "customer-42"
}
```

Return the `customer_attribution_token` to the frontend that is about to launch the widget. The token expires after one hour and should not be cached as a long-lived customer credential.

## 4. Open Showpass checkout

Pass the selected event `slug` and attribution token in the widget parameters:

```javascript
showpass.tickets.eventPurchaseWidget(selectedEvent.slug, {
  "customer_attribution_token": customerAttributionToken
});
```

To embed checkout in a page instead of opening a modal, pass a container ID as the third argument. See the [Ticket Purchase Widget](/sdk/ticket-purchase-widget) for both modes.

Showpass validates the token server-side and records the partner customer on the checkout basket and resulting order. The customer still enters their buyer details through normal Showpass checkout.

The widget does not need or accept the Partner API secret, `partner_user_id`, a Showpass bearer token, or a checkout handoff code.

## 5. Reconcile order activity

Subscribe to the invoice events your application needs. When an order has one clear Partner attribution, Showpass includes your stable customer ID:

```json
{
  "event_type": "invoice.purchase",
  "data": {
    "partner_slug": "your-partner",
    "partner_user_id": "customer-42"
  }
}
```

Use `partner_user_id` to locate the customer and the webhook’s Showpass transaction identifier to update the correct order. Always verify `X-SHOWPASS-SIGNATURE` before processing a delivery. See [Match orders to your customers](/api/partner-api-webhooks).

## 6. Let the customer manage an order

When the customer selects **Manage order**, your backend requests a one-time link using the customer and transaction IDs:

```http
POST /api/partner/orders/manage-link/
```

```json
{
  "partner_user_id": "customer-42",
  "transaction_id": "showpass-transaction-id"
}
```

Navigate the browser to the returned `manage_url` as a top-level page. Do not embed it in an iframe. Showpass verifies ownership, consumes the link, and opens the standard order page with access limited to that order.

## Integration boundary

| Keep on your backend | Safe in the browser |
| --- | --- |
| Partner Key ID and Secret | Public event data |
| HMAC signing | Selected event slug |
| Customer sync and token issuance | Short-lived `customer_attribution_token` passed directly to checkout |
| Manage-order link request | Returned `manage_url` used for top-level navigation |
| Webhook signature verification | Showpass JavaScript SDK |

Do not log Partner secrets, raw attribution tokens, one-time manage-order URLs, or unnecessary customer data.
