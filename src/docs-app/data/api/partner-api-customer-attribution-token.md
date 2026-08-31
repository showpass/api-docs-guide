# Create checkout attribution

Create a short-lived token that connects a Showpass checkout to a customer in your system.

```http
POST /api/partner/customer-attribution-token/
```

Call this endpoint from your backend immediately before opening the Ticket Purchase Widget. The customer must first be connected with [Sync a customer with Showpass](/api/partner-api-users).

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_user_id": "customer-42"
}
```

## Response

The endpoint returns `201`:

```json
{
  "customer_attribution_token": "opaque-token",
  "customer_attribution_token_expires_in_seconds": 3600
}
```

Pass the token directly to the purchase widget:

```javascript
showpass.tickets.eventPurchaseWidget(selectedEvent.slug, {
  "customer_attribution_token": customerAttributionToken
});
```

Showpass validates the token when it creates the checkout basket, then carries the resolved Partner customer relationship onto the completed order.

## What the token is—and is not

- It is short-lived checkout context for one Partner customer.
- It is valid for one hour and can be used by supported checkout flows during that period.
- It does not authenticate the customer or create a logged-in Showpass session.
- It does not replace the buyer information collected during checkout.
- It is not a Partner API credential, bearer token, or refresh token.

The raw value is returned only in this response; Showpass stores its SHA-256 hash. Do not persist it as a long-lived customer credential or include it in logs.

## Errors

- `400 Bad Request`: `partner_user_id` is missing or invalid.
- `403 Forbidden`: authentication failed or checkout attribution is not enabled for this Partner integration.
- `409 Conflict`: the Partner customer does not exist or is inactive.
