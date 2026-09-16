import { ApiExampleSet } from "@/docs-app/data/types.ts";

const signingNote = `
The request body must be hashed exactly as sent. Set PARTNER_CREDENTIAL to the
complete credential provided by Showpass. The example splits it internally. The canonical
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
: "\${PARTNER_CREDENTIAL:?Set PARTNER_CREDENTIAL to your complete Showpass credential}"
PARTNER_KEY_ID="\${PARTNER_CREDENTIAL%%.*}"
PARTNER_SECRET="\${PARTNER_CREDENTIAL#*.}"
if [ "$PARTNER_KEY_ID" = "$PARTNER_CREDENTIAL" ] || [ -z "$PARTNER_KEY_ID" ] || [ -z "$PARTNER_SECRET" ]; then
  printf '%s\\n' 'Invalid Partner credential: expected key_id.secret' >&2
  exit 1
fi
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

credential = os.environ["PARTNER_CREDENTIAL"].strip()
partner_key_id, separator, partner_secret = credential.partition(".")
if not separator or not partner_key_id or not partner_secret:
    raise ValueError("Invalid Partner credential: expected key_id.secret")

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

const credential = (process.env.PARTNER_CREDENTIAL || '').trim();
const separatorIndex = credential.indexOf('.');
const partnerKeyId = credential.slice(0, separatorIndex);
const partnerSecret = credential.slice(separatorIndex + 1);
if (separatorIndex < 1 || !partnerSecret) {
  throw new Error('Invalid Partner credential: expected key_id.secret');
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
