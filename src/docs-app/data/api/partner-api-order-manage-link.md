# Create an order-management link

Create a short-lived order-management handoff link for an attributed order.

```http
POST /api/partner/orders/manage-link/
```

The request must be authenticated with the Partner API HMAC scheme described in
the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_user_id": "customer-42",
  "transaction_id": "transaction-id"
}
```

The transaction must belong to the partner user and satisfy the partner’s venue
scope. The endpoint returns `201`:

```json
{
  "manage_url": "https://www.showpass.com/account/partner-login/opaque-code/",
  "expires_in_seconds": 120
}
```

The link expires after 120 seconds. It can be used once. The code is stored as
a hash and cannot be reused after it is consumed or expires.

The request returns `403` when the order is outside the partner’s venue scope,
and `409` when the partner user or order cannot be found or the partner user is
inactive. Validation errors return `400` and authentication failures return
`403`.
