# Showpass webhooks: Logging and troubleshooting

Showpass provides logging features within its dashboard to help you monitor the status of your webhook deliveries and troubleshoot any issues that may arise. Understanding these logs is key to maintaining a healthy webhook integration.

## Viewing webhook event logs

The Webhook Event Logs provide a detailed history of each individual webhook event that Showpass has attempted to send to your configured endpoints.

1.  **Accessing Event Logs:**

    - Log in to your Showpass Dashboard.
    - Navigate to **Organization Settings > Webhooks**.
    - You should see a list of your configured webhook endpoints.
    - Typically, there will be an option associated with each endpoint to view its "Event Logs," "Delivery Logs," or similar. This might be a button, a link, or an icon.

2.  **Information in Event Logs:**

    - **Timestamp:** The date and time Showpass attempted to send the event.
    - **Event Type:** The type of event that was triggered (e.g., `invoice.purchase`, `webhook.test`).
    - **Endpoint URL:** The URL to which the event was sent.
    - **Status:** The delivery status of the webhook (e.g., "Success," "Failed," "Pending").
    - **HTTP Status Code:** The HTTP response code received from your endpoint (e.g., `200 OK`, `404 Not Found`, `500 Internal Server Error`).
    - **Payload/Response (Details):** Often, you can click on a specific log entry to view more details, which might include:
      - The actual JSON payload that was sent.
      - The response body received from your server (if any).
      - Error messages if the delivery failed.

3.  **Resending Events:**
    - If a webhook event failed to deliver (e.g., due to a temporary issue with your server or network), the Showpass dashboard may offer an option to **resend** that specific event.
    - This is useful for recovering missed notifications without needing the original action to be performed again in Showpass.
    - Be mindful of idempotency in your receiving application if you resend events, to avoid duplicate processing (the `webhook_event_uuid` in the payload can help with this).

## Viewing general webhook logs (Delivery Status)

Separate from individual event logs, there might be a more general "Webhook Logs" section or a summary view that provides an overview of the health and delivery status of your webhook endpoints.

- This view might show aggregated statistics like the number of successful deliveries, failures, and error rates over a period.
- It helps in identifying if a particular endpoint is consistently failing or experiencing issues.

## Common troubleshooting steps

- **Check Endpoint URL:** Ensure the URL configured in Showpass is correct, publicly accessible, and uses `https://`.
- **Verify Server is Running:** Make sure your server application at the endpoint URL is running and not down.
- **Inspect HTTP Status Codes:**
  - `2xx` (e.g., `200 OK`, `202 Accepted`): Generally indicates your server received the webhook successfully. Your server should return a `2xx` status code quickly to acknowledge receipt. Any processing should be done asynchronously to avoid timeouts.
  - `3xx` (Redirects): Showpass webhooks typically do not follow redirects. Ensure your endpoint URL is the direct URL.
  - `4xx` (Client Errors):
    - `400 Bad Request`: Your server might have found an issue with the request format (unlikely if it's from Showpass directly, but possible if a proxy is involved).
    - `401 Unauthorized` / `403 Forbidden`: Check if your endpoint has authentication or IP whitelisting that might be blocking Showpass. Signature verification failures on your end should not result in a `401/403` _to Showpass_; rather, you should process it as an invalid request internally.
    - `404 Not Found`: The endpoint URL is incorrect or the path does not exist on your server.
    - `405 Method Not Allowed`: Ensure your endpoint is configured to accept `POST` requests.
  - `5xx` (Server Errors): Indicates an issue on your server-side application code. Check your server logs for detailed error messages.
- **Check Signature Verification:** If you are implementing signature verification (highly recommended), ensure your calculation logic and secret key are correct. Mismatched signatures will lead you to (correctly) ignore the webhook.
- **Examine Payload:** Use the "Send a Test Event" feature or inspect the payload in the event logs to ensure your application is parsing the JSON correctly and expecting the right fields.
- **Firewall/Network Issues:** Ensure your server's firewall or any network security groups are not blocking incoming POST requests from Showpass IP addresses (if Showpass publishes its webhook originating IPs).
- **Timeout Issues:** Your endpoint should respond quickly (within a few seconds) with a `2xx` status code to acknowledge receipt. If your processing logic takes too long, Showpass might consider the delivery a timeout/failure. Perform lengthy processing asynchronously after sending the initial `2xx` response.

By regularly checking your webhook logs in the Showpass dashboard and following these troubleshooting steps, you can ensure a reliable and effective webhook integration.
