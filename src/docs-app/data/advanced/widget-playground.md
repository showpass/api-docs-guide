# Widget Playground

This page demonstrates how to use the Widget Playground component to showcase interactive widgets.

## Button Widget

Below is an example of a Button widget playground. You can modify the properties using the controls tab and see the changes in real-time in the preview tab.

```widget-playground
{
  "type": "button",
  "props": {
    "variant": "default",
    "size": "default",
    "children": "Click Me",
    "disabled": false
  }
}
```

## How to Use Widget Playground

To add a widget playground to your markdown content, use a code block with the language `widget-playground` and provide a JSON configuration object with the following properties:

- `type`: The type of widget to display (e.g., "button")
- `props`: An object containing the initial properties for the widget

Example:

````markdown
```widget-playground
{
  "type": "button",
  "props": {
    "variant": "default",
    "size": "default",
    "children": "Click Me",
    "disabled": false
  }
}
```
````

## Card Widget

Below is an example of a Card widget playground. You can modify the properties using the controls tab and see the changes in real-time in the preview tab.

```widget-playground
{
  "type": "card",
  "props": {
    "showHeader": true,
    "title": "Example Card",
    "description": "This is a description of the card",
    "content": "This is the main content of the card. You can customize this text using the controls."
  }
}
```

## Supported Widget Types

Currently, the following widget types are supported:

- `button`: A button widget with customizable variant, size, text, and disabled state
- `card`: A card widget with customizable header, title, description, and content

## Adding More Widget Types

To add support for more widget types, modify the `WidgetPlayground` component to include additional cases in the `renderWidget` and `renderControls` functions.

## Direct Widget Rendering

You can also embed functional widgets directly in your markdown content without the playground interface. This allows you to create interactive documentation with widgets that users can interact with.

To add a direct widget to your markdown content, use a code block with the language `widget` and provide a JSON configuration object with the following properties:

- `type`: The type of widget to display (e.g., "button", "card")
- `props`: An object containing the properties for the widget

### Button Widget Example

Here's an example of a directly rendered button widget:

```widget
{
  "type": "button",
  "props": {
    "variant": "default",
    "size": "default",
    "children": "Click Me!",
    "alert": "You clicked the button! This is a custom alert message.",
    "className": "shadow-md hover:shadow-lg transition-shadow"
  }
}
```

### Card Widget Example

Here's an example of a directly rendered card widget:

```widget
{
  "type": "card",
  "props": {
    "showHeader": true,
    "title": "Interactive Card",
    "description": "This card is rendered directly in the markdown content",
    "content": "You can use these widgets to create interactive documentation that demonstrates your components in action.",
    "className": "max-w-md mx-auto shadow-lg"
  }
}
```

### Interactive Card with Buttons

You can create even more interactive cards by adding buttons to them:

```widget
{
  "type": "card",
  "props": {
    "showHeader": true,
    "title": "Feature Card",
    "description": "A card with interactive buttons",
    "content": "This card demonstrates how you can add interactive buttons to your cards. Click the buttons below to see them in action!",
    "className": "max-w-md mx-auto shadow-xl border-t-4 border-t-blue-500",
    "buttons": [
      {
        "text": "Learn More",
        "variant": "default",
        "size": "default",
        "alert": "You clicked Learn More! This would typically link to more detailed documentation.",
        "className": "bg-blue-600 hover:bg-blue-700"
      },
      {
        "text": "Try it Now",
        "variant": "outline",
        "size": "default",
        "alert": "You clicked Try it Now! This would typically start a tutorial or demo.",
        "className": "text-blue-600 border-blue-600 hover:bg-blue-50"
      }
    ]
  }
}
```

### Interactive Button Examples

Here are some examples of interactive buttons with different variants:

```widget
{
  "type": "button",
  "props": {
    "variant": "destructive",
    "size": "lg",
    "children": "Destructive Button",
    "alert": "You clicked the destructive button!"
  }
}
```

```widget
{
  "type": "button",
  "props": {
    "variant": "outline",
    "size": "sm",
    "children": "Outline Button",
    "alert": "You clicked the outline button!"
  }
}
```

## Advanced Widget Examples

### Product Card Example

Here's an example of a more complex card that simulates a product card with multiple interactive elements:

```widget
{
  "type": "card",
  "props": {
    "showHeader": true,
    "title": "Premium API Package",
    "description": "Best for growing businesses",
    "content": "Get unlimited API calls, priority support, and advanced analytics. Perfect for businesses that need reliable API access with premium features.",
    "className": "max-w-md mx-auto shadow-xl rounded-xl overflow-hidden border border-gray-200",
    "buttons": [
      {
        "text": "Start Free Trial",
        "variant": "default",
        "size": "lg",
        "alert": "Free trial started! In a real application, this would initiate a trial signup process.",
        "className": "w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      },
      {
        "text": "View Documentation",
        "variant": "ghost",
        "size": "default",
        "alert": "Viewing documentation! This would typically link to detailed API documentation.",
        "className": "w-full mt-2"
      },
      {
        "text": "Compare Plans",
        "variant": "link",
        "size": "default",
        "alert": "Comparing plans! This would show a comparison of different API plans.",
        "className": "w-full mt-2"
      }
    ]
  }
}
```

This example demonstrates how you can create rich, interactive widgets that not only showcase your components but also provide a realistic preview of how they might be used in a real application.

## Showpass Widget Examples

The following examples demonstrate how to use the Widget Playground with Showpass-specific widgets. These examples are designed to match the actual Showpass widget interface.

### Showpass Cart Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "cart",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "keepShopping": true,
    "embedded": false,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Checkout Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "checkout",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "purchaseSource": "psp_widget",
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Calendar Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "calendar",
    "organizerId": "tiger-tiger",
    "eventTags": "festivals,community",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "embedded": true,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Event Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "event",
    "eventId": "bad-friends-calgary",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "ticketTypeSelectionRequired": true,
    "promptForQuantity": true,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Product Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "product",
    "productId": "12345",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Membership Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "membership",
    "membershipId": "67890",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

### Showpass Login Widget

```widget
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "login",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "className": "shadow-lg rounded-md overflow-hidden"
  }
}
```

## Showpass Widget Playground

You can also use the Widget Playground to interactively customize Showpass widgets:

```widget-playground
{
  "type": "showpass-widget",
  "props": {
    "widgetType": "event",
    "eventId": "bad-friends-calgary",
    "background": "#ffffff",
    "primaryColor": "#dd3333",
    "darkTheme": false,
    "ticketTypeSelectionRequired": false,
    "promptForQuantity": false
  }
}
```
