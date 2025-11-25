# Adding a pricing table

Display multiple events side-by-side in a pricing comparison table using the `[showpass_pricing_table]` shortcode. Perfect for comparing ticket prices, dates, and details across different events or ticket tiers.

---

## Basic usage

Add a pricing table to any page or post:

1. Open the WordPress page editor
2. Add a **Shortcode** block
3. Enter: `[showpass_pricing_table ids="123,456,789"]`

This displays a table comparing the specified events with their pricing information.

---

## Required parameters

### `ids="id1,id2,id3"`

**Parameter:** `ids` (required)

**Use case:** Specify which events to display in the pricing table.

**Value:** Comma-separated list of Showpass Event IDs (numeric)

**How to find Event IDs:**
1. Log in to your Showpass dashboard
2. Go to Events
3. Note the numeric ID next to each event name

**Example:**
```text
[showpass_pricing_table ids="254,288,292"]
```

**Important:** 
- Remove spaces between IDs: `"123,456"` not `"123, 456"`
- Events are displayed in the order you list them
- Only events that exist and are accessible will appear

---

## Optional parameters

### `show="all"`

**Parameter:** `show`

**Use case:** Filter which events are included (e.g., show all events including hidden ones).

**Default:** Only visible/published events

**Example:**
```text
[showpass_pricing_table ids="254,288,292" show="all"]
```

---

### `lang="fr"`

**Parameter:** `lang`

**Use case:** Set the widget interface language when users interact with purchase buttons in the table.

**Default:** English

**Supported values:** `fr` (French), or omit for English

**Example:**
```text
[showpass_pricing_table ids="254,288,292" lang="fr"]
```

**Note:** This affects the purchase widget language only, not the table content itself.

---

### `show_event_details="true|false"`

**Parameter:** `show_event_details`

**Use case:** Control whether event details (date, time, location, etc.) are displayed in the table.

**Default:** `true` (details are shown)

**Example (hide event details):**
```text
[showpass_pricing_table ids="254,288,292" show_event_details="false"]
```

---

### `show_event_description="true|false"`

**Parameter:** `show_event_description`

**Use case:** Control whether event descriptions are displayed in the pricing table.

**Default:** `true` (descriptions are shown)

**Example (hide descriptions):**
```text
[showpass_pricing_table ids="254,288,292" show_event_description="false"]
```

---

### `show_widget_description="true|false"`

**Parameter:** `show_widget_description`

**Use case:** Override the global admin setting for whether the purchase widget's description panel is shown when users click purchase buttons in the table.

**Default:** Uses the global admin setting (`option_show_widget_description`)

**Example:**
```text
[showpass_pricing_table ids="254,288,292" show_widget_description="true"]
```

---

## Complete example

Combine multiple parameters for a fully customized pricing table:

```text
[showpass_pricing_table 
  ids="254,288,292" 
  lang="fr" 
  show_event_details="true" 
  show_event_description="false" 
  show_widget_description="true"
]
```

This configuration will:
- Display events **254**, **288**, and **292** in order
- Show purchase widgets in **French**
- Display **event details** (date, time, location)
- **Hide** event descriptions
- **Show** widget descriptions when users click purchase buttons

---

## Use cases

### Compare ticket tiers

Display different ticket types for the same event or compare similar events:

```text
[showpass_pricing_table ids="vip-event,general-event,student-event"]
```

### Package deals

Show multiple related events together (e.g., festival passes, multi-day events):

```text
[showpass_pricing_table ids="day1,day2,day3" show_event_details="true"]
```

### Seasonal pricing

Compare events across different seasons or time periods:

```text
[showpass_pricing_table ids="spring-event,summer-event,fall-event"]
```

---

## Styling the pricing table

The pricing table uses default Showpass styles. To customize:

1. Go to **Appearance → Customize → Additional CSS**
2. Add custom CSS targeting the pricing table elements

**Example CSS:**
```css
.showpass-pricing-table {
    border-collapse: collapse;
    width: 100%;
}

.showpass-pricing-table th {
    background-color: #9e2a2b;
    color: white;
    padding: 12px;
}

.showpass-pricing-table td {
    padding: 10px;
    border: 1px solid #ddd;
}
```

---

## Troubleshooting

### Table is empty or shows wrong events

- **Verify Event IDs:** Check that the IDs exist in your Showpass dashboard
- **Check event status:** Events must be published/visible to appear
- **Remove spaces:** Ensure no spaces in the `ids` parameter: `"123,456"` not `"123, 456"`

### Events appear in wrong order

- Events are displayed in the exact order you list them in the `ids` parameter
- If an event ID doesn't exist, it's skipped but doesn't affect the order of others

### Purchase buttons don't work

- **Check domain whitelisting:** Your WordPress domain must be whitelisted in Showpass dashboard
- **Verify Organization ID:** Ensure your Organization ID is set correctly in plugin settings
- **Test widget separately:** Try using `[showpass_widget]` on the same page to verify widgets work

---

## Next steps

Now that you know how to create pricing tables, explore:

- **[Adding event lists](./03-adding-event-list)** – Display multiple events in grid/list format
- **[Adding a single button widget](./02-adding-single-button-embed-widget)** – Create individual purchase buttons
- **[Creating custom templates](./11-creating-custom-templates)** – Build completely custom layouts

---

## Additional resources

- **Showpass Help Center:** [help.showpass.com](https://help.showpass.com/hc/en-us)
- **WordPress Shortcode documentation:** [codex.wordpress.org/Shortcode](https://codex.wordpress.org/Shortcode)

