import { ApiExamplesData } from "@/docs-app/data/types.ts";

/**
 * Centralized map of API examples data for use in documentation pages
 * Keys are the route paths (e.g., '/api/events')
 */
const apiExamplesMap: Record<string, ApiExamplesData> = {
  // Event API examples
  "/api/03-public-api-query-specific-event": {
    endpoint: "https://www.showpass.com/api/public/events/{slug}/",
    method: "GET",
    description: "Retrieve detailed information about a specific event",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/events/summer-music-festival-2025/" \\
-H "Content-Type: application/json"`,
      python: `import requests

response = requests.get(
    "https://www.showpass.com/api/public/events/summer-music-festival-2025/",
    headers={"Content-Type": "application/json"}
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/events/summer-music-festival-2025/', {
  headers: { 'Content-Type': 'application/json' }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`,
    },
    response: {
      status: 200,
      body: {
        id: 1234567,
        created: "2024-11-18T17:57:50.917103Z",
        updated: "2025-01-20T09:49:02.248134Z",
        slug: "summer-music-festival-2025",
        name: "Summer Music Festival 2025",
        subtitle: null,
        venue: {
          id: 1234,
          slug: "example-music-hall",
          name: "Example Music Hall",
          twitter: "https://www.twitter.com/examplehall/",
          facebook: "https://www.facebook.com/ExampleMusicHall/",
          web_address: "http://www.examplemusichall.com/",
          description: "Example Music Hall is a premier entertainment venue dedicated to bringing the best live music experience to our community.",
          phone_number: "14035551234",
          street_name: "123 Festival Way",
          city: "Calgary",
          avatar: "https://example.cloudfront.net/media/images/venues/example-music-hall/avatars/abc123.png",
          currency: "CAD",
          instagram: "https://www.instagram.com/examplemusichall/",
          default_refund_policy: "Refunds available up to 24 hours before event start time, subject to processing fees.",
          allow_messages_from_customers: true,
          is_test: false,
          ga_tracking_id: null,
          ga_4_tracking_id: null,
          aw_global_tag: null,
          google_tag_manager_id: null,
          org_facebook_pixel: null,
          org_facebook_api_access_token: null,
          publishable_api_key: "pk_live_example123456789",
          rating: {
            total_ratings: 0,
            average_rating: 0
          },
          showpass_branding_is_enabled: true,
          automatic_guest_checkout_is_enabled: true,
          all_in_pricing_is_enabled: true,
          low_inventory_warning_enabled: true,
          low_inventory_threshold_high: "0.75",
          low_inventory_threshold_low: "0.50",
          low_inventory_threshold_middle: "0.60",
          show_inventory_amount: 9,
          barcode_delivery: "default",
          barcode_delivery_delay: 24,
          afterpay_is_enabled: true,
          affirm_is_enabled: null,
          gateway_type: 101,
          enable_multi_layer_packages: false,
          tax_on_fees: false,
          enable_reserve_count_management: null,
          access_granted_account_id: "acct_example123456789"
        },
        location: {
          id: 1235,
          street_name: "123 Festival Way",
          city: "Calgary",
          province: "Alberta",
          postal_code: "T2P 2M5",
          position: "51.0447,-114.0719",
          venue: 1234,
          name: "Festival Grounds",
          country: "Canada"
        },
        starts_on: "2025-07-15T19:00:00Z",
        ends_on: "2025-07-15T23:00:00Z",
        opens_at: null,
        terms: null,
        description: "<div style=\"font-size:14px;line-height:22px;\"><div style=\"text-align:center;\"><strong><span style=\"font-size:24px;\">Summer Music Festival 2025</span></strong></div><p style=\"text-align:center;\">Join us for an incredible summer music festival featuring multiple artists across various genres. This outdoor event will showcase local and international talent with food vendors, craft booths, and family-friendly activities.</p><p style=\"text-align:center;\">Gates open at 2:00 PM with performances starting at 3:00 PM. This is an all-ages event with designated areas for different age groups.</p><p style=\"text-align:center;\">Parking is available on-site for $10 per vehicle. No outside food or beverages permitted.</p></div>",
        description_without_html: "Summer Music Festival 2025\n\nJoin us for an incredible summer music festival featuring multiple artists across various genres. This outdoor event will showcase local and international talent with food vendors, craft booths, and family-friendly activities.\n\nGates open at 2:00 PM with performances starting at 3:00 PM. This is an all-ages event with designated areas for different age groups.\n\nParking is available on-site for $10 per vehicle. No outside food or beverages permitted.",
        venue_fee: "0.00",
        image: "https://example.cloudfront.net/media/images/events/summer-festival/images/abc123.png",
        image_banner: "https://example.cloudfront.net/media/images/events/summer-festival/img-banner/def456.png",
        thumbnail: "https://example.cloudfront.net/media/images/events/summer-festival/thumbnail/ghi789.png",
        is_published: true,
        frontend_details_url: "https://www.showpass.com/summer-music-festival-2025/",
        no_ticket_types: null,
        is_published_for_sellers: true,
        is_featured: true,
        is_password_protected: false,
        facebook_id: null,
        assigned_space: null,
        social_share_enabled: false,
        social_share_reward: "1.00",
        timezone: "America/Edmonton",
        currency: "CAD",
        password_message: "",
        external_link: null,
        sold_out: false,
        refund_policy: null,
        facebook_official_events_id: null,
        require_terms_acceptance: null,
        terms_url_link: null,
        local_starts_on: "2025-07-15T13:00:00-06:00",
        info_collect_per_ticket: false,
        initiate_purchase_button: "ipbd_buy_tickets",
        post_purchase_message: null,
        show_inventory_amount: null,
        restrictions: [],
        inventory: null,
        is_waitlisted: null,
        has_related_events: false,
        is_main: false,
        is_recurring: null,
        parent_event: null,
        is_recurring_parent: null,
        inventory_sold_out: null,
        child_count: 0,
        custom_purchase_button: null,
        is_web_purchase_only: false,
        date_time_to_be_determined: null,
        no_isolated_seats: false,
        ticket_types: [
          {
            id: 3001,
            name: "General Admission",
            price: "35.00",
            inventory_left: 150,
            low_ticket_inventory: 0
          },
          {
            id: 3002,
            name: "VIP Experience",
            price: "85.00",
            inventory_left: 25,
            low_ticket_inventory: 0
          }
        ],
        charities_of_choice: null,
        donation_verbiage: null,
        donation_default_amount: "ten",
        status: "sp_event_active",
        duration_seconds: 14400,
        virtual_event_type: null,
        allowed_regions: [],
        fee_structure: "added_fee_structure",
        region_is_allowed: true,
        stats: {
          last_updated: "2025-01-20T16:45:23.166081Z",
          is_available: true
        },
        popup_data: {},
        low_ticket_inventory: 0,
        show_on_calendar: true,
        low_inventory_warning_enabled: null,
        barcode_delivery: "default",
        barcode_delivery_delay: 24,
        is_protected_by_queue: false,
        attraction_event_config: null,
        is_attraction_child: null,
        public_inventory_sold_out: null,
        sold_out_segments: [],
        is_nfc_pass_only: null,
        artists: [],
        event_sale_starts_on: null,
        third_party_redirect_option: "page_load",
        event_detail_accommodation_link: "",
        is_sponsored: null,
        membership_ticket_types: [],
        post_purchase_accommodation_link: "https://showpass.hotelplanner.com/Search/?City=Calgary&InDate=2025-07-15&OutDate=2025-07-16&kw=venueid_1234",
        collect_info_first_name: true,
        collect_info_last_name: true,
        collect_info_company: false,
        collect_info_phone_number: true,
        collect_info_email: true,
        collect_info_job_title: false,
        collect_info_student_number: false,
        collect_info_home_address: false,
        collect_info_birthday: false,
        collect_info_license_plate: false,
        enforce_box_office_info_collection: false,
        info_collection_type: "gict_standard_info",
        child_events: [],
        room: null,
        tags: ["concert", "festival", "outdoor", "music", "summer", "family", "local artists"],
        no_ticket_types_message: null
      }
    },
  },

  // Event List API examples
  "/api/02-public-api-event-list-by-organization": {
    endpoint: "https://www.showpass.com/api/public/discovery/",
    method: "GET",
    description: "List events with optional filters",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/discovery/?start_date__gte=2023-12-01&venue__in=123" \\
-H "Content-Type: application/json"`,
      python: `import requests

params = {
    "start_date__gte": "2023-12-01",
    "venue__in": "123"
}

response = requests.get(
    "https://www.showpass.com/api/public/discovery/",
    headers={"Content-Type": "application/json"},
    params=params
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/discovery/', {
  headers: { 'Content-Type': 'application/json' },
  params: {
    venue__in: '123'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`,
    },
    response: {
      status: 200,
      body: {
        count: 3,
        next: null,
        previous: null,
        next_page_number: null,
        previous_page_number: null,
        page_number: 1,
        num_pages: 1,
        next_list: [],
        previous_list: [],
        results: [
          {
            uuid: "a1b2c3d4-e5f6-4789-a123-456789abcdef",
            item_id: 1234001,
            type: "event",
            venue: {
              id: 1234,
              name: "Example Music Hall",
              slug: "example-music-hall",
              currency: "CAD",
              low_inventory_threshold_low: "0.50",
              low_inventory_threshold_middle: "0.60",
              low_inventory_threshold_high: "0.75",
              low_inventory_warning_enabled: false,
              all_in_pricing_is_enabled: true
            },
            venue_id: 1234,
            name: "Electronic Artist Live - Calgary",
            description_without_html: "",
            starts_on: "2025-07-15T03:00:00Z",
            ends_on: "2025-07-15T08:00:00Z",
            date_time_to_be_determined: null,
            timezone: "US/Mountain",
            is_recurring: null,
            is_recurring_parent: false,
            child_count: 0,
            external_link: null,
            frontend_details_url: "https://www.showpass.com/electronic-artist-calgary/",
            image: "https://example.cloudfront.net/media/images/events/example-music-hall/images/abc123.png",
            image_banner: "https://example.cloudfront.net/media/images/events/example-music-hall/img-banner/def456.png",
            thumbnail: "https://example.cloudfront.net/media/images/events/example-music-hall/images/abc123.png",
            inventory: null,
            inventory_sold_out: false,
            public_inventory_sold_out: false,
            low_ticket_inventory: 0,
            no_sub_items: false,
            opens_at: null,
            slug: "electronic-artist-calgary",
            sold_out: false,
            status: "sp_event_active",
            virtual_type: null,
            categories: ["music"],
            tags: ["electronic", "dance", "calgary", "live music"],
            sub_items: [
              {
                id: 3001,
                name: "Tier 2",
                price: "40.00",
                inventory_left: null,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "2.32",
                      total_price: "51.77",
                      service_charges: "9.45",
                      sum_custom_fees: [
                        {
                          name: "GST",
                          fee_total: "2.00"
                        },
                        {
                          name: "Processing Fee",
                          fee_total: "3.00"
                        }
                      ],
                      sum_internal_fees: "6.77",
                      total_price_no_tax: "49.45"
                    }
                  }
                }
              },
              {
                id: 3002,
                name: "Tier 1",
                price: "35.00",
                inventory_left: null,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "2.05",
                      total_price: "46.22",
                      service_charges: "9.17",
                      sum_custom_fees: [
                        {
                          name: "GST",
                          fee_total: "1.75"
                        },
                        {
                          name: "Processing Fee",
                          fee_total: "3.00"
                        }
                      ],
                      sum_internal_fees: "6.47",
                      total_price_no_tax: "44.17"
                    }
                  }
                }
              }
            ],
            location: {
              city: "Calgary",
              name: "The Palace Theatre",
              country: "Canada",
              position: "51.0454021,-114.0664228",
              province: "Alberta",
              postal_code: "T2P 1B5",
              street_name: "219 8 Ave SW"
            },
            point_location: "SRID=4326;POINT (-114.0664228 51.0454021)",
            is_sponsored: false,
            ranking_factor: "0.8915",
            artists: [
              {
                id: 366,
                name: "Example Electronic Artist",
                type: "person"
              }
            ],
            renewal_frequency: null
          },
          {
            uuid: "b2c3d4e5-f6g7-5890-b234-567890bcdefg",
            item_id: 1234002,
            type: "event",
            venue: {
              id: 1234,
              name: "Example Music Hall",
              slug: "example-music-hall",
              currency: "CAD",
              low_inventory_threshold_low: "0.50",
              low_inventory_threshold_middle: "0.60",
              low_inventory_threshold_high: "0.75",
              low_inventory_warning_enabled: false,
              all_in_pricing_is_enabled: true
            },
            venue_id: 1234,
            name: "Rock Band Live - Calgary",
            description_without_html: "",
            starts_on: "2025-08-20T03:00:00Z",
            ends_on: "2025-08-20T08:00:00Z",
            date_time_to_be_determined: null,
            timezone: "US/Mountain",
            is_recurring: null,
            is_recurring_parent: false,
            child_count: 0,
            external_link: null,
            frontend_details_url: "https://www.showpass.com/rock-band-calgary/",
            image: "https://example.cloudfront.net/media/images/events/example-music-hall/images/ghi789.png",
            image_banner: "https://example.cloudfront.net/media/images/events/example-music-hall/img-banner/jkl012.png",
            thumbnail: "https://example.cloudfront.net/media/images/events/example-music-hall/images/ghi789.png",
            inventory: null,
            inventory_sold_out: false,
            public_inventory_sold_out: false,
            low_ticket_inventory: 0,
            no_sub_items: false,
            opens_at: null,
            slug: "rock-band-calgary",
            sold_out: false,
            status: "sp_event_active",
            virtual_type: null,
            categories: ["music"],
            tags: ["rock", "live band", "calgary", "concert"],
            sub_items: [
              {
                id: 3003,
                name: "General Admission",
                price: "25.00",
                inventory_left: null,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "1.50",
                      total_price: "34.44",
                      service_charges: "7.94",
                      sum_custom_fees: [
                        {
                          name: "GST",
                          fee_total: "1.25"
                        },
                        {
                          name: "Processing Fee",
                          fee_total: "3.00"
                        }
                      ],
                      sum_internal_fees: "5.69",
                      total_price_no_tax: "32.94"
                    }
                  }
                }
              }
            ],
            location: {
              city: "Calgary",
              name: "The Palace Theatre",
              country: "Canada",
              position: "51.0454021,-114.0664228",
              province: "Alberta",
              postal_code: "T2P 1B5",
              street_name: "219 8 Ave SW"
            },
            point_location: "SRID=4326;POINT (-114.0664228 51.0454021)",
            is_sponsored: false,
            ranking_factor: "0.7209",
            artists: [
              {
                id: 2596,
                name: "Example Rock Band",
                type: "group"
              }
            ],
            renewal_frequency: null
          },
          {
            uuid: "c3d4e5f6-g7h8-6901-c345-678901cdefgh",
            item_id: 1234003,
            type: "event",
            venue: {
              id: 1234,
              name: "Example Music Hall",
              slug: "example-music-hall",
              currency: "CAD",
              low_inventory_threshold_low: "0.50",
              low_inventory_threshold_middle: "0.60",
              low_inventory_threshold_high: "0.75",
              low_inventory_warning_enabled: false,
              all_in_pricing_is_enabled: true
            },
            venue_id: 1234,
            name: "DJ Set - Free Event",
            description_without_html: "",
            starts_on: "2025-09-10T03:00:00Z",
            ends_on: "2025-09-10T08:00:00Z",
            date_time_to_be_determined: null,
            timezone: "US/Mountain",
            is_recurring: null,
            is_recurring_parent: false,
            child_count: 0,
            external_link: null,
            frontend_details_url: "https://www.showpass.com/dj-set-free/",
            image: "https://example.cloudfront.net/media/images/events/example-music-hall/images/mno345.png",
            image_banner: "https://example.cloudfront.net/media/images/events/example-music-hall/img-banner/pqr678.png",
            thumbnail: "https://example.cloudfront.net/media/images/events/example-music-hall/images/mno345.png",
            inventory: null,
            inventory_sold_out: false,
            public_inventory_sold_out: false,
            low_ticket_inventory: 0,
            no_sub_items: false,
            opens_at: null,
            slug: "dj-set-free",
            sold_out: false,
            status: "sp_event_active",
            virtual_type: null,
            categories: ["music"],
            tags: ["dj", "free event", "electronic", "calgary"],
            sub_items: [
              {
                id: 3004,
                name: "Free Entry with RSVP",
                price: "0.00",
                inventory_left: null,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "0.00",
                      total_price: "0.00",
                      service_charges: "0.00",
                      sum_custom_fees: [],
                      sum_internal_fees: "0.00",
                      total_price_no_tax: "0.00"
                    }
                  }
                }
              }
            ],
            location: {
              city: "Calgary",
              name: "The Palace Theatre",
              country: "Canada",
              position: "51.0454021,-114.0664228",
              province: "Alberta",
              postal_code: "T2P 1B5",
              street_name: "219 8 Ave SW"
            },
            point_location: "SRID=4326;POINT (-114.0664228 51.0454021)",
            is_sponsored: false,
            ranking_factor: "0.0189",
            artists: [
              {
                id: 1932,
                name: "Example DJ",
                type: "person"
              }
            ],
            renewal_frequency: null
          }
        ]
      }
    },
  },

  // Query Event API examples
  "/api/01-public-api-introduction": {
    endpoint: "https://www.showpass.com/api/public/discovery/",
    method: "GET",
    description: "Search for events using various criteria",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/discovery/?q=concert&location=Calgary" \\
-H "Content-Type: application/json"`,
      python: `import requests

params = {
    "q": "concert",
    "location": "Calgary"
}

response = requests.get(
    "https://www.showpass.com/api/public/discovery/",
    headers={"Content-Type": "application/json"},
    params=params
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/discovery/', {
  headers: { 'Content-Type': 'application/json' },
  params: {
    q: 'concert',
    location: 'Calgary'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`,
    },
    response: {
      status: 200,
      body: {
        count: 728,
        next: "https://www.showpass.com/api/public/discovery/?location=Calgary&page=2&page_size=1&q=concert",
        previous: null,
        next_page_number: 2,
        previous_page_number: null,
        page_number: 1,
        num_pages: 728,
        next_list: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        previous_list: [],
        results: [
          {
            uuid: "a1b2c3d4-e5f6-4789-a123-456789abcdef",
            item_id: 1234567,
            type: "event",
            venue: {
              id: 1234,
              name: "Example Music Hall",
              slug: "example-music-hall",
              currency: "CAD",
              low_inventory_threshold_low: "0.50",
              low_inventory_threshold_middle: "0.60",
              low_inventory_threshold_high: "0.75",
              low_inventory_warning_enabled: false,
              all_in_pricing_is_enabled: true
            },
            venue_id: 1234,
            name: "Summer Music Festival 2025",
            description_without_html: "Join us for an incredible summer music festival featuring multiple artists across various genres. This outdoor event will showcase local and international talent with food vendors, craft booths, and family-friendly activities. Gates open at 2:00 PM with performances starting at 3:00 PM. This is an all-ages event with designated areas for different age groups. Parking is available on-site for $10 per vehicle. No outside food or beverages permitted.",
            starts_on: "2025-07-15T19:00:00Z",
            ends_on: "2025-07-15T23:00:00Z",
            date_time_to_be_determined: null,
            timezone: "America/Edmonton",
            is_recurring: false,
            is_recurring_parent: false,
            child_count: 0,
            external_link: null,
            frontend_details_url: "https://www.showpass.com/summer-music-festival-2025/",
            image: "https://example.cloudfront.net/media/images/events/summer-festival/images/abc123.png",
            image_banner: "https://example.cloudfront.net/media/images/events/summer-festival/img-banner/def456.png",
            thumbnail: "https://example.cloudfront.net/media/images/events/summer-festival/thumbnail/ghi789.png",
            inventory: null,
            inventory_sold_out: false,
            public_inventory_sold_out: false,
            low_ticket_inventory: 0,
            no_sub_items: false,
            opens_at: null,
            slug: "summer-music-festival-2025",
            sold_out: false,
            status: "sp_event_active",
            virtual_type: null,
            categories: ["music", "fairs_and_festivals", "family_friendly"],
            tags: ["concert", "festival", "outdoor", "music", "summer", "family", "local artists"],
            sub_items: [
              {
                id: 3001,
                name: "General Admission",
                price: "35.00",
                inventory_left: 150,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "1.75",
                      total_price: "39.70",
                      service_charges: "2.95",
                      sum_custom_fees: [
                        {
                          name: "GST",
                          fee_total: "1.75"
                        }
                      ],
                      sum_internal_fees: "2.95",
                      total_price_no_tax: "37.95"
                    }
                  }
                }
              },
              {
                id: 3002,
                name: "VIP Experience",
                price: "85.00",
                inventory_left: 25,
                low_ticket_inventory: 0,
                fees_pricing_info: {
                  psp_web: {
                    "2": {
                      taxes: "4.25",
                      total_price: "93.20",
                      service_charges: "3.95",
                      sum_custom_fees: [
                        {
                          name: "GST", 
                          fee_total: "4.25"
                        }
                      ],
                      sum_internal_fees: "3.95",
                      total_price_no_tax: "88.95"
                    }
                  }
                }
              }
            ],
            location: {
              city: "Calgary",
              name: "Festival Grounds",
              country: "Canada",
              position: "51.0447,-114.0719",
              province: "Alberta",
              postal_code: "T2P 2M5",
              street_name: "123 Festival Way"
            },
            point_location: "SRID=4326;POINT (-114.0719 51.0447)",
            is_sponsored: false,
            ranking_factor: "8.5432",
            artists: null,
            renewal_frequency: null
          }
        ]
      }
    },
  },
};

export default apiExamplesMap;
