# Showpass Webhooks: Logging and troubleshooting


Showpass provides logging features within its dashboard to help you monitor the status of your webhook deliveries and troubleshoot any issues that may arise. Understanding these logs is key to maintaining a healthy webhook integration.

---

## Viewing Webhook Events History

The Webhook "Events" provide a detailed history of each individual webhook event that Showpass has attempted to send to your configured endpoints.

### Accessing Event Logs

1. Log in to your Showpass Dashboard
2. Navigate to **Organization Settings > Webhooks**
3. Go to "Events" tab.

### Information in Events

Each event entry contains the following information:

- **Event Name:** Title of the event based on event type.
- **Date:** The date event was created.
- **Event Data:** The actual JSON payload that was created.

In the "Webhook Attempts" Section you can see attempts to send this event to your webhook endpoints in the past 15 days:

- **Status:** The delivery status of the webhook (e.g., "Success," "Failed," "Pending")
- **Webhook URL:** The URL to which the event was sent
- **Date:** The date and time Showpass attempted to send the event
- **Resend Menu:** The trigger for resending the webhook


### Resending Events

If a webhook event failed to deliver (e.g., due to a temporary issue with your server or network), the Showpass dashboard may offer an option to **resend** that specific event.
This is useful for recovering missed notifications without needing the original action to be performed again in Showpass

> **Note:** Be mindful of idempotency in your receiving application if you resend events, to avoid duplicate processing


---

## Viewing General Webhook Logs

Separate from individual event logs, there is a more general Webhook "Logs" section or a summary view that provides an overview of the health and delivery status of your webhook endpoints.
It helps in identifying if a particular endpoint is consistently failing or experiencing issues

In this section you can see 3 tabs:

- **All**
- **Succeeded**
- **Failed**

Each webhook log has these details:

- **HTTP Status Code:** The HTTP response code received from your endpoint (e.g., `200 OK`, `404 Not Found`, `500 Internal Server Error`)
- **ID:** Identifier of the webhook attempt.
- **Time:** The time Showpass attempted to send the event
- **Event:** The type of event that was triggered (e.g., `invoice.purchase`, `webhook.test`)
- **Idempotency:** A unique string for each event.
- **Response Body:** The response body received from the server (if any) or error messages if the delivery failed

> **Note:** The `webhook_event_uuid` in the payload can help with idempotency tracking.


---

## Common troubleshooting steps

### Check Endpoint URL

Ensure the URL configured in Showpass is correct, publicly accessible, and uses `https://`.

### Verify Server is Running

Make sure your server application at the endpoint URL is running and not down.

### Inspect HTTP Status Codes

**2xx (Success):**
- Examples: `200 OK`, `202 Accepted`
- Generally indicates your server received the webhook successfully
- Your server should return a `2xx` status code quickly to acknowledge receipt
- Any processing should be done asynchronously to avoid timeouts

**3xx (Redirects):**
- Showpass webhooks typically do not follow redirects
- Ensure your endpoint URL is the direct URL

**4xx (Client Errors):**
- `400 Bad Request`: Your server might have found an issue with the request format (unlikely if it's from Showpass directly, but possible if a proxy is involved)
- `401 Unauthorized` / `403 Forbidden`: Check if your endpoint has authentication or IP whitelisting that might be blocking Showpass. Signature verification failures on your end should not result in a `401/403` _to Showpass_; rather, you should process it as an invalid request internally
- `404 Not Found`: The endpoint URL is incorrect or the path does not exist on your server
- `405 Method Not Allowed`: Ensure your endpoint is configured to accept `POST` requests

**5xx (Server Errors):**
- Indicates an issue on your server-side application code
- Check your server logs for detailed error messages

### Check Signature Verification

If you are implementing signature verification (highly recommended), ensure your calculation logic and secret key are correct. Mismatched signatures will lead you to (correctly) ignore the webhook.

### Examine the Payload

Review the payload in the event logs to ensure it matches the expected format. Check for any unexpected values or missing fields that might cause your application to fail.

### Firewall and Network Issues

Ensure your firewall or network configuration is not blocking requests from Showpass. You may need to whitelist Showpass IP addresses if your server has strict access controls.

### Timeout Issues

Your endpoint should respond quickly (within a few seconds) with a `2xx` status code to acknowledge receipt. If your processing logic takes too long, Showpass might consider the delivery a timeout/failure. Perform lengthy processing asynchronously after sending the initial `2xx` response.

---

## Best practices

- **Monitor logs regularly:** Check your webhook logs in the Showpass dashboard regularly to catch issues early
- **Implement idempotency:** Use the `webhook_event_uuid` to prevent duplicate processing
- **Test thoroughly:** Use the `webhook.test` event during development and for ongoing health checks
- **Respond quickly:** Always return a `2xx` status code quickly and process data asynchronously
- **Log everything:** Maintain your own server-side logs for debugging and auditing purposes

> **Tip:** By regularly checking your webhook logs in the Showpass dashboard and following these troubleshooting steps, you can ensure a reliable and effective webhook integration.
