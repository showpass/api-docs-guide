# Showpass webhooks: Setup and management

This section details how to configure, edit, and manage your webhook endpoints within the Showpass dashboard.

## Setting up a new webhook endpoint

To start receiving webhook notifications from Showpass, you need to add and configure an endpoint in your Showpass organization settings.

1.  **Navigate to Webhooks:**

    - Log in to your Showpass Dashboard.
    - Go to your **Organization Settings**. This is often found by clicking your organization's name or an icon in the main navigation, then selecting "Settings" or a similar option.
    - Look for a **Webhooks** tab or section.

2.  **Add New Endpoint:**

    - Click on the "Add New Endpoint" button (or similar, e.g., "Create Webhook").

3.  **Configure the Endpoint:**

    - **Endpoint URL:** Enter the publicly accessible URL on your server or third-party service where Showpass should send the webhook POST requests. This URL must be active and capable of receiving HTTP POST requests.
      - _Example for testing: You can use a service like [Webhook.site](https://webhook.site/) to get a temporary URL to inspect payloads._
    - **Description (Optional but Recommended):** Add a brief description to help you identify the purpose of this webhook endpoint later (e.g., "CRM Integration for Purchases," "Slack Notifications for Refunds").
    - **Events:** Select the specific Showpass events for which you want this endpoint to receive notifications. You can typically choose from a list such as:
      - `invoice.purchase`
      - `invoice.refund`
      - `invoice.void`
      - `invoice.transfer`
      - `invoice.transferred`
      - `webhook.test` (A special event for testing your endpoint)
        You can usually select multiple events for a single endpoint.
    - **Status:** Ensure the status is set to "Active" if you want to start receiving webhooks immediately. You can set it to "Paused" to disable it temporarily.

4.  **Save the Endpoint:**

    - Click "Save" or "Create Endpoint."

5.  **Retrieve Your Secret Key:**
    - Once the endpoint is created, Showpass will generate a **Secret Key** (also sometimes referred to as a Webhook Token).
    - **Important:** Copy this Secret Key immediately and store it securely. You will need it to verify the authenticity of webhook requests received by your endpoint (see "Webhook Security"). This key might only be shown once.

## Managing existing webhook endpoints

From the Webhooks section in your Showpass dashboard, you can typically manage your existing endpoints:

- **View Endpoints:** A list of all your configured webhook endpoints will be displayed, showing their URL, description, status, and the events they are subscribed to.

- **Edit an Endpoint:**

  - You can usually click an "Edit" button or an icon next to an endpoint to modify its settings:
    - Change the Endpoint URL.
    - Update the Description.
    - Add or remove subscribed Events.
    - Change the Status (Active/Paused).
  - Save any changes.

- **Pause/Activate an Endpoint:**

  - You can temporarily stop Showpass from sending webhooks to an endpoint by changing its status to "Paused."
  - To resume sending, change the status back to "Active."

- **Send a Test Event:**

  - Most webhook management interfaces provide an option to send a test event (usually `webhook.test` or a sample of another event type) to a selected endpoint.
  - This is extremely useful for verifying that your endpoint URL is correctly configured, reachable, and that your receiving application can process the request format.
  - The payload for a test event will typically contain a sample structure, allowing you to confirm your parsing logic.

- **Regenerate Secret Key:**

  - If your Secret Key is compromised or you need to rotate it for security reasons, there should be an option to regenerate it.
  - **Caution:** Regenerating a Secret Key will invalidate the old one. You will need to update your webhook verification logic on your server with the new key immediately.

- **Delete an Endpoint:**
  - If an endpoint is no longer needed, you can delete it. This will stop Showpass from sending any further webhooks to that URL.

By following these steps, you can effectively set up and manage your webhook integrations with Showpass, enabling real-time data flow to your external systems. Always ensure your endpoint URLs are secure (`https://`) and robust enough to handle incoming requests.
