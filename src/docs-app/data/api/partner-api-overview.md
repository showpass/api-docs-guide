# Partner API overview

The Partner API is for server-to-server integrations between Showpass and a
trusted partner application. It lets a partner:

- Create or reuse a Showpass customer identity.
- Generate a short-lived customer attribution token.
- Create a short-lived order-management link for a customer’s order.
- Receive partner customer information in supported webhook events.

Use this API when your backend needs to connect customers and orders in your
system with Showpass. Keep the partner secret on your server. Do not expose it
in browser code or mobile applications.

The API base URL is:

```text
https://www.showpass.com/api/partner/
```

## Authentication

Partner credentials are provided by Showpass during Partner onboarding. Contact
your CSM to receive your Key ID and Secret. Store the Secret securely on your
server and never commit or expose it in client-side code.

Partner requests use HMAC authentication. Send these headers on every request:

| Header | Description |
| --- | --- |
| `X-Showpass-Partner-Key-Id` | Partner credential key ID. |
| `X-Showpass-Partner-Timestamp` | Unix timestamp in seconds. Requests older than five minutes or too far in the future are rejected. |
| `X-Showpass-Partner-Nonce` | A unique value for this request. A nonce cannot be reused. |
| `X-Showpass-Partner-Signature` | `sha256=` followed by the HMAC-SHA256 digest. |

Calculate the signature with the partner secret over this newline-separated
canonical value:

```text
v1
TIMESTAMP
NONCE
HTTP_METHOD
PATH_AND_QUERY
SHA256_OF_RAW_REQUEST_BODY
```

The value in `X-Showpass-Partner-Signature` is `sha256=` followed by the
lowercase hexadecimal HMAC-SHA256 digest. Sign the exact path and query string
sent to Showpass. For an empty request body, hash the empty byte string.

For example, this Python code creates the signature for a `POST` request. The
`body` value must be exactly the same bytes sent in the request:

```python
import hashlib
import hmac
import time
import uuid

partner_secret = "your-partner-secret"
body = '{"partner_user_id":"customer-42"}'
timestamp = str(int(time.time()))
nonce = str(uuid.uuid4())
path_and_query = "/api/partner/customer-attribution-token/"
body_hash = hashlib.sha256(body.encode()).hexdigest()

canonical = "\n".join([
    "v1",
    timestamp,
    nonce,
    "POST",
    path_and_query,
    body_hash,
])
signature = "sha256=" + hmac.new(
    partner_secret.encode(),
    canonical.encode(),
    hashlib.sha256,
).hexdigest()
```

## Organization and venue scope

The credential identifies the partner integration and may be restricted to one
venue. A request cannot use a different venue from the credential’s venue
restriction. If no venue restriction exists, a supplied `venue_id` must refer
to an existing venue.

Partner user IDs are trimmed, normalized to lowercase, and unique within a
partner. The request is rejected when the credential is invalid or the partner
integration is inactive.

Missing or invalid authentication headers and signatures return `403`. Send
all four headers on every request, and generate a new timestamp, nonce, and
signature for each request.

## Endpoint catalog

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | [`/api/partner/users/`](/api/partner-api-users) | Create or reuse a partner user identity. |
| `POST` | [`/api/partner/customer-attribution-token/`](/api/partner-api-customer-attribution-token) | Issue a short-lived customer attribution token for an existing partner identity. |
| `POST` | [`/api/partner/orders/manage-link/`](/api/partner-api-order-manage-link) | Create a short-lived order-management handoff link for an order. |
