
import React, { useState, useEffect } from "react";
import DocLayout from "../../components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const WebhooksPage = () => {
  const [activeSection, setActiveSection] = useState("");
  
  const tableOfContentsItems = [
    { title: "Introduction", href: "#introduction" },
    { title: "Webhook Events", href: "#webhook-events" },
    { title: "Webhook Objects", href: "#webhook-objects" },
    { title: "Invoice Object", href: "#invoice-object" },
    { title: "Sample Request", href: "#sample-request" },
    { title: "Fields Reference", href: "#fields-reference" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h2[id], h3[id]");
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= 100) {
          setActiveSection(`#${section.id}`);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <DocLayout 
      currentPath="/advanced/webhooks"
      tocItems={tableOfContentsItems}
    >
      <h1>Showpass Webhooks</h1>
      
      <section id="introduction">
        <h2>Introduction</h2>
        <p>
          To make it easier for organizers to integrate Showpass with other systems and automate their workflows, 
          Showpass provides webhook functionality. Webhooks allow external systems to be notified when certain 
          events occur in Showpass, such as when a new order is placed or when a ticket transfer occurs.
        </p>
      </section>

      <section id="webhook-events">
        <h2>Webhook Events</h2>
        <p>
          By setting up a webhook to be triggered by a specific event, external systems can be notified 
          in real-time and perform automated actions based on the event data. Below is a list of the events 
          for which Showpass provides webhook support:
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>invoice.purchase</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Triggered when a new order is created
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>invoice.refund</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Triggered when a transaction is refunded
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>invoice.void</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Triggered when a transaction is voided
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>invoice.transfer</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Triggered when a transfer has been completed and new invoices and tickets have been generated
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>invoice.transferred</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Triggered when a transfer has been completed and updates the original invoice and ticket items. 
                  Should be used to void original tickets when a transfer is completed.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="webhook-objects">
        <h2>Webhook Objects</h2>
        <p>
          The Showpass Webhook Objects section describes the format of the webhook objects that will be sent 
          when specific events are triggered. For example, when the "invoice.purchase" event is triggered, 
          Showpass will send an "invoice" object containing information about the purchase.
        </p>
      </section>

      <section id="invoice-object">
        <h2>Invoice Object</h2>
        <p>
          The invoice object contains detailed information about a purchase, refund, or other transaction-related event.
        </p>
      </section>

      <section id="sample-request">
        <h2>Sample Request</h2>
        <p>Here is an example of a request that we send as a webhook when we're sending the invoice structure:</p>
        
        <div className="space-y-2 mt-4">
          <p><strong>Http Method:</strong> <code>'POST'</code></p>
          <p><strong>URL:</strong> <code>'$https://yoursite.com/webhook/'</code></p>
          <p><strong>Header:</strong> <code>'X-SHOWPASS-SIGNATURE: "HMAC-SHA1(id, $YOUR_WEBHOOK_TOKEN)"'</code></p>
        </div>
        
        <p className="mt-4"><strong>Request Body:</strong></p>
        <CodeBlock 
          language="json"
          value={`{
  "id": "fd-3bc3-463c-8f41-a92971330c06",
  "event_type": "invoice.purchase",
  "webhook_event_uuid": "06d5dc13-2eea-48ad-9f40-2a5bfc9e4c2c",
  "data": {
    "transaction_id": "b3-3eb2-405b-b640-39ec45d04fda",
    "showpass_organization_id": "20",
    "customer_name": "Test User #0",
    "customer_email": "test.user0@test.com",
    "customer_phone_number": null,
    "subscribe_to_venue": true,

    "payment_type": "Credit",
    "other_payment_type": null,
    "currency": "CAD",
    "discounts": 0,
    "net_sales": 107,
    "service_fees": 0,
    "account_credit_applied": 0,
    "gross_revenue": 100,
    "organizer_fees": 0,
    "total_tax": 0,
    "account_credit_type": null,

    "invoice_type": "Sale",
    "invoice_type_id": "101",

    "ticket_items": [
      {
        "event_id": "7",
        "event_name": "Event #0",
        "event_starts_on": "2023-02-18T08:00:00Z",
        "event_ends_on": "2023-02-18T12:00:00Z",

        "first_name_on_ticket": "Test",
        "last_name_on_ticket": "User #0",
        "phone_number_on_ticket": null,
        "email_on_ticket": "test.user0@test.com",

        "id": 7,
        "ticket_status": "Issued",
        "barcode_string": "J6S5UA9OQ",
        "name_on_ticket": "Test User #0",
        "ticket_type_id": "7",
        "ticket_type_name": "Ticket Type #0",
        "ticket_item_type": "ticket",
        "ticket_status_code": "2",
        "created_by_transfer": false,

        "product_name": null,
        "product_id": null,
        "product_attribute_name": null,
        "product_attribute_id": null
      }
    ],
    "invoice_items": [
      {
        "id": 16,
        "invoice_item_type": "Ticket",
        "quantity": 1,
        "discounts": 0,
        "net_sales": 107,
        "service_fees": 0,
        "account_credit_applied": 0,
        "gross_revenue": 100,
        "organizer_fees": 0,
        "total_tax": 0,

        "event_id": "10",
        "event_name": "Event #0",
        "event_facebook_id": null,

        "ticket_type_id": "10",
        "ticket_type_name": "Ticket Type #0",
        "ticket_type_external_id": null,

        "product_name": null,
        "product_id": null,
        "product_attribute_id": null,
        "product_attribute_name": null
      }
    ]
  }
}`} 
        />
      </section>

      <section id="fields-reference">
        <h2>Fields Reference</h2>
        <p>
          When we send the invoice structure as a webhook, we provide a set of fields with their 
          corresponding values to convey information about the invoice. Here's a breakdown of the 
          key fields and what information they represent:
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mt-4">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Field
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>event_type</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  The type of the event that triggered the webhook. <br />
                  Choices = ['invoice.purchase', 'invoice.refund', 'invoice.void', 'invoice.transfer', 'invoice.transferred']
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>webhook_event_uuid</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  The UUID of the webhook event, you can use it as idempotency ID.
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>id</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  The ID for verifying header, in this case it's same as data.transaction_id
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>data.transaction_id</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Unique identifier for the transaction
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>data.customer_name</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Name of the customer who made the purchase
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <code>data.payment_type</code>
                </td>
                <td className="px-6 py-4 text-sm">
                  Payment method used for the transaction
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-6">
          For a complete list of fields and detailed descriptions, please refer to the 
          <a href="#" className="text-primary hover:underline"> Showpass API documentation</a>.
        </p>
      </section>
    </DocLayout>
  );
};

export default WebhooksPage;
