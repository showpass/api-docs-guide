import { ApiExampleSet } from "@/docs-app/data/types.ts";

const signingNote = `
The request body must be hashed exactly as sent. Set PARTNER_KEY_ID and PARTNER_SECRET to the
separate values provided by Showpass. The canonical
v1 marker identifies the signing protocol, independently of the API URL version.`;

export const partnerHmacExamples = (
  path: string,
  body: string,
): ApiExampleSet => {
  const escapedBody = body.replace(/'/g, "'\\''");
  const bodyLiteral = JSON.stringify(body);

  return {
    curl: `(
set -eu
: "\${PARTNER_KEY_ID:?Set PARTNER_KEY_ID to your Showpass Partner key ID}"
: "\${PARTNER_SECRET:?Set PARTNER_SECRET to your Showpass Partner secret}"
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
  --data "$BODY"
)`,
    python: `import hashlib
import hmac
import os
import time
import uuid

import requests

partner_key_id = os.environ["PARTNER_KEY_ID"]
partner_secret = os.environ["PARTNER_SECRET"]
if not partner_key_id or not partner_secret:
    raise ValueError("Set both PARTNER_KEY_ID and PARTNER_SECRET")

body = ${bodyLiteral}
timestamp = str(int(time.time()))
nonce = str(uuid.uuid4())
canonical = "\\n".join([
    "v1", timestamp, nonce, "POST", "${path}",
    hashlib.sha256(body.encode()).hexdigest(),
])
signature = hmac.new(
    partner_secret.encode(),
    canonical.encode(),
    hashlib.sha256,
).hexdigest()

response = requests.post(
    "https://www.showpass.com${path}",
    headers={
        "Content-Type": "application/json",
        "X-Showpass-Partner-Key-Id": partner_key_id,
        "X-Showpass-Partner-Timestamp": timestamp,
        "X-Showpass-Partner-Nonce": nonce,
        "X-Showpass-Partner-Signature": "sha256=" + signature,
    },
    data=body,
)
print(response.status_code, response.json())`,
    node: `const crypto = require('crypto');
const axios = require('axios');

const partnerKeyId = process.env.PARTNER_KEY_ID;
const partnerSecret = process.env.PARTNER_SECRET;
if (!partnerKeyId || !partnerSecret) {
  throw new Error('Set both PARTNER_KEY_ID and PARTNER_SECRET');
}

const body = ${bodyLiteral};
const timestamp = Math.floor(Date.now() / 1000).toString();
const nonce = crypto.randomUUID();
const path = '${path}';
const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
const canonical = ['v1', timestamp, nonce, 'POST', path, bodyHash].join('\\n');
const signature = crypto.createHmac('sha256', partnerSecret)
  .update(canonical).digest('hex');

axios.post('https://www.showpass.com' + path, body, {
  headers: {
    'Content-Type': 'application/json',
    'X-Showpass-Partner-Key-Id': partnerKeyId,
    'X-Showpass-Partner-Timestamp': timestamp,
    'X-Showpass-Partner-Nonce': nonce,
    'X-Showpass-Partner-Signature': 'sha256=' + signature,
  },
}).then(({ data }) => console.log(data));`,
  };
};

export const partnerHmacSigningNote = signingNote;
