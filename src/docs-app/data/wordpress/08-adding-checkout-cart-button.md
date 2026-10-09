# Adding a shopping cart button

Use `[showpass_cart_button]` to give customers a way back to their Showpass basket. It opens the cart and checkout interface so they can review selected items and complete their purchase. The Showpass script updates the label with the item count, for example **Shopping Cart (3)**.

## Add the button

In the WordPress page or post editor, add a **Shortcode** block and enter:

```text
[showpass_cart_button]
```

The button opens checkout in a modal. Place it somewhere customers can find after browsing your event or calendar widgets, such as a shared header or sidebar. Check that your theme supports shortcodes in the chosen location.

## Use a dedicated checkout page

To display checkout inline instead of as a button, use:

```text
[showpass_cart_button embedded="true"]
```

Use this as the checkout interface on its own page.

## Parameters

| Parameter | Purpose | Default |
| --- | --- | --- |
| `embedded` | `"true"` displays checkout inline; `"false"` displays a button that opens a modal | `"false"` |
| `lang` | `"fr"` displays the interface in French | English |

For example:

```text
[showpass_cart_button lang="fr"]
```

## Shared-basket limitations

A cart button provides access to the basket; it does not synchronize several inline widgets. Do not use multiple inline SDK widgets on the same page unless using Showpass Website Builder.

For customers browsing several offerings, use [purchase buttons](/wordpress/adding-single-button-embed-widget) and [calendar buttons](/wordpress/adding-calendar-widget) that open modals, with a visible cart button. Test that selected items appear together before checkout. See [Multiple widgets and a shared basket](/sdk/ticket-purchase-widget#multiple-widgets-and-a-shared-basket) for layout guidance.
