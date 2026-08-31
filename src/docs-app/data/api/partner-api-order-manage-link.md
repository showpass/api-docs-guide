# Send a customer to their order

Create a short-lived link that opens a customer’s completed order in Showpass. Use it for **View tickets**, **View receipt**, or **Manage order** actions in your application.

```http
POST /api/partner/orders/manage-link/
```

Call this endpoint from your backend only. Showpass verifies that the transaction belongs to the supplied Partner customer and is within the integration’s organization scope.

Authenticate the request with the HMAC scheme in the [Partner API overview](/api/partner-api-overview).

## Request body

```json
{
  "partner_user_id": "customer-42",
  "transaction_id": "showpass-transaction-id"
}
```

Use the same `partner_user_id` used for checkout attribution. Store the Showpass `transaction_id` from the purchase webhook with your order record.

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
2. Showpass creates access scoped to the requested order—not a full Showpass account session.
3. The customer is redirected to the standard Showpass order page.
4. The final browser URL does not contain the one-time code.

Do not embed `manage_url` in an iframe, store it as a permanent order URL, or send it to another customer.

Invalid, expired, used, or out-of-scope links do not create access. A direct visit with an invalid code returns the customer to the Showpass login flow.

## Errors

- `400 Bad Request`: a customer or transaction ID is missing or invalid.
- `403 Forbidden`: authentication failed or the order is outside the Partner integration’s organization scope.
- `409 Conflict`: the customer or order cannot be found, the customer is inactive, or the order does not belong to that customer.
