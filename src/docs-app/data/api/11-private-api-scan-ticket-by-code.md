# Ticket Verification

Ticket verification is the first step in the ticket scanning process. Before you can scan, void, or return a ticket, you need to verify it by looking up its details using the barcode or code.

## Overview

The ticket verification endpoint allows you to look up a ticket by its barcode or code. This is an essential first step because:

1. It confirms that the ticket exists and is valid
2. It provides the ticket item ID needed for subsequent operations
3. It returns the current status of the ticket (e.g., "payed", "used", "voided")
4. It provides information about the ticket type, including whether it supports multiple scans

After verifying a ticket, you can proceed to perform actions like scanning (pickup), voiding, or returning the ticket using the Ticket Scan Actions endpoint.

## Authentication

This endpoint requires authentication using a Showpass token:

```
Authorization: Token YOUR_API_TOKEN
```

## Endpoint

The ticket verification endpoint allows you to look up a ticket by its barcode or code.
This endpoint supports both GET and POST methods:

```
GET https://www.showpass.com/api/venue/{venue_id}/tickets/items/scan/?code={code}
POST https://www.showpass.com/api/venue/{venue_id}/tickets/items/scan/
```

### Path Parameters

| Parameter  | Type    | Status   | Description                                   |
| ---------- | ------- | -------- | --------------------------------------------- |
| `venue_id` | Integer | Required | The ID of your venue                          |

### Query Parameters (GET) / Request Body (POST)

| Parameter          | Type   | Status   | Description                                                                 |
| ------------------ | ------ | -------- | --------------------------------------------------------------------------- |
| `code`             | String | Required | The barcode or code of the ticket to look up                                |
| `permittedTypeIDs` | String | Optional | Comma-separated list of ticket type IDs that are allowed to be scanned. If provided, only tickets matching these types will be returned. |

**Note:** When using POST, you need to send the parameters in the request body instead of the query parameters.
This is useful when you want to send a large number of permitted ticket types.

### Response

The response includes details about the ticket, including its ID, status, and type. You'll need the ticket ID for subsequent operations like scanning or voiding the ticket.

### Important Response Fields

| Field             | Description                                      |
| ----------------- | ------------------------------------------------ |
| `id`              | The ticket item ID (needed for scan operations)  |
| `event_id`        | The ID of the event this ticket is for           |
| `status`          | Current ticket status (e.g., "payed", "used")    |
| `barcode_string`  | The barcode value of the ticket                  |
| `type`            | Information about the ticket type                |

## Next Steps   

After verifying a ticket, you can perform various actions on the ticket:
1. **Scan the ticket** (mark as used) using the "pickup" action
2. **Void the ticket** (invalidate) using the "void" action
3. **Return a scanned ticket** (undo scan) using the "return" action

All these operations are covered in the [Ticket Scan Actions](/api/12-private-api-ticket-scan-actions) document.