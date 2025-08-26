import React, { useState } from "react";
import { Button } from "@/shared/components/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/select.tsx";
import { Input } from "@/shared/components/input.tsx";
import { Switch } from "@/shared/components/switch.tsx";
import { Label } from "@/shared/components/label.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/tabs.tsx";

interface WidgetPlaygroundProps {
  widgetType: string;
  initialProps?: Record<string, any>;
}

const WidgetPlayground: React.FC<WidgetPlaygroundProps> = ({ 
  widgetType, 
  initialProps = {} 
}) => {
  // State to track the current widget props
  const [widgetProps, setWidgetProps] = useState(initialProps);

  // Function to update a specific prop
  const updateProp = (propName: string, value: any) => {
    setWidgetProps(prev => ({
      ...prev,
      [propName]: value
    }));
  };

  // Render the appropriate widget based on widgetType
  const renderWidget = () => {
    switch (widgetType) {
      case "button":
        return (
          <Button
            variant={widgetProps.variant || "default"}
            size={widgetProps.size || "default"}
            disabled={widgetProps.disabled || false}
            {...widgetProps}
          >
            {widgetProps.children || "Button Text"}
          </Button>
        );
      case "card":
        return (
          <Card className={widgetProps.className || ""} style={{ maxWidth: "400px" }}>
            {widgetProps.showHeader && (
              <CardHeader>
                <CardTitle>{widgetProps.title || "Card Title"}</CardTitle>
                {widgetProps.description && (
                  <CardDescription>{widgetProps.description}</CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent>
              {widgetProps.content || "Card Content"}
            </CardContent>
          </Card>
        );
      case "widgets-widget":
        return (
          <div 
            className={`border rounded-md overflow-hidden ${widgetProps.className || ""}`}
            style={{ 
              backgroundColor: widgetProps.background || "#ffffff",
              color: widgetProps.darkTheme ? "#ffffff" : "#333333",
              maxWidth: "100%"
            }}
          >
            {/* Widget Header */}
            <div 
              className="p-3 flex items-center justify-between"
              style={{ 
                backgroundColor: widgetProps.primaryColor || "#dd3333",
                color: "#ffffff"
              }}
            >
              <div className="font-medium">Showpass {widgetProps.widgetType || "Widget"}</div>
              <div className="text-sm">
                {widgetProps.embedded ? "Embedded" : "Modal"}
              </div>
            </div>

            {/* Widget Content */}
            <div className="p-4">
              {/* Widget Type Specific Content */}
              {widgetProps.widgetType === "cart" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Cart Items</div>
                    <div className="text-sm font-medium">0 items</div>
                  </div>
                  <div className="text-center py-6 text-gray-500">Your cart is empty</div>
                  {widgetProps.keepShopping && (
                    <Button 
                      className="w-full"
                      style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                      onClick={() => alert("Keep shopping clicked!")}
                    >
                      Keep Shopping
                    </Button>
                  )}
                </div>
              )}

              {widgetProps.widgetType === "checkout" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Checkout</div>
                    <div className="text-sm font-medium">Purchase Source: {widgetProps.purchaseSource || "psp_widget"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Order Summary</div>
                    <div className="text-sm text-gray-500">No items in cart</div>
                  </div>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                    onClick={() => alert("Proceed to checkout clicked!")}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              )}

              {widgetProps.widgetType === "calendar" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Calendar</div>
                    <div className="text-sm font-medium">Organizer: {widgetProps.organizerId || "tiger-tiger"}</div>
                  </div>
                  {widgetProps.eventTags && (
                    <div className="text-sm">
                      <span className="font-medium">Event Tags:</span> {widgetProps.eventTags}
                    </div>
                  )}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
                      <div key={i} className="text-xs font-medium p-1">{day}</div>
                    ))}
                    {Array.from({ length: 30 }, (_, i) => (
                      <div 
                        key={i} 
                        className={`p-1 text-xs rounded ${i % 7 === 0 || i % 7 === 6 ? "bg-gray-100" : ""} ${i === 14 ? "bg-blue-100 font-medium" : ""}`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {widgetProps.widgetType === "event" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Event</div>
                    <div className="text-sm font-medium">ID: {widgetProps.eventId || "event-id"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Event Details</div>
                    <div className="text-sm">
                      {widgetProps.ticketTypeSelectionRequired && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Ticket Selection Required</span>
                        </div>
                      )}
                      {widgetProps.promptForQuantity && (
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Prompt For Quantity</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                    onClick={() => alert("Get Tickets clicked!")}
                  >
                    Get Tickets
                  </Button>
                </div>
              )}

              {widgetProps.widgetType === "product" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Product</div>
                    <div className="text-sm font-medium">ID: {widgetProps.productId || "product-id"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Product Details</div>
                    <div className="text-sm text-gray-500">Sample product description</div>
                  </div>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                    onClick={() => alert("Add to Cart clicked!")}
                  >
                    Add to Cart
                  </Button>
                </div>
              )}

              {widgetProps.widgetType === "membership" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Membership</div>
                    <div className="text-sm font-medium">ID: {widgetProps.membershipId || "membership-id"}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Membership Details</div>
                    <div className="text-sm text-gray-500">Sample membership description</div>
                  </div>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                    onClick={() => alert("Purchase Membership clicked!")}
                  >
                    Purchase Membership
                  </Button>
                </div>
              )}

              {widgetProps.widgetType === "login" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <div>Login</div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Sign in to your account</div>
                    <div className="space-y-2">
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full p-2 border rounded"
                        readOnly
                      />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-2 border rounded"
                        readOnly
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                    onClick={() => alert("Login clicked!")}
                  >
                    Login
                  </Button>
                </div>
              )}

              {/* Default content if widget type not specified */}
              {!widgetProps.widgetType && (
                <div className="text-center py-4">
                  <div className="font-medium">Showpass Widget</div>
                  <div className="text-sm text-gray-500">Widget type not specified</div>
                </div>
              )}
            </div>

            {/* Widget Footer */}
            <div className="p-2 text-center text-xs text-gray-500 border-t">
              Powered by Showpass
            </div>
          </div>
        );
      // Add cases for other widget types as needed
      default:
        return <div>Unknown widget type: {widgetType}</div>;
    }
  };

  // Render the appropriate controls based on widgetType
  const renderControls = () => {
    switch (widgetType) {
      case "button":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variant">Variant</Label>
                <Select
                  value={widgetProps.variant || "default"}
                  onValueChange={(value) => updateProp("variant", value)}
                >
                  <SelectTrigger id="variant">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Select
                  value={widgetProps.size || "default"}
                  onValueChange={(value) => updateProp("size", value)}
                >
                  <SelectTrigger id="size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="icon">Icon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={widgetProps.children || "Button Text"}
                onChange={(e) => updateProp("children", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="disabled"
                checked={widgetProps.disabled || false}
                onCheckedChange={(checked) => updateProp("disabled", checked)}
              />
              <Label htmlFor="disabled">Disabled</Label>
            </div>
          </div>
        );

      case "card":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="showHeader"
                checked={widgetProps.showHeader || false}
                onCheckedChange={(checked) => updateProp("showHeader", checked)}
              />
              <Label htmlFor="showHeader">Show Header</Label>
            </div>

            {widgetProps.showHeader && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardTitle">Card Title</Label>
                  <Input
                    id="cardTitle"
                    value={widgetProps.title || "Card Title"}
                    onChange={(e) => updateProp("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardDescription">Card Description</Label>
                  <Input
                    id="cardDescription"
                    value={widgetProps.description || ""}
                    onChange={(e) => updateProp("description", e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="cardContent">Card Content</Label>
              <Input
                id="cardContent"
                value={widgetProps.content || "Card Content"}
                onChange={(e) => updateProp("content", e.target.value)}
              />
            </div>
          </div>
        );

      case "widgets-widget":
        return (
          <div className="space-y-6">
            {/* Common Controls for all Showpass widgets */}
            <div className="space-y-4 border-b pb-4">
              <div className="font-medium">Common Settings</div>

              <div className="space-y-2">
                <Label htmlFor="widgetType">Widget Type</Label>
                <Select
                  value={widgetProps.widgetType || "event"}
                  onValueChange={(value) => updateProp("widgetType", value)}
                >
                  <SelectTrigger id="widgetType">
                    <SelectValue placeholder="Select widget type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cart">Cart</SelectItem>
                    <SelectItem value="checkout">Checkout</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="membership">Membership</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 border rounded" 
                    style={{ backgroundColor: widgetProps.background || "#ffffff" }}
                  />
                  <Input
                    id="background"
                    value={widgetProps.background || "#ffffff"}
                    onChange={(e) => updateProp("background", e.target.value)}
                    className="w-24"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 border rounded" 
                    style={{ backgroundColor: widgetProps.primaryColor || "#dd3333" }}
                  />
                  <Input
                    id="primaryColor"
                    value={widgetProps.primaryColor || "#dd3333"}
                    onChange={(e) => updateProp("primaryColor", e.target.value)}
                    className="w-24"
                    maxLength={7}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="darkTheme"
                  checked={widgetProps.darkTheme || false}
                  onCheckedChange={(checked) => updateProp("darkTheme", checked)}
                />
                <Label htmlFor="darkTheme">Dark Theme</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="embedded"
                  checked={widgetProps.embedded || false}
                  onCheckedChange={(checked) => updateProp("embedded", checked)}
                />
                <Label htmlFor="embedded">Embedded</Label>
              </div>
            </div>

            {/* Widget Type Specific Controls */}
            {widgetProps.widgetType === "cart" && (
              <div className="space-y-4">
                <div className="font-medium">Cart Widget Settings</div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="keepShopping"
                    checked={widgetProps.keepShopping || false}
                    onCheckedChange={(checked) => updateProp("keepShopping", checked)}
                  />
                  <Label htmlFor="keepShopping">Keep Shopping Button</Label>
                </div>
              </div>
            )}

            {widgetProps.widgetType === "checkout" && (
              <div className="space-y-4">
                <div className="font-medium">Checkout Widget Settings</div>

                <div className="space-y-2">
                  <Label htmlFor="purchaseSource">Purchase Source</Label>
                  <Select
                    value={widgetProps.purchaseSource || "psp_widget"}
                    onValueChange={(value) => updateProp("purchaseSource", value)}
                  >
                    <SelectTrigger id="purchaseSource">
                      <SelectValue placeholder="Select purchase source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="psp_widget">PSP_Widget</SelectItem>
                      <SelectItem value="psp_web">PSP_Web</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {widgetProps.widgetType === "calendar" && (
              <div className="space-y-4">
                <div className="font-medium">Calendar Widget Settings</div>

                <div className="space-y-2">
                  <Label htmlFor="organizerId">Organizer ID</Label>
                  <Input
                    id="organizerId"
                    value={widgetProps.organizerId || "tiger-tiger"}
                    onChange={(e) => updateProp("organizerId", e.target.value)}
                    placeholder="e.g., tiger-tiger"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTags">Event Tags (comma separated)</Label>
                  <Input
                    id="eventTags"
                    value={widgetProps.eventTags || ""}
                    onChange={(e) => updateProp("eventTags", e.target.value)}
                    placeholder="e.g., festivals,community"
                  />
                </div>
              </div>
            )}

            {widgetProps.widgetType === "event" && (
              <div className="space-y-4">
                <div className="font-medium">Event Widget Settings</div>

                <div className="space-y-2">
                  <Label htmlFor="eventId">Event ID</Label>
                  <Input
                    id="eventId"
                    value={widgetProps.eventId || "bad-friends-calgary"}
                    onChange={(e) => updateProp("eventId", e.target.value)}
                    placeholder="e.g., bad-friends-calgary"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ticketTypeSelectionRequired"
                    checked={widgetProps.ticketTypeSelectionRequired || false}
                    onCheckedChange={(checked) => updateProp("ticketTypeSelectionRequired", checked)}
                  />
                  <Label htmlFor="ticketTypeSelectionRequired">Ticket Type Selection Required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="promptForQuantity"
                    checked={widgetProps.promptForQuantity || false}
                    onCheckedChange={(checked) => updateProp("promptForQuantity", checked)}
                  />
                  <Label htmlFor="promptForQuantity">Prompt For Quantity</Label>
                </div>
              </div>
            )}

            {widgetProps.widgetType === "product" && (
              <div className="space-y-4">
                <div className="font-medium">Product Widget Settings</div>

                <div className="space-y-2">
                  <Label htmlFor="productId">Product ID</Label>
                  <Input
                    id="productId"
                    value={widgetProps.productId || ""}
                    onChange={(e) => updateProp("productId", e.target.value)}
                    placeholder="Enter product ID"
                  />
                </div>
              </div>
            )}

            {widgetProps.widgetType === "membership" && (
              <div className="space-y-4">
                <div className="font-medium">Membership Widget Settings</div>

                <div className="space-y-2">
                  <Label htmlFor="membershipId">Membership ID</Label>
                  <Input
                    id="membershipId"
                    value={widgetProps.membershipId || ""}
                    onChange={(e) => updateProp("membershipId", e.target.value)}
                    placeholder="Enter membership ID"
                  />
                </div>
              </div>
            )}
          </div>
        );

      // Add cases for other widget types as needed
      default:
        return <div>No controls available for this widget type</div>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Widget Playground</CardTitle>
        <CardDescription>
          Customize the {widgetType} widget to see how it looks with different properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="p-4 flex justify-center items-center min-h-[200px] border rounded-md mt-2">
            {renderWidget()}
          </TabsContent>
          <TabsContent value="controls" className="p-4 border rounded-md mt-2">
            {renderControls()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WidgetPlayground;
