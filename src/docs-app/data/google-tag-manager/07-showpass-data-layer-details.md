# Showpass Data Layer Details


This section provides detailed information about the ecommerce data that Showpass pushes to the Google Tag Manager (GTM) Data Layer. Understanding this structure is crucial for creating accurate variables, triggers, and tags in your GTM container.

## Data Layer Structure

Showpass follows the Google Analytics 4 (GA4) ecommerce Data Layer format. Events are pushed to the `dataLayer` object with specific parameters.

### Standard Event Format

```javascript
dataLayer.push({
  event: "event_name",
  ecommerce: {
    currency: "USD",
    value: 123.45,
    items: [
      // Array of item objects
    ],
  },
});
```

---

## Ecommerce Events and Parameters

Below is a detailed breakdown of each ecommerce event that Showpass sends to the Data Layer.

### view_item

**Description:** Fired when a user views an event or product detail page.

**Parameters:**

- **event:** `view_item`
- **ecommerce.currency:** String (e.g., `"USD"`, `"CAD"`)
- **ecommerce.value:** Number (total value of the items being viewed)
- **ecommerce.items:** Array of item objects

**Item Object Structure:**

```javascript
{
  item_id: "12345",           // Showpass event/product ID
  item_name: "Event Name",    // Event/product name
  item_category: "category",  // Event category (if applicable)
  price: 50.00,              // Individual item price
  quantity: 1                 // Quantity
}
```

---

### add_to_cart

**Description:** Fired when a user adds an item to their cart.

**Parameters:**

- **event:** `add_to_cart`
- **ecommerce.currency:** String (e.g., `"USD"`)
- **ecommerce.value:** Number (total value of items added)
- **ecommerce.items:** Array of item objects

**Item Object Structure:** Same as `view_item`

---

### remove_from_cart

**Description:** Fired when a user removes an item from their cart.

**Parameters:**

- **event:** `remove_from_cart`
- **ecommerce.currency:** String
- **ecommerce.value:** Number (value of items removed)
- **ecommerce.items:** Array of item objects

---

### begin_checkout

**Description:** Fired when a user initiates the checkout process.

**Parameters:**

- **event:** `begin_checkout`
- **ecommerce.currency:** String
- **ecommerce.value:** Number (total cart value)
- **ecommerce.items:** Array of item objects

---

### purchase

**Description:** Fired when a user completes a purchase.

**Parameters:**

- **event:** `purchase`
- **ecommerce.currency:** String
- **ecommerce.value:** Number (total transaction value)
- **ecommerce.transaction_id:** String (unique order/transaction ID)
- **ecommerce.items:** Array of item objects

**Item Object Structure for Purchase:**

```javascript
{
  item_id: "12345",
  item_name: "Event Name",
  item_category: "category",
  price: 50.00,
  quantity: 2
}
```

---

## Accessing Data Layer Variables in GTM

To access any of these parameters in your GTM tags and triggers, you need to create Data Layer Variables:

1. In GTM, go to **Variables**
2. Under "User-Defined Variables," click **New**
3. Choose **Data Layer Variable** as the type
4. Enter the exact Data Layer Variable Name (e.g., `ecommerce.value`, `ecommerce.currency`, `ecommerce.items`)
5. Save and use the variable in your tags

### Common Variables to Create

| Variable Name | Data Layer Path | Purpose |
| --- | --- | --- |
| **DLV - ecommerce.currency** | `ecommerce.currency` | Currency code for transactions |
| **DLV - ecommerce.value** | `ecommerce.value` | Monetary value of the event |
| **DLV - ecommerce.transaction_id** | `ecommerce.transaction_id` | Unique order ID for purchases |
| **DLV - ecommerce.items** | `ecommerce.items` | Array of product/event items |

---

## Example: Complete Data Layer Push

Here's an example of what Showpass pushes to the Data Layer for a `purchase` event:

```javascript
dataLayer.push({
  event: "purchase",
  ecommerce: {
    currency: "USD",
    value: 150.00,
    transaction_id: "TXN-789456123",
    items: [
      {
        item_id: "event_12345",
        item_name: "Summer Music Festival 2024",
        item_category: "Music Events",
        price: 75.00,
        quantity: 2
      }
    ]
  }
});
```

---

## Debugging the Data Layer

To verify that Showpass is correctly pushing data to the Data Layer:

1. **Open browser developer tools** (F12)
2. Go to the **Console** tab
3. Type `dataLayer` and press Enter to view the entire Data Layer array
4. Look for your ecommerce events in the array

Alternatively, use **GTM Preview Mode**:

1. Enable Preview mode in your GTM container
2. Navigate through your Showpass pages and perform actions
3. In the Tag Assistant panel, click on events in the timeline
4. View the "Data Layer" tab to see what data was pushed for each event

---

## Summary

- Showpass uses GA4-compliant ecommerce Data Layer format
- All ecommerce events include `currency`, `value`, and `items` parameters
- Purchase events additionally include `transaction_id`
- Create Data Layer Variables in GTM to access these values in your tags
- Always test and verify Data Layer pushes using browser console or GTM Preview mode
