# Showpass Private Organizer API

The Private Organizer API lets integrations work with an organization's events, tickets and other organizer resources. Requests require an API credential and permission to perform the requested operation.

## Create an API key

If Developer tools is enabled for your organization:

1. Sign in to Showpass and select the organization your integration will use.
2. Open **Developer tools → API keys** at: https://www.showpass.com/manage/organization/developer/
3. Select **Create API key** and enter a recognizable integration name.
4. Choose the scopes the integration needs. Only scopes available under your current employee permissions can be selected.
5. Choose an expiration and create the key.
6. Copy the full secret into your integration's secret store before closing the dialog. The secret is shown only once.

The prefix shown in the key list identifies the key. It is not the full secret and cannot authenticate requests.

## How permissions and scopes work

Each new developer key belongs to the employee who creates it and to the selected organization. A request must pass all of these checks:

- The key is active, has not expired and has not been revoked.
- The employee still has valid access to that organization.
- The employee's current permissions allow the operation.
- The key's selected scopes allow the operation.
- The endpoint's existing authorization rules allow access to the requested resource.

For example, an employee with scanning permissions can create a key with eligible scanning scopes. Selecting a scanning scope does not grant permission to manage events. An All Access employee can choose a smaller set of scopes for a particular integration.

Removing an employee's organization access or deactivating their account disables their keys. Reducing their permissions can stop existing API calls from succeeding. Increasing employee permissions does not add new scopes to an existing key. Platform staff privileges grant no additional authority to an API key.

Scopes do not make every internal Showpass endpoint available. Use documented endpoints and supported operations. The descriptions shown when selecting scopes explain the operations each scope covers.

## Send an authenticated request

Send the full secret in the `Authorization` header, using `Token`, one space and the secret:

```http
Authorization: Token YOUR_API_KEY_SECRET
```

The authentication format is the same for developer keys and existing organizer API tokens. Send credentials only over HTTPS and keep them in your backend or secret manager. Do not put them in URLs, browser code, source control or logs.

For a key with **Read events** access, replace `YOUR_ORGANIZATION_ID` below with the organization the key belongs to. Set `SHOWPASS_API_KEY` securely in your environment before running the request:

```bash
curl --request GET \
  'https://www.showpass.com/api/venue/YOUR_ORGANIZATION_ID/events/?page_size=1' \
  --header "Authorization: Token ${SHOWPASS_API_KEY}"
```

The `venue` identifier in the URL is the organization ID. A key for one organization does not grant access to another organization.

## Expiration, revocation and rotation

Check the expiration and status in **Developer tools → API keys**. An expired or revoked key cannot be used again. If you lose the secret, create a replacement; the key list cannot reveal it.

To rotate safely:

1. Create a new key with the required scopes and an appropriate expiration.
2. Update your integration to use the new secret.
3. Verify the integration works using the new key.
4. Revoke the old key.

Revocation immediately prevents new requests using that key. It cannot be undone. Employees can manage their own keys; employees with All Access or Developer management permission can inspect and revoke organization keys.

## Find a request in the logs

When request history is available, open **Developer tools → Request logs** for the same organization.

Request history is retained for 30 days. Filter by API key, HTTP method, status code or date range. Select an endpoint to open Request details. To find a specific call, copy its response's `X-Request-Id` header and enter that value in the **Request ID** filter. Clear any other filters that would exclude the request.

History is limited to the organization and keys you are authorized to inspect. It covers developer API key requests; browser sessions and legacy organizer tokens are excluded. Requests rejected before authentication or by rate limits are not recorded, and recent requests may take time to appear. Do not rely on a missing row as proof that no request reached Showpass.

## Troubleshooting

| Result | What to check |
| --- | --- |
| `401 Unauthorized` | Confirm you sent the full secret with the `Token` prefix. Check whether the key expired, was revoked, or lost valid employee access. |
| `403 Forbidden` | Check the selected organization, the key's scopes, the employee's current permissions and the endpoint's access rules. |
| `404 Not Found` | Check the endpoint, organization ID and resource ID. Access rules can also make a resource unavailable. |
| Request missing from history | Confirm you used a developer key, selected the correct organization and date range, and allowed time for logs to arrive. Authentication failures may have no history row. |

When contacting support, include the request ID, HTTP method, endpoint, status code and approximate request time with its timezone. Never include the API secret.
