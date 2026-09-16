# Create checkout attribution

Create a short-lived token that connects a Showpass checkout to a customer in your system.

```http
POST /api/v1/partner/customer-attribution-token/
```

Call this endpoint from your backend immediately before opening the Ticket Purchase Widget. The customer must first be connected with [Sync a customer with Showpass](/api/partner-api-users).

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_external_user_id": "customer-42"
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

## Checkout identity and organization scope

The token binds the basket and resulting order to the linked Showpass customer. Checkout checks the basket's payment organization against the Partner integration's current assignments. A browser authenticated as a different Showpass customer cannot use the token for that checkout.

The token does not create a full Showpass login session. Normal checkout and payment requirements still apply. Do not use successful token issuance as proof that checkout will succeed: an expired token, revoked identity, unauthorized organization, or conflicting customer can prevent its use.

## Token lifetime and handling

- It is short-lived checkout context for one Partner customer.
- It is valid for one hour and can be used by supported checkout flows during that period.
- It does not authenticate the customer or create a logged-in Showpass session.
- It establishes the linked customer for the basket; any additional buyer information is collected by Showpass checkout.
- It is not a Partner API credential, bearer token, or refresh token.

The raw value is returned only in this response; Showpass stores its SHA-256 hash. Do not persist it as a long-lived customer credential or include it in logs.

## Errors

- `400 Bad Request`: `partner_external_user_id` is missing or invalid.
- `403 Forbidden`: authentication failed or checkout attribution is not enabled for this Partner integration.
- `409 Conflict`: the Partner customer does not exist or is inactive.
- `429 Too Many Requests`: the client IP has exceeded the shared Partner API limit.

For example, requesting a token for an unknown Partner customer returns `409`:

```json
{
  "detail": "Partner user identity does not exist.",
  "error_code": "partner_customer_attribution_identity_not_found"
}
```

This endpoint can return these string error codes:

| Status | `error_code` | Meaning |
| --- | --- | --- |
| `403` | `partner_customer_attribution_disabled` | Customer attribution is not enabled for the request. |
| `409` | `partner_customer_attribution_identity_not_found` | The Partner customer has not been linked. |
| `409` | `partner_customer_attribution_identity_inactive` | The linked identity is inactive. |
| `409` | `partner_customer_attribution_partner_inactive` | The Partner integration became inactive before issuance completed. |
| `409` | `partner_customer_attribution_token_invalid` | The identity context could not be resolved safely. |

Authentication failures and globally disabled Partner APIs can return `403` with only `detail`. Checkout validation is a separate operation and can reject a previously issued token. See [Errors and retries](/api/partner-api-overview#errors-and-retries) for common response shapes and retry guidance.
