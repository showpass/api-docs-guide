# Showpass Data Layer Details

Understanding how Showpass interacts with the Data Layer is key to successfully configuring your tags and variables in Google Tag Manager (GTM). The Data Layer is a JavaScript object that GTM uses to receive information from your website or, in this case, from Showpass services.

## Dynamic Data Layer Naming

Showpass implements a dynamic naming convention for the Data Layer variable to support scenarios where multiple GTM containers or data layers might coexist on a page.

- If your GTM Container ID is, for example, `GTM-12345678`, the Data Layer variable name that Showpass will use and push data to will be:
  `dataLayer_GTM_12345678`

- The general format is: `dataLayer_GTM_YOUR-CONTAINER-ID` (replacing `YOUR-CONTAINER-ID` with your actual GTM ID without the `GTM-` prefix, or verify the exact name in your browser console). The provided example implies the `GTM-` prefix is _included_ in the variable name, so `dataLayer_GTM_12345678` is the format to expect.

**Important:** When you are setting up Data Layer Variables in GTM (as described in Section 6 for ecommerce parameters), you typically **do not need to specify this full dynamic name** in the "Data Layer Variable Name" field in GTM. GTM is designed to work with the concept of a "data layer" and will usually pick up pushes to any array named `dataLayer` or specifically named ones if configured correctly at a deeper GTM level or via custom JavaScript. For standard Data Layer Variable configuration in GTM, you just use the key name (e.g., `ecommerce.value`).

## Accessing the Showpass Data Layer with Custom JavaScript

If you need to access the Showpass-specific Data Layer directly within a **Custom JavaScript Variable** in GTM or a **Custom HTML tag** script, you would use its dynamic name:

```javascript
// Example: Accessing the Showpass specific dataLayer in a GTM Custom JavaScript Variable
// Replace GTM-12345678 with YOUR actual GTM Container ID
var specificDataLayer = window.dataLayer_GTM_12345678;

// You can then iterate over it or access its properties
if (specificDataLayer) {
  for (var i = 0; i < specificDataLayer.length; i++) {
    if (specificDataLayer[i].event === "purchase") {
      // Do something with the purchase event data
      // console.log(specificDataLayer[i]['ecommerce']['transaction_id']);
    }
  }
}
```

This is generally for more advanced use cases. For most standard tag configurations, relying on GTM's built-in Data Layer processing is sufficient.

## Ecommerce Events Pushed by Showpass

Showpass pushes data to this named Data Layer for the following standard ecommerce events. You can use these event names to create Custom Event triggers in GTM.

- `view_item`
- `add_to_cart`
- `remove_from_cart`
- `begin_checkout`
- `purchase`

For the parameters associated with each of these events (like `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`, `ecommerce.transaction_id`, etc.), please refer to the table provided at the end of **Section 6: Tracking Custom Conversions**.

## Verifying Data Layer Pushes

The best way to see exactly what data Showpass is pushing to the Data Layer and confirm the Data Layer variable name is:

1.  Use **GTM Preview Mode**.
2.  Perform actions on your Showpass pages or widget (e.g., add an item to cart).
3.  In the Tag Assistant debug panel, select an event in the timeline (e.g., `add_to_cart`).
4.  Switch to the **Data Layer** tab in Tag Assistant. This will show the state of the Data Layer _after_ that event occurred, including all the keys and values pushed by Showpass.
5.  You can also inspect `window.dataLayer_GTM_YOUR-CONTAINER-ID` in your browser's developer console.

Understanding this Showpass-specific Data Layer implementation is crucial for advanced debugging and custom JavaScript solutions within GTM.
