# Sync a customer with Showpass

Connect a customer record in your application to Showpass. Do this when the customer registers or before their first attributed checkout.

```http
POST /api/partner/users/
```

This is an idempotent server-to-server operation for a `partner_user_id` that already exists: Showpass reuses the existing customer link instead of creating another one.

The profile fields are used when Showpass creates or safely links the customer. Repeating the request for an existing `partner_user_id` confirms and returns the current link; it does not update that customer’s Showpass profile.

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Choose the customer ID

`partner_user_id` is the durable connection between your customer and their Showpass activity. Use an immutable database ID from your system. Do not use an email address or another value that can change.

The same ID is returned in attributed webhooks and is required when creating a fresh checkout token or manage-order link.

## Request body

```json
{
  "partner_user_id": "customer-42",
  "email": "buyer@example.com",
  "email_verified": true,
  "first_name": "Taylor",
  "last_name": "Buyer",
  "phone": null
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `partner_user_id` | string | Yes | Stable customer ID from your system, up to 255 characters. It is trimmed and lowercased. |
| `email` | string | Yes | Customer email address, up to 128 characters. |
| `email_verified` | boolean | Yes | Whether your application has verified the email. When `true`, Showpass may safely link an existing Showpass customer with the same email. |
| `first_name` | string | No | First name, up to 32 characters. |
| `last_name` | string or null | No | Last name, up to 32 characters. |
| `phone` | string or null | No | Phone number, up to 32 characters. |
| `venue_id` | integer or null | No | Showpass organization scope for this request. It must match the scope configured for the Partner integration. |

## Response

The endpoint returns `201` when it creates a customer link and `200` when it reuses one:

```json
{
  "partner_identity_id": 123,
  "partner_user_id": "customer-42",
  "status": "active",
  "link_reason": "created_user",
  "venue_id": 456,
  "customer_attribution_token": "opaque-token",
  "customer_attribution_token_expires_in_seconds": 3600
}
```

The token fields are included only when checkout attribution is enabled for the integration. You can use that token immediately or [request a fresh token before checkout](/api/partner-api-customer-attribution-token).

`link_reason` explains how Showpass resolved the customer:

- `created_user`: Showpass created a customer and partner link.
- `reused_existing`: this `partner_user_id` was already linked.
- `email_auto_linked`: the verified email was safely linked to an existing Showpass customer.

Showpass returns a conflict instead of silently linking customers when the email, identity status, or organization scope is unsafe or ambiguous.

## Errors

- `400 Bad Request`: a field is missing or invalid.
- `403 Forbidden`: authentication failed, or `venue_id` is outside the integration’s organization scope.
- `409 Conflict`: the email conflicts with existing data, the partner customer is inactive, or `venue_id` does not identify an existing Showpass organization.
