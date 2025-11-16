# Showpass webhooks: Security

Every webhook request from Showpass includes an `X-SHOWPASS-SIGNATURE` header that allows you to verify the request's authenticity. Implementing signature verification is crucial for secure webhook integration.

## How signature verification works

### On Showpass's side

1. **Secret key generation:** When you create a webhook endpoint, Showpass generates a unique Secret Key shared only with you
2. **Signature creation:** Before sending each webhook, Showpass generates an HMAC-SHA1 hash using:
   - The `id` field from the payload (typically the `transaction_id`)
   - Your unique Secret Key
3. **Header inclusion:** The signature is sent in the `X-SHOWPASS-SIGNATURE` header

---

### On your server

When receiving a webhook request:

1. **Extract the payload ID** - Get the `id` field from the JSON body
2. **Retrieve the signature** - Read the `X-SHOWPASS-SIGNATURE` header value
3. **Generate your signature** - Use HMAC-SHA1 with the payload ID and your Secret Key
4. **Compare signatures** - Match your generated signature with the received one
5. **Accept or reject** - Process if matched, discard if mismatched

---

## Verification example (Node.js)

```javascript
const crypto = require('crypto');

function verifyShowpassSignature(payloadId, receivedSignature, secretKey) {
  // Generate signature using HMAC-SHA1
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(payloadId);
  const computedSignature = hmac.digest('hex');
  
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(computedSignature),
    Buffer.from(receivedSignature)
  );
}

// In your webhook endpoint handler
app.post('/webhook/showpass', (req, res) => {
  const payload = req.body;
  const receivedSignature = req.headers['x-showpass-signature'];
  const secretKey = process.env.SHOWPASS_WEBHOOK_SECRET;
  
  if (verifyShowpassSignature(payload.id, receivedSignature, secretKey)) {
    // Signature valid - process the webhook
    processWebhook(payload);
    res.status(200).send('OK');
  } else {
    // Signature invalid - reject the request
    console.error('Invalid webhook signature');
    res.status(401).send('Unauthorized');
  }
});
```

---

## Verification example (Python)

```python
import hmac
import hashlib

def verify_showpass_signature(payload_id, received_signature, secret_key):
    """Verify the webhook signature using HMAC-SHA1"""
    computed_signature = hmac.new(
        secret_key.encode('utf-8'),
        payload_id.encode('utf-8'),
        hashlib.sha1
    ).hexdigest()
    
    # Use constant-time comparison
    return hmac.compare_digest(computed_signature, received_signature)

# In your webhook handler
@app.route('/webhook/showpass', methods=['POST'])
def handle_webhook():
    payload = request.json
    received_signature = request.headers.get('X-SHOWPASS-SIGNATURE')
    secret_key = os.environ['SHOWPASS_WEBHOOK_SECRET']
    
    if verify_showpass_signature(payload['id'], received_signature, secret_key):
        # Valid signature - process webhook
        process_webhook(payload)
        return 'OK', 200
    else:
        # Invalid signature - reject
        app.logger.error('Invalid webhook signature')
        return 'Unauthorized', 401
```

---

## Security best practices

### Secure key storage

- **Never hardcode** secret keys in your source code
- Use **environment variables** or secure secrets management
- Rotate keys periodically if exposed

### Constant-time comparison

Always use constant-time string comparison functions to prevent timing attacks:

- **Node.js:** `crypto.timingSafeEqual()`
- **Python:** `hmac.compare_digest()`
- **PHP:** `hash_equals()`

### Timestamp validation (optional but recommended)

Although not part of Showpass's current implementation, consider tracking webhook timestamps to:

- Reject old webhook requests
- Prevent replay attacks
- Ensure requests are recent

### HTTPS only

- **Always use `https://`** for webhook endpoint URLs
- Ensure SSL/TLS certificates are valid and up-to-date
- This encrypts payload and headers during transit

### Log verification failures

Track and monitor signature verification failures:

```javascript
if (!isValidSignature) {
  logger.warn('Webhook signature verification failed', {
    ip: req.ip,
    timestamp: new Date().toISOString(),
    payloadId: payload.id
  });
  return res.status(401).send('Unauthorized');
}
```

---

## Key rotation

If your Secret Key is compromised:

1. **Generate a new key** in the Showpass dashboard
2. **Update your server** with the new key immediately
3. **Test thoroughly** before removing old key support
4. **Monitor logs** for any issues

> **Warning:** Regenerating a Secret Key invalidates the old one. Update your server configuration before the change takes effect.

---

## Common issues

### Signature mismatch

**Causes:**
- Wrong Secret Key on your server
- Incorrect HMAC algorithm (must be SHA1)
- Using wrong field for hashing (must be payload `id`)
- Character encoding issues

**Solutions:**
- Verify Secret Key matches Showpass dashboard
- Confirm HMAC-SHA1 implementation
- Check you're hashing the `id` field only
- Ensure UTF-8 encoding

### Missing signature header

**Causes:**
- Proxy or CDN stripping headers
- Testing with tools that don't include custom headers

**Solutions:**
- Check proxy/CDN configuration
- Use test webhook feature from Showpass dashboard
- Verify headers aren't being filtered

By implementing proper signature verification, you ensure that only legitimate Showpass webhooks are processed by your application.
