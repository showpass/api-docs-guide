# Showpass webhooks: Security

When Showpass sends a webhook to your configured endpoint URL, it includes a special HTTP header in the request: `X-SHOWPASS-SIGNATURE`. This signature allows you to verify that the webhook request genuinely originated from Showpass and was not tampered with during transmission.

It is crucial to implement signature verification on your server to ensure the security and integrity of your webhook integration.

## How signature verification works

1.  **Secret Key:** When you create a new webhook endpoint in the Showpass dashboard, Showpass generates a unique **Secret Key** (also referred to as a Webhook Token). This key is shared only between Showpass and you. You must store this key securely on your server.

2.  **Signature Generation (Showpass side):**

    - Before sending a webhook, Showpass creates a signature using the **HMAC-SHA1** algorithm.
    - The signature is a hash generated from the `id` field of the webhook payload (which is typically the `transaction_id` for invoice-related events) and your unique Secret Key.
    - The formula looks something like this: `HMAC-SHA1(payload_id, your_secret_key)`

3.  **Sending the Webhook:** Showpass sends the HTTP POST request to your endpoint. The request includes:

    - The JSON payload in the request body.
    - The `X-SHOWPASS-SIGNATURE` header containing the generated signature.

4.  **Signature Verification (Your server side):**
    - When your endpoint receives a webhook request:
      a. Extract the `id` from the JSON payload in the request body.
      b. Retrieve the `X-SHOWPASS-SIGNATURE` header value.
      c. Using the same HMAC-SHA1 algorithm, generate your own signature using the extracted `id` from the payload and your securely stored Secret Key for that endpoint.
      d. **Compare** the signature you generated with the signature received in the `X-SHOWPASS-SIGNATURE` header.
      e. If the signatures match, the request is authentic and can be trusted.
      f. If the signatures do not match, the request may be fraudulent or corrupted, and you should discard it.

## Example header format

The `X-SHOWPASS-SIGNATURE` header will look like this:

```
X-SHOWPASS-SIGNATURE: "HMAC-SHA1_HASH_VALUE"
```

(Note: The exact formatting, including the presence of quotes or the `HMAC-SHA1` prefix within the header value itself, should be confirmed by inspecting a live webhook request or Showpass's specific implementation details if available. The core idea is that the hash value is provided.)

The sample request in the "Invoice Object" documentation provides this example for the header:
`Header: 'X-SHOWPASS-SIGNATURE: "HMAC-SHA1(id, $YOUR_WEBHOOK_TOKEN)"'`
This suggests the value might be a string literally representing the function call, but typically, it would be the _result_ of that function (the hash). You should verify this by inspecting a test webhook. Most systems send the computed hash.

Assuming the header contains the computed hash:

## Implementation best practices

- **Secure Storage of Secret Keys:** Treat your Secret Keys like passwords. Store them securely on your server (e.g., as environment variables or in a secure secrets management system). Do not embed them directly in your application code if it's publicly accessible or version-controlled.
- **Use Constant-Time Comparison:** When comparing the generated signature with the received signature, use a constant-time string comparison function if available in your programming language. This helps mitigate timing attacks.
- **Timestamp Verification (Optional but Recommended):** Although not explicitly mentioned as part of the Showpass signature scheme in the provided document, some webhook systems also include a timestamp in the request or as part of the signed payload. You can check this timestamp to prevent replay attacks by ensuring the webhook is recent.
- **Log Verification Failures:** If signature verification fails, log the incident for security monitoring. Do not process the payload.
- **Endpoint Security (HTTPS):** Always use `https://` for your webhook endpoint URLs to ensure the payload and headers are encrypted during transit.

By correctly implementing signature verification, you add a critical layer of security to your Showpass webhook integration. If you regenerate a Secret Key in the Showpass dashboard, remember to update it on your server immediately.
