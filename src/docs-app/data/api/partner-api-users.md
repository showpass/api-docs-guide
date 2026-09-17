# Partner API: Register and update a customer

Connect a customer in your application to Showpass using signed server-to-server requests. Customer registration requires a valid email, first name, and last name. Phone is optional, matching regular Showpass registration.

## Register or update a customer

```http
POST /api/v1/partner/users/
```

```json
{
  "partner_external_user_id": "customer-42",
  "email": "buyer@example.com",
  "first_name": "Taylor",
  "last_name": "Buyer",
  "venue_id": 456
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `partner_external_user_id` | string | Yes | Stable customer ID within your Partner integration and venue, up to 255 characters. Trimmed and lowercased. |
| `email` | string | Yes | Valid customer email, up to 128 characters. Trusted as verified for Partner account linking. |
| `first_name` | string | Yes | Nonblank first name, up to 32 characters. |
| `last_name` | string | Yes | Nonblank last name, up to 32 characters. |
| `phone` | string or null | No | Up to 32 characters before normalization. Omit to preserve an existing phone; blank or null clears it. |
| `venue_id` | integer | Yes | Positive Showpass organization ID within the Partner's authorized scope. |

No password or `is_email_verified` field is required. Showpass trusts the email asserted by the authenticated Partner for account linking. Partners must establish the customer's identity in their own backend before signing a request. A matching existing email can therefore link to an existing Showpass customer.

The venue owns the customer record. Each Partner has its own external-ID mapping to that venue customer. Different Partners can use different external IDs for the same venue customer, and a customer's mappings at different venues are separate.

POST checks the email and external ID within the authenticated Partner and requested venue:

| Existing mapping | Result |
| --- | --- |
| Email and external ID match the same identity | Update that venue customer's names and supplied phone; return `200`. |
| Email is already linked under a different external ID | Return `409`; the email already has a mapping for this Partner and venue. |
| External ID is already linked to a different email | Return `409`; the ID already belongs to another customer for this Partner and venue. |
| Neither email nor external ID has a mapping | Create the mapping and return `201`. Reuse the existing Showpass account and venue customer when available; otherwise create them. |

Send the same required fields for updates. Omitting `phone` preserves the venue customer's current phone. Sending blank or null clears it. POST does not change the linked email or external ID. Existing shared Showpass account details, phone verification, and other venues stay unchanged. Different authorized Partners linked to the same venue customer update that same venue record.

Use an immutable external ID from your system, not an email address or event ID. `partner_user_id` is not an alias for `partner_external_user_id`.

## Response and checkout attribution

```json
{
  "partner_external_user_id": "customer-42",
  "status": "active",
  "link_reason": "created_user",
  "venue_id": 456
}
```

`link_reason` is `created_user` for a newly created customer, `email_auto_linked` for a new link to an existing email, and `reused_existing` for an existing link or profile update.

When checkout attribution is enabled for the venue, every successful POST, including updates and retries, also returns `customer_attribution_token` and `token_expires_in_seconds`.

Phone is optional for registration, token issuance, and Partner checkout. Successful POST requests return a token when attribution is enabled, including when phone is omitted, blank, or null. The token is valid only for the mapped venue. Use the returned token or [request a fresh attribution token](/api/partner-api-customer-attribution-token). During token issuance, a missing required name or email on a previously linked profile can still return `409` with `partner_customer_attribution_profile_incomplete`.

Checkout keeps its normal purchaser fields and account defaults. Normal account synchronization, customer refresh, and checkout profile enrichment still apply and may later update these details. Partner POST itself only updates the linked venue customer.

## Authentication and errors

Use the [Partner HMAC headers](/api/partner-api-overview). Sign `POST` and the full request path `/api/v1/partner/users/`.

- `400`: required fields are missing, blank, null, or invalid.
- `403`: authentication failed, Partner APIs are disabled, or the venue is outside the Partner scope.
- `409`: the customer identity is inactive, the venue does not exist, or the email or external ID conflicts with an existing identity for this Partner and venue.
- `429`: the shared Partner request limit was exceeded.

A different external ID cannot create a second mapping to the same venue customer within one Partner. Resolve that conflict before retrying. See [Errors and retries](/api/partner-api-overview#errors-and-retries).
