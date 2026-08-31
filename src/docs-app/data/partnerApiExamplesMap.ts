import { ApiExamplesData } from "@/docs-app/data/types.ts";
import {
  partnerHmacExamples,
  partnerHmacSigningNote,
} from "@/docs-app/data/partnerApiExamples.ts";

const partnerApiExamplesMap: Record<string, ApiExamplesData> = {
  "/api/partner-api-users": {
    endpoint: "https://www.showpass.com/api/partner/users/",
    method: "POST",
    description: `Connect a customer in your system to Showpass. ${partnerHmacSigningNote}`,
    examples: partnerHmacExamples(
      "/api/partner/users/",
      '{"partner_user_id":"customer-42","email":"customer@example.com","email_verified":true}',
    ),
    response: {
      status: 201,
      body: {
        partner_identity_id: 123,
        partner_user_id: "customer-42",
        status: "active",
        link_reason: "created_user",
        venue_id: 456,
      },
    },
  },
  "/api/partner-api-customer-attribution-token": {
    endpoint: "https://www.showpass.com/api/partner/customer-attribution-token/",
    method: "POST",
    description: "Create checkout attribution for a connected customer",
    examples: partnerHmacExamples(
      "/api/partner/customer-attribution-token/",
      '{"partner_user_id":"customer-42"}',
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
    endpoint: "https://www.showpass.com/api/partner/orders/manage-link/",
    method: "POST",
    description: "Send a customer to their completed Showpass order",
    examples: partnerHmacExamples(
      "/api/partner/orders/manage-link/",
      '{"partner_user_id":"customer-42","transaction_id":"transaction-id"}',
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
