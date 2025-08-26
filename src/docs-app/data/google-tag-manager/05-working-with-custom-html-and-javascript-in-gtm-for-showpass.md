# 5. Working with custom HTML & JavaScript in GTM for Showpass

When using Google Tag Manager (GTM) with Showpass, you might need to implement Custom HTML tags for third-party tracking pixels or other custom JavaScript functionalities. Due to Showpass's security settings, there are specific configurations required to ensure these custom scripts load and fire correctly.

## The `nonce` requirement for custom scripts

Showpass employs security measures that can block inline scripts or scripts loaded without proper attributes. To allow your GTM Custom HTML/JavaScript tags to execute:

- You **must** add a `nonce` attribute to all `<script>` opening tags within your Custom HTML tags in GTM.
- This `nonce` value will be dynamically provided by Showpass through a GTM variable you'll set up.

### Step 1: Set up the `nonce` variable in GTM

This variable will read a dynamic nonce value that Showpass makes available on the page.

1.  In your GTM container, navigate to **Variables**.
2.  Under "User-Defined Variables," click **New**.
3.  **Name your variable:** `nonce` (lowercase is conventional).
4.  **Variable Configuration:**
    - Click **Choose a variable type to begin setup...**
    - Select **DOM Element**.
    - **Selection Method:** Choose **CSS Selector**.
    - **Element Selector:** Enter `meta[name='csp-nonce']`
      - _This is a CSS selector that targets the meta tag Showpass uses to provide the nonce value._
    - **Attribute Name:** Enter `content`
      - _This is the content attribute on the meta tag that will hold the nonce string._
5.  Click **Save**.

### Step 2: Update your custom HTML tags

For every Custom HTML tag in GTM that contains a `<script>...</script>` block, you need to modify the opening `<script>` tag.

1.  Go to the **Tags** section in GTM and open the Custom HTML tag you want to edit.
2.  Locate the opening `<script>` tag.
3.  Add the `nonce` attribute, using the GTM variable you just created: `nonce="{{nonce}}"`.

    **Example:**

    - **Before:**

      ```html
      <script>
        // Your custom JavaScript code
        console.log("My custom script is running!");
      </script>
      ```

    - **After:**
      ```html
      <script nonce="{{nonce}}">
        // Your custom JavaScript code
        console.log("My custom script is running!");
      </script>
      ```

4.  Click **Save** for the tag.
5.  Repeat this for all Custom HTML tags that include `<script>` elements.

## Enable `document.write` (if required by your script)

Some older third-party scripts might use `document.write`. If your Custom HTML tag requires this:

1.  Edit your Custom HTML tag.
2.  Under **Advanced Settings**, check the box for **Support document.write**.
    _(Image Placeholder: Screenshot of GTM Custom HTML tag settings showing "Support document.write" checkbox.)_
3.  Click **Save**.

## Final steps

1.  **Save All Changes:** Ensure all your updated tags and the new `nonce` variable are saved.
2.  **Publish Your GTM Container:**
    - Click **Submit** in GTM.
    - Provide a version name and description.
    - Click **Publish**.
3.  **Test Thoroughly:**
    - Load pages where your GTM container is active.
    - Open your browser's developer console (usually by pressing F12 and going to the "Console" tab).
    - Look for any errors. If scripts are blocked due to security policies, you might see specific error messages. Ensure your custom scripts are firing as expected.

By correctly implementing the `nonce` variable and updating your script tags, your Custom HTML and JavaScript tags in GTM should function correctly within the Showpass environment.
