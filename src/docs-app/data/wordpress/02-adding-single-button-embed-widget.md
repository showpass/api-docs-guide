# Adding a single button or embeddable widget with [showpass_widget]

The Showpass WordPress Plugin allows you to easily add "Buy Now" buttons or embed a full purchase widget directly onto your WordPress pages and posts. This is done using the `[showpass_widget]` shortcode. This is perfect for quickly linking to a specific event, product, or membership, or even embedding the entire purchase experience on a dedicated page.

## What is a shortcode?

Think of a shortcode as a shortcut. It's a small piece of text wrapped in square brackets `[]` that WordPress replaces with dynamic content. In this case, it replaces the `[showpass_widget]` shortcode with a button or an embedded widget.

## How to add the `[showpass_widget]` shortcode

1.  Go to the WordPress page or post where you want to add the button or embedded widget.
2.  In the WordPress editor, find a place to add a new block. Click the "+" icon to add a new block.
3.  Search for the "Shortcode" block and add it. [3]

    ![Shortcode](/images/wordpress/shortcode.png)

4.  Inside the Shortcode block, type the `[showpass_widget]` shortcode with its parameters.
5.  Click **Update** or **Publish** on your page/post.

    ![Shortcode add](/images/wordpress/showpass-events.png)

Alternatively, you can often paste the shortcode directly into a standard Paragraph block.

## Basic button usage

To add a simple button that opens the Showpass purchase widget in a pop-up:

`[showpass_widget slug="your-event-slug"]`

- Replace `your-event-slug` with the actual slug (the part of the URL after `showpass.com/`) of your event. For example, if your event URL is `https://showpass.com/my-awesome-concert`, the slug is `my-awesome-concert`.

This will create a button with the default label "Tickets". When a user clicks it, the Showpass widget will open, allowing them to purchase tickets for that specific event.

## Embedding the widget directly on the page

If you want the purchase widget to appear directly on your page without a button click (embedded mode):

`[showpass_widget slug="your-event-slug" embedded="true"]`

This is great for creating dedicated ticket pages.

## Widget types: Events, products, and memberships

The `[showpass_widget]` can be used for more than just events. You can specify the type of item you want to link to using the `type` parameter:

`type="event"`: For event tickets (this is the default if you don't specify a type).

- Requires the `slug` parameter.
- Example: `[showpass_widget type="event" slug="annual-gala"]`
- Embedded Example: `[showpass_widget type="event" slug="annual-gala" embedded="true"]`

`type="product"`: For selling merchandise or other products.

- Requires the `id` parameter (the numerical ID of your product in Showpass).
- Example: `[showpass_widget type="product" id="12345"]`
- Embedded Example: `[showpass_widget type="product" id="12345" embedded="true"]`

`type="membership"`: For selling memberships.

- Requires the `id` parameter (the numerical ID of your membership in Showpass).
- Example: `[showpass_widget type="membership" id="67890"]`
- Embedded Example: `[showpass_widget type="membership" id="67890" embedded="true"]`

## Customizing your widget: Parameters

Parameters are like settings for your shortcode. You add them inside the square brackets to change how the button or widget behaves or looks. Each parameter is followed by an equals sign `=` and then a value in quotes `""`.

Here are the common parameters for `[showpass_widget]`:

**`slug="your-event-slug"`**

- **Use Case**: To link to a specific **event**. This is required when `type="event"` (or when no type is specified, as event is default).
- **What it is**: The unique identifier for your event found in its Showpass URL (e.g., if the URL is `showpass.com/halloween-party`, the slug is `halloween-party`).
- **Example**: `[showpass_widget slug="halloween-party"]`

**`id="12345"`**

- **Use Case**: To link to a specific **product** or **membership**. This is required when `type="product"` or `type="membership"`.
- **What it is**: The numerical ID of your product or membership group from your Showpass dashboard.
- **Example (Product)**: `[showpass_widget type="product" id="5021"]`
- **Example (Membership)**: `[showpass_widget type="membership" id="103"]`

**`label="Button Label"`**

- **Use Case**: To change the text displayed on the button. If not used, the button will say "Tickets". This parameter is ignored if `embedded="true"`.
- **Example**: `[showpass_widget slug="workshop-series" label="Register Now"]`

**`class="your-custom-class"`**

- **Use Case**: To apply custom CSS styling to the button. This is for users who want to change the button's appearance beyond the default Showpass style or basic WordPress theme styles. This parameter is ignored if `embedded="true"`.
- **Example**: `[showpass_widget slug="charity-run" class="special-button-style"]`

**`keep_shopping="false"`** (or `keep_shopping="true"`)

- **Use Case**: To change the text of the button that closes the pop-up purchase widget.
- **`"true"` (Default)**: The close button in the widget says "Keep Shopping".
- **`"false"`**: The close button in the widget says "Close".
- **Example**: `[showpass_widget slug="comedy-night" keep_shopping="false"]`

**`embedded="true"`** (or `embedded="false"`)

- **Use Case**: To display the widget directly on the page instead of as a button that opens a pop-up.
- **`"false"` (Default)**: A button is shown.
- **`"true"`**: The widget is embedded directly into the page content.
- **Example**: `[showpass_widget type="product" id="789" embedded="true"]`

**`show_widget_description="true"`** (or `show_widget_description="false"`)

- **Use Case**: To explicitly show or hide the description panel within the purchase widget. This setting will override the global setting configured on the Showpass API admin page in WordPress.
- **`"true"`**: Shows the description panel in the widget.
- **`"false"`**: Hides the description panel in the widget.
- **Example**: `[showpass_widget slug="concert-finale" show_widget_description="true"]`

**`show_specific_tickets="123,456"`**

- **Use Case**: When you have an event with multiple ticket types (e.g., General Admission, VIP, Early Bird) but you only want to offer specific ones through this particular button or embedded widget.
- **What it is**: A comma-separated list of Ticket Type IDs that you want to display. All other ticket types for that event will be hidden in this widget instance. The ticket types must be set to public in Showpass.
- **How to find Ticket Type IDs**: You'll find these in your Showpass dashboard when managing your event's ticket types.
- **Example**: `[showpass_widget slug="music-festival" show_specific_tickets="8001,8002"]` (This would only show ticket types with IDs 8001 and 8002 for the "music-festival" event).

**`lang="fr"`**

- **Use Case**: To change the widget interface language to French. If not specified, the widget will default to English.
- **What it is**: A language code. Currently supports `"fr"` for French.
- **Example**: `[showpass_widget slug="summer-fest" lang="fr"]`
- **Example (Embedded with French language)**: `[showpass_widget type="product" id="7734" embedded="true" lang="fr"]`

## Examples putting it all together:

**A button for an event called "Summer Fest" with custom label "Get Summer Fest Tickets!" and a red button style (assuming 'red-button' is a class in your CSS):**

`[showpass_widget slug="summer-fest" label="Get Summer Fest Tickets!" class="red-button"]`

**An embedded widget for a product with ID 7734, showing the widget description:**

`[showpass_widget type="product" id="7734" embedded="true" show_widget_description="true"]`

**A button for a membership (ID 205) that says "Join Our Club" and the widget's close button says "Close":**

`[showpass_widget type="membership" id="205" label="Join Our Club" keep_shopping="false"]`

Remember to replace the example slugs, IDs, and labels with your actual Showpass information!
