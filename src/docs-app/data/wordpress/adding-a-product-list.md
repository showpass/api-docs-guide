# Adding a Product List with [showpass_products]

If you sell merchandise, add-ons, or other non-event items through Showpass, you can display them on your WordPress site using the `[showpass_products]` shortcode. This allows customers to browse and purchase your products easily.

## Basic Product List

To add a basic product list:

1.  Go to the WordPress page or post where you want to display your products.
2.  Add a "Shortcode" block.
3.  Type the following shortcode:

    `[showpass_products]`

By default, this will display your products in a grid layout, showing up to 20 products per page.

## Customizing Your Product List: Parameters

You can customize the layout and content of your product list using these parameters:

- **`template="grid|list|data"`**

  - **Use Case**: To change the visual layout of your product list.
  - **`"grid"` (Default)**: Displays products in a grid format.
  - **`"list"`**: Displays products in a vertical list format.
  - **`"data"`**: Returns the raw product data in JSON format. This is for advanced users who want to build completely custom templates with PHP. (See "Creating Custom Templates" for more info).
  - **Example (List View)**: `[showpass_products template="list"]`

- **`page_size="number"`**

  - **Use Case**: To control how many products are shown per page.
  - **Default**: `20`
  - **Example (Show 8 products per page)**: `[showpass_products page_size="8"]`

- **`product_ids="id1,id2,id3"`**

  - **Use Case**: To display only a specific selection of products, rather than all available products.
  - **What it is**: A comma-separated list of Showpass Product IDs. You can find these IDs in your Showpass dashboard when managing your products.
  - **Example (Display only products with IDs 2, 6, and 7)**:
    `[showpass_products product_ids="2,6,7"]`

- **`show_widget_description="true"`** (or `show_widget_description="false"`)
  - **Use Case**: To explicitly show or hide the description panel within the purchase widget if a product is clicked. This overrides the global admin setting.
  - **Example**: `[showpass_products show_widget_description="true"]`

## Example: A Customized Product List

Here's an example combining several parameters:

`[showpass_products template="list" page_size="12" product_ids="101,105,115"]`

This shortcode would:

1.  Display products in a list layout (`template="list"`).
2.  Show 12 products per page (`page_size="12"`).
3.  Only show products with the IDs 101, 105, and 115 (`product_ids="101,105,115"`).

When a customer clicks on a product, the Showpass widget will typically open, allowing them to add the product to their cart and purchase it.
