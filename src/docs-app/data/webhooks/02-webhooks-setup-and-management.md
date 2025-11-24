# Showpass Webhooks: Setup and management

This section details how to configure, edit, and manage your webhook endpoints within the Showpass dashboard.

## Setting up a new webhook endpoint

To start receiving webhook notifications from Showpass, you need to add and configure an endpoint in your Showpass organization settings, [here](https://www.showpass.com/dashboard/webhooks/).

1.  **Navigate to Webhooks:**

    - Log in to your Showpass Dashboard.
    - Go to your **Organization Settings**. You can find this by clicking the hamburger menu in the top-left corner.
    - Look for a **Webhooks** tab or section.

2.  **Add New Endpoint:**

    - Click on the "Add Endpoint" button.

3.  **Configure the Endpoint:**

    - **Endpoint URL:** Enter the publicly accessible URL on your server or third-party service where Showpass should send the webhook POST requests. This URL must be active and capable of receiving HTTP POST requests.
      - _Example for testing: You can use a service like [Webhook.site](https://webhook.site/) to get a temporary URL to inspect payloads._
    - **Endpoint Name:** Add a title to help you identify the purpose of this webhook endpoint later (e.g., "CRM Integration for Purchases," "Slack Notifications for Refunds").
    - **Events:** Select the specific Showpass events for which you want this endpoint to receive notifications. You can typically choose from a list such as:
      - `invoice.purchase`
      - `invoice.refund`
      - `invoice.void`
      - `invoice.transfer`
      - `invoice.transferred`
      You can usually select all or multiple events for a single endpoint.

4.  **Save the Endpoint:**
    - Click "Add endpoint"

5.  **Retrieve Your Secret Key:**
    - Once the endpoint is created, Showpass will generate a **Secret Key**. You can find and copy it from the Edit Webhook Endpoint.
    - You will need it to verify the authenticity of webhook requests received by your endpoint (see section "3. Security").

> **Status:** Your webhooks are active by default, but you can set them to ‘Paused’ to temporarily disable them.

## Managing existing webhook endpoints

From the Webhooks section in your Showpass dashboard, you can typically manage your existing endpoints:

- **View Endpoints:** A list of all your configured webhook endpoints will be displayed, showing their URL, description and status.

- **Edit an Endpoint:**

  - You can usually click an edit icon next to an endpoint to modify its settings:
    - Change the Endpoint URL.
    - Update the Description.
    - Add or remove subscribed Events.
    - Change the Status (Active/Paused).
    - Copy or Regenerate the Secrek Key

- **Pause/Activate an Endpoint:**

  - You can temporarily stop Showpass from sending webhooks to an endpoint by changing its status to "Paused."
  - To resume sending, change the status back to "Active."

- **Send a Test Event:**

  - Most webhook management interfaces provide an option to send a test event to a selected endpoint.
  - This is extremely useful for verifying that your endpoint URL is correctly configured, reachable, and that your receiving application can process the request format.
  - You can send an event to this webhook by clicking "Send Test". 
  - The payload for a test event will typically contain a sample structure, allowing you to confirm your parsing logic.

- **Regenerate Secret Key:**

  - If your Secret Key is compromised or you need to rotate it for security reasons, there should be an option to regenerate it.
  - **Caution:** Regenerating a Secret Key will invalidate the old one. You will need to update your webhook verification logic on your server with the new key immediately.

- **Delete an Endpoint:**
  - If an endpoint is no longer needed, you can delete it. This will stop Showpass from sending any further webhooks to that URL.

By following these steps, you can effectively set up and manage your webhook integrations with Showpass, enabling real-time data flow to your external systems. Always ensure your endpoint URLs are secure (`https://`) and robust enough to handle incoming requests.
