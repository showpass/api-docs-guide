# Create or reuse a partner user

Create or reuse a partner user identity for the authenticated partner.

```http
POST /api/partner/users/
```

The request must be authenticated with the Partner API HMAC scheme described in
the [Partner API overview](/api/partner-api-overview). The examples in the
API reference panel sign the exact raw request body sent to Showpass.

## Request body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `partner_user_id` | string | Yes | Stable partner-side user ID, up to 255 characters. It is trimmed and lowercased. |
| `email` | string | Yes | Partner user email address, up to 128 characters. |
| `email_verified` | boolean | Yes | Whether the partner has verified the email. If `true`, Showpass may link the request to an existing Showpass user with the same email. |
| `first_name` | string | No | First name, up to 32 characters. |
| `last_name` | string or null | No | Last name, up to 32 characters. |
| `phone` | string or null | No | Phone number, up to 32 characters. |
| `venue_id` | integer or null | No | Venue for this request. It must match the partner’s allowed venue when one is configured. |

## Responses

The endpoint returns `201` when it creates a new identity and `200` when it
reuses an existing identity.

```json
{
  "partner_identity_id": 123,
  "partner_user_id": "customer-42",
  "status": "active",
  "link_reason": "created_user",
  "venue_id": 456
}
```

For supported venues, the response can also include
`customer_attribution_token` and
`customer_attribution_token_expires_in_seconds`.

The `link_reason` value is one of:

- `created_user`: a new Showpass user was created.
- `reused_existing`: the partner identity already existed.
- `email_auto_linked`: the request was linked to an existing Showpass user after the partner confirmed the email.

Business conflicts such as an inactive identity, an email conflict, an invalid
venue, or a venue outside the partner scope return `409` or `403` according to
the failure boundary.

Validation errors return `400`. Authentication failures return `403`.
