# List experiences by organization

## Overview

Returns public experiences for one or more Showpass organizations. Supports venue calendars, organizer pages, and partner listings.

---

## Endpoint

**Single organization:**
```text
https://www.showpass.com/api/public/discovery/?venue=ORGANIZATION_ID
```

**Multiple organizations:**
```text
https://www.showpass.com/api/public/discovery/?venue__in=ORGANIZATION_ID1,ORGANIZATION_ID2
```

Replace `ORGANIZATION_ID` with your numerical organization ID.

---

## Finding Your Organization ID

1. Log in to your Showpass account
2. Open your venue settings: `https://www.showpass.com/dashboard/venues/edit/`
3. Your Organization ID is displayed in the top right corner

---

## Common Queries

**Single organization:**
```text
https://www.showpass.com/api/public/discovery/?venue=123
```

**Multiple organizations:**
```text
https://www.showpass.com/api/public/discovery/?venue__in=123,456,789
```

**Upcoming events only:**
```text
https://www.showpass.com/api/public/discovery/?venue=123&starts_on__gte=2025-01-01T00:00:00
```

**Homepage list (next 5 upcoming events):**
```text
https://www.showpass.com/api/public/discovery/?venue=123&starts_on__gte=2025-01-01T00:00:00&ordering=starts_on&page_size=5
```

---

## Combine With Other Filters

You can combine `venue` or `venue__in` with the same filters used by the Discovery API:

- **Date filters**: `starts_on__gte`, `starts_on__lte`, `ends_on__gte`, `ends_on__lt`
- **Search**: `search_string`
- **Categories & tags**: `categories`, `tags`
- **Filtering**: `is_sponsored`, `showpass_gift_card`
- **Pagination**: `page_size`, `page`
- **Ordering**: `ordering`

---

## Important Notes

- **Domain whitelisting required**: Add your domain in the "Integrations" tab of your venue edit page
- **Parent experiences only by default**: Add `only_parents=false` to include recurring event instances
- **Default pagination**: 20 results per page
