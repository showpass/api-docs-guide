import { ApiExampleSet } from "@/docs-app/data/types.ts";

const signingNote = `
The request body must be hashed exactly as sent. Set PARTNER_KEY_ID and
PARTNER_SECRET in your environment before running the example.`;

export const partnerHmacExamples = (
  path: string,
  body: string,
): ApiExampleSet => {
  const escapedBody = body.replace(/'/g, "'\\''");

  return {
    curl: `PARTNER_KEY_ID="your-key-id"
PARTNER_SECRET="your-partner-secret"
TIMESTAMP=$(date +%s)
NONCE=$(uuidgen | tr '[:upper:]' '[:lower:]')
BODY='${escapedBody}'
BODY_HASH=$(printf '%s' "$BODY" | shasum -a 256 | awk '{print $1}')
CANONICAL=$(printf 'v1\\n%s\\n%s\\nPOST\\n${path}\\n%s' "$TIMESTAMP" "$NONCE" "$BODY_HASH")
SIGNATURE="sha256=$(printf '%s' "$CANONICAL" | openssl dgst -sha256 -hmac "$PARTNER_SECRET" -hex | sed 's/^.* //')"

curl -X POST "https://www.showpass.com${path}" \\
  -H "Content-Type: application/json" \\
  -H "X-Showpass-Partner-Key-Id: $PARTNER_KEY_ID" \\
  -H "X-Showpass-Partner-Timestamp: $TIMESTAMP" \\
  -H "X-Showpass-Partner-Nonce: $NONCE" \\
  -H "X-Showpass-Partner-Signature: $SIGNATURE" \\
  --data "$BODY"`,
    python: `import hashlib
import hmac
import os
import time
import uuid

import requests

body = '${body}'
timestamp = str(int(time.time()))
nonce = str(uuid.uuid4())
canonical = "\\n".join([
    "v1", timestamp, nonce, "POST", "${path}",
    hashlib.sha256(body.encode()).hexdigest(),
])
signature = hmac.new(
    os.environ["PARTNER_SECRET"].encode(),
    canonical.encode(),
    hashlib.sha256,
).hexdigest()

response = requests.post(
    "https://www.showpass.com${path}",
    headers={
        "Content-Type": "application/json",
        "X-Showpass-Partner-Key-Id": os.environ["PARTNER_KEY_ID"],
        "X-Showpass-Partner-Timestamp": timestamp,
        "X-Showpass-Partner-Nonce": nonce,
        "X-Showpass-Partner-Signature": "sha256=" + signature,
    },
    data=body,
)
print(response.status_code, response.json())`,
    node: `const crypto = require('crypto');
const axios = require('axios');

const body = '${body}';
const timestamp = Math.floor(Date.now() / 1000).toString();
const nonce = crypto.randomUUID();
const path = '${path}';
const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
const canonical = ['v1', timestamp, nonce, 'POST', path, bodyHash].join('\\n');
const signature = crypto.createHmac('sha256', process.env.PARTNER_SECRET)
  .update(canonical).digest('hex');

axios.post('https://www.showpass.com' + path, body, {
  headers: {
    'Content-Type': 'application/json',
    'X-Showpass-Partner-Key-Id': process.env.PARTNER_KEY_ID,
    'X-Showpass-Partner-Timestamp': timestamp,
    'X-Showpass-Partner-Nonce': nonce,
    'X-Showpass-Partner-Signature': 'sha256=' + signature,
  },
}).then(({ data }) => console.log(data));`,
  };
};

export const partnerHmacSigningNote = signingNote;
