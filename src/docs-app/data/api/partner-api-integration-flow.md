# Build a partner ticketing flow

This guide connects the Showpass event catalog, purchase widget, Partner API, and webhooks into one customer journey.

## Before you begin

You need:

- One complete Partner credential provided by Showpass, in the form `sp_partner_<credential_uuid>.<random_secret>`.
- The Showpass organization ID whose events you want to display.
- The Showpass JavaScript SDK installed in your frontend.
- A public HTTPS endpoint that can receive Showpass webhooks.

All `/api/v1/partner/` requests belong in your backend. Event discovery and the purchase widget use their existing public integration paths. See the [current API contract and prelaunch status](/api/partner-api-overview#api-status-and-versioning).

The interactive API Explorer is for local, Beta, or Demo testing only. It holds credentials in memory for the current page and blocks authenticated requests to Showpass production; production Partner API calls must be signed and sent from your server.

## 1. Connect your customer to Showpass

When a customer registers or before their first Showpass checkout, send their stable ID, email verification status, and an authorized organization ID to Showpass:

```http
POST /api/v1/partner/users/
```

```json
{
  "partner_external_user_id": "customer-42",
  "email": "buyer@example.com",
  "is_email_verified": true,
  "first_name": "Taylor",
  "last_name": "Buyer",
  "venue_id": 456
}
```

Use an immutable ID from your database for `partner_external_user_id`, not an email address. You will use the same ID to request checkout tokens and manage-order links. See [Sync a customer with Showpass](/api/partner-api-users).

Set `is_email_verified` to `true` only if your application has verified the email. `venue_id` is required on every customer sync request and must match an explicit organization assignment, including any enabled descendant access. Derive the customer ID from the authenticated customer in your backend rather than trusting an arbitrary ID sent by the browser.

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
POST /api/v1/partner/customer-attribution-token/
```

```json
{
  "partner_external_user_id": "customer-42"
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

Showpass validates the token server-side and binds the checkout basket and resulting order to the linked Showpass customer. The basket's payment organization must be authorized, and a browser authenticated as another Showpass customer is rejected. The token does not create a full login session; Showpass still handles additional buyer information and payment requirements.

The widget does not need or accept the Partner API secret, `partner_external_user_id`, a Showpass bearer token, or a checkout handoff code.

## 5. Reconcile order activity

Subscribe to the invoice events your application needs. When enrichment is enabled and an event has one eligible Partner attribution, Showpass can include your stable customer ID. This abbreviated purchase payload shows the correlation fields:

```json
{
  "id": "d9-1234-4abc-8def-123456789abc",
  "event_type": "invoice.purchase",
  "webhook_event_uuid": "09117c09-e1f8-4913-b2f5-52cc161cf5f7",
  "data": {
    "transaction_id": "d9-1234-4abc-8def-123456789abc",
    "partner_slug": "your-partner",
    "partner_external_user_id": "customer-42"
  }
}
```

Always verify `X-SHOWPASS-SIGNATURE` before processing a delivery. Check `data.partner_slug`, use `data.partner_external_user_id` to locate the attributed customer, correlate the event's transaction with `data.transaction_id`, and deduplicate with `webhook_event_uuid`.

Transfer events retain the original sale's Partner attribution, not necessarily the recipient's identity. Missing Partner fields mean attribution is unavailable in that delivery; preserve any association you already established. See [Match orders to your customers](/api/partner-api-webhooks).

## 6. Let the customer manage an order

When the customer selects **Manage order**, your backend requests a one-time link using the customer and transaction IDs:

```http
POST /api/v1/partner/orders/manage-link/
```

```json
{
  "partner_external_user_id": "customer-42",
  "transaction_id": "d9-1234-4abc-8def-123456789abc"
}
```

Navigate the browser to the returned `manage_url` as a top-level page. Do not embed it in an iframe. Showpass verifies ownership, consumes the link, and opens the standard order page with access limited to that order.

Replace the example transaction ID with `data.transaction_id` from the customer's purchase webhook. The link expires 120 seconds after issuance; consuming it starts a separate 120-second order-access session. Request a fresh link when access is needed again. Failed handoffs go to the expired-link page. See [Send a customer to their order](/api/partner-api-order-manage-link#access-lifetime-and-recovery).

## Integration boundary

| Keep on your backend | Safe in the browser |
| --- | --- |
| Complete Partner credential | Public event data |
| HMAC signing | Selected event slug |
| Customer sync and token issuance | Short-lived `customer_attribution_token` passed directly to checkout |
| Manage-order link request | Returned `manage_url` used for top-level navigation |
| Webhook signature verification | Showpass JavaScript SDK |

Do not log Partner secrets, raw attribution tokens, one-time manage-order URLs, or unnecessary customer data.
