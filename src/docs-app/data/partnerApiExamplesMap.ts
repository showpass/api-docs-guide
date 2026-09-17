import { ApiExamplesData } from "@/docs-app/data/types.ts";
import {
  partnerHmacExamples,
  partnerHmacSigningNote,
} from "@/docs-app/data/partnerApiExamples.ts";

const customerRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
  email: "buyer@example.com",
  first_name: "Taylor",
  last_name: "Buyer",
  phone: "+14035550123",
  venue_id: 456,
}, null, 2);

const attributionRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
  venue_id: 456,
}, null, 2);

const manageOrderRequestBody = JSON.stringify({
  partner_external_user_id: "customer-42",
  transaction_id: "d9-1234-4abc-8def-123456789abc",
}, null, 2);

const partnerApiExamplesMap: Record<string, ApiExamplesData> = {
  "/api/partner-api-users": {
    endpoint: "https://www.showpass.com/api/v1/partner/users/",
    method: "POST",
    description: `Connect a customer in your system to Showpass. Registration requires a first name, last name, and valid email; phone is optional. POST creates a Partner mapping to a venue customer or updates that venue customer when email and external ID match. Omitted phone is preserved. Successful requests return a checkout token when attribution is enabled. ${partnerHmacSigningNote}`,
    requestBodyTemplate: customerRequestBody,
    examples: partnerHmacExamples(
      "/api/v1/partner/users/",
      customerRequestBody,
    ),
    response: {
      status: 201,
      body: {
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
    description: "Create checkout attribution for a connected customer using their external ID and venue_id. The token is valid only for that venue. The linked customer needs both names and an email. Phone is optional for token issuance and checkout",
    requestBodyTemplate: attributionRequestBody,
    examples: partnerHmacExamples(
      "/api/v1/partner/customer-attribution-token/",
      attributionRequestBody,
    ),
    response: {
      status: 201,
      body: {
        customer_attribution_token: "opaque-token",
        token_expires_in_seconds: 3600,
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
