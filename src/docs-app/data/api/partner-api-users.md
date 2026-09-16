# Sync a customer with Showpass

Connect a customer record in your application to Showpass. Do this when the customer registers or before their first attributed checkout.

```http
POST /api/v1/partner/users/
```

This is an idempotent server-to-server operation for a `partner_external_user_id` that already exists: Showpass reuses the existing customer link instead of creating another one.

The profile fields are used when Showpass creates or safely links the customer. Repeating the request for an existing `partner_external_user_id` updates only the supplied partner-owned profile fields (`first_name`, `last_name`, and `phone`) and leaves omitted fields unchanged. `email` is used for safe linking and is not updated by this request.

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Choose the customer ID

`partner_external_user_id` is the durable connection between your customer and their Showpass activity. Use an immutable database ID from your system. Do not use an email address or another value that can change.

The same ID is returned in attributed webhooks and is required when creating a fresh checkout token or manage-order link.

## Request body

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

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `partner_external_user_id` | string | Yes | Stable customer ID from your system, up to 255 characters. It is trimmed and lowercased. |
| `email` | string | Yes | Customer email address, up to 128 characters. |
| `is_email_verified` | boolean | Yes | Whether the partner has verified the customer's email address. |
| `first_name` | string | No | First name, up to 32 characters. An empty string clears it; null is not accepted. |
| `last_name` | string or null | No | Last name, up to 32 characters. An empty string or null clears it. |
| `phone` | string or null | No | Phone number, up to 32 characters before normalization. Blank or null clears it. |
| `venue_id` | integer, minimum 1 | Yes | Showpass organization authorized for this Partner integration. Cannot be null and is required even when reusing an existing customer link. |

Omit profile fields that you do not want to change. Phone numbers are normalized; changing or clearing a phone number resets its Showpass phone verification. Formatting an equivalent number differently does not reset verification.

## Email verification and linking

For a new `partner_external_user_id`:

- If no Showpass customer uses the email, Showpass can create a customer whether `is_email_verified` is `true` or `false`.
- If the email already belongs to a Showpass customer, `true` permits linking to that customer; `false` returns `409`.

For an already linked ID, Showpass reuses the established identity and updates only supplied profile fields. A different email does not relink the ID or update the customer's email. All required fields must still be supplied.

Send a JSON boolean for `is_email_verified`. Missing or invalid values return `400`. Sending only the retired `email_verified` field leaves `is_email_verified` missing and returns `400`; there is no alias. Likewise, `partner_user_id` does not substitute for `partner_external_user_id`.

## Response

The endpoint returns `201` when it creates a customer link and `200` when it reuses one:

```json
{
  "partner_identity_id": 123,
  "partner_external_user_id": "customer-42",
  "status": "active",
  "link_reason": "created_user",
  "venue_id": 456,
  "customer_attribution_token": "opaque-token",
  "customer_attribution_token_expires_in_seconds": 3600
}
```

The token fields are included only when checkout attribution is enabled for the request, including its `venue_id`. You can use that token immediately or [request a fresh token before checkout](/api/partner-api-customer-attribution-token).

`link_reason` explains how Showpass resolved the customer:

- `created_user`: Showpass created a customer and partner link.
- `reused_existing`: this `partner_external_user_id` was already linked.
- `email_auto_linked`: the verified email was safely linked to an existing Showpass customer.

Showpass rejects the request instead of silently linking customers when the email, identity status, or organization scope is unsafe or ambiguous. Email and identity conflicts return `409`; denied organization scope returns `403`.

## Errors

- `400 Bad Request`: a field is missing or invalid.
- `403 Forbidden`: authentication failed, Partner APIs are disabled, or `venue_id` is outside the integration's organization scope.
- `409 Conflict`: the email conflicts with existing data, the partner customer is inactive, or `venue_id` does not identify an existing Showpass organization.
- `429 Too Many Requests`: the client IP has exceeded the shared Partner API limit.

For example, attempting to link a new Partner customer ID to an existing email with `is_email_verified: false` returns `409`:

```json
{
  "detail": "A Showpass user already exists for this email."
}
```

See [Errors and retries](/api/partner-api-overview#errors-and-retries) for validation response examples and retry guidance. Inactive identities and conflicting data require resolution before retrying.
