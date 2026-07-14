# Discovery API to purchase widget

Read this reference when an organizer site uses public Showpass data for event cards and opens a Showpass purchase widget from those cards.

## Keep the boundary clear

- Fetch display data from https://www.showpass.com/api/public/discovery/.
- Use an event result's slug with eventPurchaseWidget(slug, params).
- Let the SDK own purchase, cart, checkout, iframe navigation, and payment-return behavior.
- Never turn API fields into hand-built widget or checkout URLs.

The Discovery API is public and requires no token. Browser requests must come from a domain allowlisted in the organizer's Showpass integration settings. If browser CORS is not configured, fetch through the application's server and keep the same response validation and cache policy.

## Organizer query

Build the URL with URLSearchParams instead of concatenating untrusted values:

~~~ts
const url = new URL("https://www.showpass.com/api/public/discovery/");
url.searchParams.set("venue", String(venueId));
url.searchParams.set("starts_on__gte", new Date().toISOString());
url.searchParams.set("ordering", "starts_on");
url.searchParams.set("page_size", "12");
~~~

Use venue__in for an intentional multi-organization listing. The default page size is 20. Set only_parents=false only when the design needs individual recurring instances as separate cards.

## Minimal response model

Keep the application type smaller than the complete API response:

~~~ts
interface DiscoveryTicketType {
  id: number;
  name: string | null;
  price: string | null;
  inventory_left?: number | null;
}

interface DiscoveryEvent {
  uuid?: string;
  item_id: number;
  type: "event";
  name: string;
  slug: string;
  description_without_html?: string;
  starts_on: string;
  ends_on?: string;
  timezone: string;
  date_time_to_be_determined?: boolean | null;
  frontend_details_url?: string;
  image?: string | null;
  image_banner?: string | null;
  sold_out?: boolean;
  inventory_sold_out?: boolean;
  public_inventory_sold_out?: boolean;
  is_recurring_parent?: boolean;
  sub_items?: DiscoveryTicketType[];
  venue?: {
    id: number;
    name: string;
    slug: string;
    currency: string;
    all_in_pricing_is_enabled?: boolean;
  };
  location?: {
    name?: string;
    city?: string;
    province?: string;
    country?: string;
  } | null;
}

interface DiscoveryPage {
  results: unknown[];
}
~~~

Treat network JSON as unknown at the boundary. Verify the page shape and every field retained by the application rather than casting the response.

## Fetch and normalize

~~~ts
const DISCOVERY_URL = "https://www.showpass.com/api/public/discovery/";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDiscoveryPage(value: unknown): value is DiscoveryPage {
  return isRecord(value) && Array.isArray(value.results);
}

function isOptionalString(value: unknown) {
  return value === undefined || typeof value === "string";
}

function isOptionalBoolean(value: unknown) {
  return value === undefined || typeof value === "boolean";
}

function isTicketType(value: unknown): value is DiscoveryTicketType {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    (value.name === null || typeof value.name === "string") &&
    (value.price === null || typeof value.price === "string") &&
    (value.inventory_left === undefined ||
      value.inventory_left === null ||
      (typeof value.inventory_left === "number" &&
        Number.isFinite(value.inventory_left)))
  );
}

function isVenue(value: unknown): value is NonNullable<DiscoveryEvent["venue"]> {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    typeof value.name === "string" &&
    typeof value.slug === "string" &&
    typeof value.currency === "string" &&
    isOptionalBoolean(value.all_in_pricing_is_enabled)
  );
}

function isLocation(
  value: unknown,
): value is NonNullable<DiscoveryEvent["location"]> {
  return (
    isRecord(value) &&
    isOptionalString(value.name) &&
    isOptionalString(value.city) &&
    isOptionalString(value.province) &&
    isOptionalString(value.country)
  );
}

function isUsableEvent(item: unknown): item is DiscoveryEvent {
  return (
    isRecord(item) &&
    item.type === "event" &&
    typeof item.item_id === "number" &&
    Number.isFinite(item.item_id) &&
    typeof item.name === "string" &&
    Boolean(item.name.trim()) &&
    typeof item.slug === "string" &&
    Boolean(item.slug.trim()) &&
    typeof item.starts_on === "string" &&
    Number.isFinite(Date.parse(item.starts_on)) &&
    typeof item.timezone === "string" &&
    Boolean(item.timezone.trim()) &&
    isOptionalString(item.uuid) &&
    isOptionalString(item.description_without_html) &&
    isOptionalString(item.ends_on) &&
    (item.date_time_to_be_determined === undefined ||
      item.date_time_to_be_determined === null ||
      typeof item.date_time_to_be_determined === "boolean") &&
    isOptionalString(item.frontend_details_url) &&
    (item.image === undefined ||
      item.image === null ||
      typeof item.image === "string") &&
    (item.image_banner === undefined ||
      item.image_banner === null ||
      typeof item.image_banner === "string") &&
    isOptionalBoolean(item.sold_out) &&
    isOptionalBoolean(item.inventory_sold_out) &&
    isOptionalBoolean(item.public_inventory_sold_out) &&
    isOptionalBoolean(item.is_recurring_parent) &&
    (item.sub_items === undefined ||
      (Array.isArray(item.sub_items) && item.sub_items.every(isTicketType))) &&
    (item.venue === undefined || isVenue(item.venue)) &&
    (item.location === undefined ||
      item.location === null ||
      isLocation(item.location))
  );
}

export async function fetchOrganizerEvents(
  venueId: number,
  signal?: AbortSignal,
) {
  const url = new URL(DISCOVERY_URL);
  url.searchParams.set("venue", String(venueId));
  url.searchParams.set("starts_on__gte", new Date().toISOString());
  url.searchParams.set("ordering", "starts_on");
  url.searchParams.set("page_size", "12");

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error("Discovery API returned " + response.status);
  }

  const payload: unknown = await response.json();
  if (!isDiscoveryPage(payload)) {
    throw new Error("Discovery API returned an unexpected response");
  }

  return payload.results
    .filter(isUsableEvent)
    .sort((left, right) => {
      const dateOrder =
        Date.parse(left.starts_on) - Date.parse(right.starts_on);
      return dateOrder || left.name.localeCompare(right.name);
    });
}
~~~

Abort the request when its page or component unmounts. Show visible loading, empty, and error states. If a curated fallback is useful for a marketing page, do not present stale inventory or sold-out status as live data.

## Render data safely

- Use uuid when present for a stable list key; otherwise combine type and item_id.
- Render name and description as framework text. Do not inject description strings with unsanitized innerHTML.
- Prefer image_banner for wide artwork and image or thumbnail for cards. Supply an intentional fallback and useful alt text only when the image itself conveys information.
- Format starts_on in the event timezone with Intl.DateTimeFormat. Do not assume the browser timezone matches the venue.
- Treat date_time_to_be_determined as a product state, not as a formatting error.
- Disable or relabel the purchase action when any relevant sold-out field is true, but let the widget remain the final source of live availability.
- Keep the API's deterministic ordering or apply an explicit stable sort. Do not make layout meaning depend on incidental response order.

## Price labels

The sub_items price is a base ticket price represented as a decimal string. A safe card label is "From" plus the lowest valid base price, formatted with venue.currency.

The nested fees_pricing_info data varies by payment route and purchase context. Do not select an arbitrary nested total and present it as universally payable. When all-in pricing is required, confirm the exact API contract for the organizer and route; otherwise let the purchase widget display the authoritative total.

## Open the event widget

~~~ts
import { loadShowpassSdk } from "./showpass-sdk";

async function openEvent(event: DiscoveryEvent) {
  const tickets = await loadShowpassSdk();
  await tickets.eventPurchaseWidget(event.slug, {
    "theme-primary": "#24727b",
  });
}
~~~

For a recurring parent returned by the API, keep using the returned slug and let the Showpass flow present its available choices. If the surrounding UI promises one exact performance, fetch or select that specific instance rather than relabeling a parent card.

The API-provided frontend_details_url can be used as an ordinary progressive fallback link. It is not a substitute for an embedded SDK integration and should not be rewritten into an iframe route.
