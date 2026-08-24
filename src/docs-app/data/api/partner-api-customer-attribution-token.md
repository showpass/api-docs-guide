# Create a customer attribution token

Issue a short-lived customer attribution token for an existing partner user.

```http
POST /api/partner/customer-attribution-token/
```

The request must be authenticated with the Partner API HMAC scheme described in
the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_user_id": "customer-42"
}
```

The identity must already exist for the authenticated partner. The endpoint
returns `201`:

```json
{
  "customer_attribution_token": "opaque-token",
  "customer_attribution_token_expires_in_seconds": 3600
}
```

The token is valid for one hour. Pass it as `customer_attribution_token` when
creating a supported Showpass checkout basket. This lets Showpass associate the
resulting order with the partner customer.

The raw token is returned only in this response. Showpass stores a hash of the
token, so treat the raw value as a secret and do not log it.

The request returns `403` when customer attribution is not available for the
partner or venue. It returns `409` when the partner user does not exist or is
inactive. Validation errors return `400` and authentication failures return
`403`.
