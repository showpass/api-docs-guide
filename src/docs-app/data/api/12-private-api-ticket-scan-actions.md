# Ticket Scan Actions

After verifying a ticket using the [ticket verification endpoint](/api/11-private-api-scan-ticket-by-code), you can perform various actions on the ticket by creating a scan history record. This document covers the three main ticket actions:

1. **Pickup** - Mark a ticket as used (scan for entry)
2. **Return** - Undo a previous scan (return to usable state)
3. **Void** - Invalidate a ticket (make it unusable)

All these actions use the same endpoint but with different action parameters.

## Endpoint

```
POST https://www.showpass.com/api/venue/{venue_id}/tickets/items/histories/
```

## Authentication

This endpoint requires authentication using a DRF token:

```
Authorization: Token YOUR_API_TOKEN
```

## Workflow

The typical workflow for ticket scanning is:

1. Verify the ticket using the [verification endpoint](/api/11-private-api-scan-ticket-by-code)
2. Extract the ticket item ID from the verification response
3. Create a scan history record with the appropriate action

## Action: Pickup (Scan)

The "pickup" action marks a ticket as used, changing its status from "payed" to "used". This is the standard action for scanning a ticket for entry.

### Request Body for Pickup

| Parameter        | Type    | Status   | Description                                                |
| ---------------- | ------- |----------| ---------------------------------------------------------- |
| `item`           | Integer | Required | The ticket item ID (obtained from verification endpoint)   |
| `action`         | String  | Required | Must be "pickup" for scanning a ticket                     |
| `scanner_device` | String  | Required | The device used for scanning (e.g., "web_app")            |
| `barcode_string` | String  | Required | The barcode value of the ticket                           |
| `barcode_type`   | String  | Optional | The type of barcode (e.g., "static")                      |

### Notes for Pickup

- A ticket can only be scanned once unless it has a `multiscan_limit` greater than 1
- If a ticket has already been scanned, the API will return an error
- You can undo a scan using the "return" action

## Action: Return (Undo Scan)

The "return" action undoes a previous scan, changing a ticket's status from "used" back to "payed". This is useful for correcting scanning mistakes or handling special circumstances where a ticket needs to be reused.

### Request Body for Return

| Parameter | Type    | Status   | Description                                              |
| --------- | ------- | -------- | -------------------------------------------------------- |
| `item`    | Integer | Required | The ticket item ID (obtained from verification endpoint) |
| `action`  | String  | Required | Must be "return" for undoing a scan                      |

### Notes for Return

- You can only return a ticket that has been previously scanned (status is "used")
- After returning a ticket, it can be scanned again
- This action is typically used for correcting scanning errors or handling special circumstances

## Action: Void (Invalidate)

The "void" action invalidates a ticket before it has been used, changing its status from "payed" to "voided", making it unusable for entry. This is useful for cancellations, refunds, or handling fraudulent tickets.

### Request Body for Void

| Parameter | Type    | Status   | Description                                              |
| --------- | ------- | -------- | -------------------------------------------------------- |
| `item`    | Integer | Required | The ticket item ID (obtained from verification endpoint) |
| `action`  | String  | Required | Must be "void" for invalidating a ticket                 |

### Notes for Void

- You can only void a ticket that has not been used (status is "payed")
- Once a ticket is voided, it cannot be used for entry
- Voided tickets cannot be unvoided or returned to a usable state
- This action is typically used for cancellations, refunds, or handling fraudulent tickets

## Response

All actions return a 201 Created status with details about the scan history record.

### Important Response Fields

| Field            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `id`             | The ID of the scan history record                          |
| `item`           | The ticket item ID that was acted upon                     |
| `action`         | The action performed (pickup, return, or void)             |
| `before`         | The ticket status before the action                        |
| `after`          | The ticket status after the action                         |
| `venue`          | The venue ID (for pickup action)                           |
| `created_by`     | The ID of the user who performed the action (for pickup)   |
| `scanner_device` | The device used for scanning (for pickup)                  |
| `barcode_type`   | The type of barcode (for pickup)                           |
| `created`        | The timestamp when the action was performed (for pickup)   | 