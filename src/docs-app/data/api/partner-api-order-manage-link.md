# Send a customer to their order

Create a short-lived link that opens a customer’s completed order in Showpass. Use it for **View tickets**, **View receipt**, or **Manage order** actions in your application.

```http
POST /api/v1/partner/orders/manage-link/
```

Call this endpoint from your backend only. Showpass verifies that the transaction belongs to the supplied Partner customer and is within the integration’s organization scope.

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_external_user_id": "customer-42",
  "transaction_id": "d9-1234-4abc-8def-123456789abc"
}
```

Use the same `partner_external_user_id` used for checkout attribution. Store `data.transaction_id` from the purchase webhook with your order record. The example transaction ID is illustrative; replace it with the actual Showpass value. It must pass Showpass transaction-ID validation and be at most 30 characters. Do not send the webhook event UUID or your own order ID.

## Response

The endpoint returns `201`:

```json
{
  "manage_url": "https://www.showpass.com/account/partner-login/opaque-code/",
  "expires_in_seconds": 120
}
```

Navigate the customer’s browser to `manage_url` as a top-level page. The link expires after 120 seconds and can be used once, so request it when the customer clicks the action rather than generating it in advance.

## What happens in Showpass

1. Showpass consumes the one-time code.
2. Showpass creates access scoped to the requested order, without creating a full Showpass account session.
3. The customer is redirected to the standard Showpass order page.
4. The final browser URL does not contain the one-time code.

Do not embed `manage_url` in an iframe, store it as a permanent order URL, or send it to another customer.

## Access lifetime and recovery

The unused link expires 120 seconds after issuance. Consuming it creates a separate order-access session that expires 120 seconds after consumption. The link's `expires_in_seconds` describes the unused link, not permanent access to the order.

Invalid, expired, used, or out-of-scope links do not create access. Failed handoffs redirect to `/account/manage-order-link-expired/`. A browser signed into a different Showpass customer account is also rejected; the link does not switch that account.

When the customer needs access again, have your backend request a fresh link after checking that they are authorized to view the order. Reusing a consumed link will not renew access. Correct account or organization-scope problems before requesting another link.

## Errors

- `400 Bad Request`: a customer or transaction ID is missing or invalid.
- `403 Forbidden`: authentication failed, Partner APIs or manage-order handoff are disabled, or the order is outside the Partner integration's organization scope.
- `409 Conflict`: the customer or order cannot be found, the customer is inactive, or the order does not belong to that customer.
- `429 Too Many Requests`: the client IP has exceeded the shared Partner API limit.

For example, an order that cannot be found for the supplied customer returns `409`:

```json
{
  "detail": "Partner request order does not exist."
}
```

See [Errors and retries](/api/partner-api-overview#errors-and-retries). These API errors apply when requesting a link; the browser handoff uses the redirect behavior described above.
