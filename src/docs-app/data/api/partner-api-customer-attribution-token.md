# Partner API: Create checkout attribution

Create a short-lived token that connects a Showpass checkout to a customer in your system.

```http
POST /api/v1/partner/customer-attribution-token/
```

Call this endpoint from your backend immediately before opening the Ticket Purchase Widget. The customer must first be connected with [Sync a customer with Showpass](/api/partner-api-users).

The linked venue customer profile must have a nonblank first name, last name, and email. Phone is optional and does not affect token issuance or Partner checkout. This endpoint requires the external customer ID and `venue_id`; adding profile fields here does not update the customer.

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_external_user_id": "customer-42",
  "venue_id": 456
}
```

## Response

The endpoint returns `201`:

```json
{
  "customer_attribution_token": "opaque-token",
  "token_expires_in_seconds": 3600
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

The token binds the basket and resulting order to the linked Showpass customer. The required `venue_id` selects the Partner's customer mapping. Checkout requires that same payment venue and also checks the Partner integration's current assignments. A token for one venue cannot be used at another venue, even when the Partner has access to both. A browser authenticated as a different Showpass customer cannot use the token for that checkout.

The token does not create a full Showpass login session. Normal checkout and payment requirements still apply. Do not use successful token issuance as proof that checkout will succeed: an expired token, revoked identity, unauthorized organization, or conflicting customer can prevent its use.

## Token lifetime and handling

- It is short-lived checkout context for one Partner customer mapping at one venue.
- It is valid for one hour and can be used by supported checkout flows during that period.
- It does not authenticate the customer or create a logged-in Showpass session.
- It establishes the linked customer for the basket; any additional buyer information is collected by Showpass checkout.
- It is not a Partner API credential, bearer token, or refresh token.

The raw value is returned when issued, either by customer registration or this endpoint; Showpass stores its SHA-256 hash. Do not persist it as a long-lived customer credential or include it in logs.

## Errors

- `400 Bad Request`: `partner_external_user_id` or `venue_id` is missing or invalid.
- `403 Forbidden`: authentication failed, Partner APIs are disabled, or checkout attribution is disabled.
- `409 Conflict`: the Partner customer does not exist at the requested venue, is inactive, has an incomplete profile, or the venue is outside the Partner integration's current scope.
- `429 Too Many Requests`: the client IP has exceeded the shared Partner API limit.

For example, requesting a token for a customer with an incomplete profile returns `409`:

```json
{
  "detail": "Partner customer attribution requires a first name, last name, and email.",
  "error_code": "partner_customer_attribution_profile_incomplete"
}
```

This endpoint can return these string error codes:

| Status | `error_code` | Meaning |
| --- | --- | --- |
| `403` | `partner_customer_attribution_disabled` | Customer attribution is not enabled for the request. |
| `409` | `partner_customer_attribution_venue_scope` | The mapped venue is no longer within the Partner integration's authorized scope. |
| `409` | `partner_customer_attribution_identity_not_found` | The Partner customer has not been linked at the requested venue. |
| `409` | `partner_customer_attribution_identity_inactive` | The linked identity is inactive. |
| `409` | `partner_customer_attribution_profile_incomplete` | The linked profile is missing a required name or email. Repeat POST customer registration with the same email, external ID, and venue to update the names; it does not change the linked email. |
| `409` | `partner_customer_attribution_partner_inactive` | The Partner integration became inactive before issuance completed. |
| `409` | `partner_customer_attribution_token_invalid` | The identity context could not be resolved safely. |

Authentication failures and globally disabled Partner APIs can return `403` with only `detail`. Checkout validation is a separate operation and can reject a previously issued token. See [Errors and retries](/api/partner-api-overview#errors-and-retries) for common response shapes and retry guidance.
