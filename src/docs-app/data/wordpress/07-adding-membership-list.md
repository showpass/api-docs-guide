# Adding a membership list with [showpass_memberships]

If your organization offers memberships through Showpass, you can showcase them on your WordPress site using the `[showpass_memberships]` shortcode. This makes it easy for visitors to see your membership options and sign up.

## Basic membership list

To add a basic membership list:

1.  Go to the WordPress page or post where you want to display your memberships.
2.  Add a "Shortcode" block.
3.  Type the following shortcode:

    `[showpass_memberships]`

By default, this will display your memberships in a grid layout, showing up to 20 membership groups per page.

## Customizing your membership list: Parameters

You can customize the layout and which memberships are displayed using these parameters:

- **`template="grid|data"`**

  - **Use Case**: To change the visual layout of your membership list.
  - **`"grid"` (Default)**: Displays memberships in a grid format. (Currently, "list" is not explicitly listed as an option for memberships in the readme, "grid" is the primary default mentioned).
  - **`"data"`**: Returns the raw membership data in JSON format. This is for advanced users who want to build completely custom templates with PHP. (See "Creating Custom Templates" for more info).
  - **Example**: `[showpass_memberships template="grid"]` (This is the default, but can be specified).

- **`page_size="number"`**

  - **Use Case**: To control how many membership groups are shown per page.
  - **Default**: `20`
  - **Example (Show 8 memberships per page)**: `[showpass_memberships page_size="8"]`

- **`membership_ids="id1,id2,id3"`**

  - **Use Case**: To display only a specific selection of membership groups, rather than all available ones.
  - **What it is**: A comma-separated list of Showpass Membership Group IDs. You can find these IDs in your Showpass dashboard when managing your memberships.
  - **Example (Display only membership groups with IDs 2, 6, and 7)**:
    `[showpass_memberships membership_ids="2,6,7"]`

- **`show_widget_description="true"`** (or `show_widget_description="false"`)
  - **Use Case**: To explicitly show or hide the description panel within the purchase widget if a membership is clicked. This overrides the global admin setting.
  - **Example**: `[showpass_memberships show_widget_description="true"]`

- **`lang="fr"`**
  - **Use Case**: To change the widget interface language to French when a membership from this list is clicked and opens a widget. If not specified, the widget will default to English.
  - **What it is**: A language code. Currently supports `"fr"` for French.
  - **Example**: `[showpass_memberships lang="fr"]`
  - **Important Note**: The `lang` parameter only affects the **purchase widgets**, not the membership list template itself. The default template is in English. For a fully French page, create a custom template using `template="data"` (see "Creating Custom Templates") and add `lang="fr"` to ensure widgets also open in French.

## Example: A customized membership list

Here's an example combining several parameters:

`[showpass_memberships page_size="10" membership_ids="15,25"]`

This shortcode would:

1.  Display membership groups in the default grid layout.
2.  Show 10 membership groups per page (`page_size="10"`).
3.  Only show membership groups with the IDs 15 and 25 (`membership_ids="15,25"`).

When a customer clicks on a membership option, the Showpass widget will typically open, allowing them to purchase the membership.
