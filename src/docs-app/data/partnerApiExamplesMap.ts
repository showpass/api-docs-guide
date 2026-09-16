import { ApiExamplesData } from "@/docs-app/data/types.ts";
import {
  partnerHmacExamples,
  partnerHmacSigningNote,
} from "@/docs-app/data/partnerApiExamples.ts";

const customerRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
  email: "buyer@example.com",
  is_email_verified: true,
  first_name: "Taylor",
  last_name: "Buyer",
  venue_id: 456,
}, null, 2);

const attributionRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
}, null, 2);

const manageOrderRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
  transaction_id: "d9-1234-4abc-8def-123456789abc",
}, null, 2);

const partnerApiExamplesMap: Record<string, ApiExamplesData> = {
  "/api/partner-api-users": {
    endpoint: "https://www.showpass.com/api/v1/partner/users/",
    method: "POST",
    description: `Connect a customer in your system to Showpass. ${partnerHmacSigningNote}`,
    requestBodyTemplate: customerRequestBody,
    examples: partnerHmacExamples(
      "/api/v1/partner/users/",
      customerRequestBody,
    ),
    response: {
      status: 201,
      body: {
        partner_identity_id: 123,
        partner_external_user_id: "customer-42",
        status: "active",
        link_reason: "created_user",
        venue_id: 456,
      },
    },
  },
  "/api/partner-api-customer-attribution-token": {
    endpoint: "https://www.showpass.com/api/v1/partner/customer-attribution-token/",
    method: "POST",
    description: "Create checkout attribution for a connected customer",
    requestBodyTemplate: attributionRequestBody,
    examples: partnerHmacExamples(
      "/api/v1/partner/customer-attribution-token/",
      attributionRequestBody,
    ),
    response: {
      status: 201,
      body: {
        customer_attribution_token: "opaque-token",
        customer_attribution_token_expires_in_seconds: 3600,
      },
    },
  },
  "/api/partner-api-order-manage-link": {
    endpoint: "https://www.showpass.com/api/v1/partner/orders/manage-link/",
    method: "POST",
    description: "Send a customer to their completed Showpass order. Replace the example transaction_id with the purchase webhook's data.transaction_id.",
    requestBodyTemplate: manageOrderRequestBody,
    examples: partnerHmacExamples(
      "/api/v1/partner/orders/manage-link/",
      manageOrderRequestBody,
    ),
    response: {
      status: 201,
      body: {
        manage_url: "https://www.showpass.com/account/partner-login/opaque-code/",
        expires_in_seconds: 120,
      },
    },
  },
};

export default partnerApiExamplesMap;
