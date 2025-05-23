import * as React from "react";
import { useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/card";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { Button } from "@/shared/components/button";
import { Separator } from "@/shared/components/separator";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";

// Import Showpass components
import ShowpassIntegration from "@/docs-app/ui/components/widgets/ShowpassIntegration";
import ShowpassCalendarWidget from "@/docs-app/ui/components/widgets/ShowpassCalendarWidget";
import ShowpassMembershipWidget from "@/docs-app/ui/components/widgets/ShowpassMembershipWidget";
import ShowpassProductWidget from "@/docs-app/ui/components/widgets/ShowpassProductWidget";
import ShowpassMountedCalendarWidget from "@/docs-app/ui/components/widgets/ShowpassMountedCalendarWidget";
import ShowpassMountedEventWidget from "@/docs-app/ui/components/widgets/ShowpassMountedEventWidget";
import ShowpassMountedMembershipWidget from "@/docs-app/ui/components/widgets/ShowpassMountedMembershipWidget";
import ShowpassMountedProductWidget from "@/docs-app/ui/components/widgets/ShowpassMountedProductWidget";

const WidgetPlayground: React.FC = () => {
  const { setPageData } = useDocLayoutData();

  // State for IDs and other configuration
  const [eventId, setEventId] = React.useState<string>("624039"); // Default event ID
  const [membershipId, setMembershipId] = React.useState<string>("17399"); // Default membership ID
  const [productId, setProductId] = React.useState<string>("1894"); // Default product ID
  const [venueId, setVenueId] = React.useState<string>("1964"); // Default venue ID
  const [themeColor, setThemeColor] = React.useState<string>("#FF7F00"); // Default theme color

  // Set page data for layout using useEffect
  useEffect(() => {
    if (setPageData) {
      setPageData({
        hideRightSidebar: true,
        tocItems: [],
        apiExamplesData: undefined,
        activeSection: undefined,
      });
    }
    return () => {
      if (setPageData) {
        setPageData({
          hideRightSidebar: false, // Default back when unmounting
          tocItems: [],
          apiExamplesData: undefined,
          activeSection: undefined,
        });
      }
    };
  }, [setPageData]);

  return (
    <div>
      {/* Load the Showpass SDK */}
      <ShowpassIntegration />

      <h1 className="text-3xl font-bold mb-6">Showpass Widget Playground</h1>
      <p className="text-lg text-muted-foreground mb-8">
        This page demonstrates the various Showpass widgets and how they can be
        integrated into your application.
      </p>

      {/* Configuration Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Widget Configuration</CardTitle>
          <CardDescription>
            Configure the IDs and appearance of the widgets below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventId">Event ID</Label>
                <Input
                  id="eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  placeholder="Enter event ID"
                />
              </div>
              <div>
                <Label htmlFor="membershipId">Membership ID</Label>
                <Input
                  id="membershipId"
                  value={membershipId}
                  onChange={(e) => setMembershipId(e.target.value)}
                  placeholder="Enter membership ID"
                />
              </div>
              <div>
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Enter product ID"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="venueId">Venue ID</Label>
                <Input
                  id="venueId"
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  placeholder="Enter venue ID"
                />
              </div>
              <div>
                <Label htmlFor="themeColor">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="themeColor"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                    placeholder="Enter hex color code"
                  />
                  <div
                    className="w-10 h-10 rounded border"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Widget Tabs */}
      <Tabs defaultValue="popup" className="mb-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="popup">Modal Widgets</TabsTrigger>
          <TabsTrigger value="mounted">Mounted Widgets</TabsTrigger>
        </TabsList>

        {/* Modal Widgets Tab */}
        <TabsContent value="popup" className="space-y-8">
          <h2 className="text-2xl font-bold mt-6">Modal Widgets</h2>
          <p className="text-muted-foreground">
            These widgets open in a modal dialog when triggered.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Widget</CardTitle>
                <CardDescription>
                  Shows events in a calendar view for a specific venue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassCalendarWidget
                  venueId={venueId}
                  options={{ "theme-primary": themeColor }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Widget</CardTitle>
                <CardDescription>
                  Purchase tickets for a specific event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    if (window.showpass && window.showpass.tickets) {
                      window.showpass.tickets.eventPurchaseWidget(eventId, {
                        "theme-primary": themeColor,
                        "keep-shopping": true,
                      });
                    }
                  }}
                  disabled={!eventId}
                >
                  Open Event Widget
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Widget</CardTitle>
                <CardDescription>Purchase a membership.</CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassMembershipWidget
                  id={membershipId}
                  options={{ "theme-primary": themeColor }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Widget</CardTitle>
                <CardDescription>Purchase a product.</CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassProductWidget
                  id={productId}
                  options={{ "theme-primary": themeColor }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mounted Widgets Tab */}
        <TabsContent value="mounted" className="space-y-8">
          <h2 className="text-2xl font-bold mt-6">Mounted Widgets</h2>
          <p className="text-muted-foreground mb-4">
            These widgets are mounted directly into the page.
          </p>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Calendar Widget</CardTitle>
                <CardDescription>
                  Shows events in a calendar view for a specific venue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassMountedCalendarWidget
                  venueId={venueId}
                  themeColor={themeColor}
                  className="border rounded-md p-4"
                />
              </CardContent>
            </Card>

            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle>Event Widget</CardTitle>
                <CardDescription>
                  Purchase tickets for a specific event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassMountedEventWidget
                  id={eventId}
                  themeColor={themeColor}
                  className="border rounded-md p-4"
                />
              </CardContent>
            </Card>

            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle>Membership Widget</CardTitle>
                <CardDescription>Purchase a membership.</CardDescription>
              </CardHeader>
              <CardContent>
                <ShowpassMountedMembershipWidget
                  id={membershipId}
                  themeColor={themeColor}
                  className="border rounded-md p-4"
                />
              </CardContent>
            </Card>

            <Separator className="my-8" />

            <Card>
              <CardHeader>
                <CardTitle>Product Widget</CardTitle>
                <CardDescription>Purchase a product.</CardDescription>
              </CardHeader>
              <CardContent>
                {productId ? (
                  <ShowpassMountedProductWidget
                    id={productId}
                    themeColor={themeColor}
                    className="border rounded-md p-4"
                  />
                ) : (
                  <div className="text-amber-600 p-4 bg-amber-50 rounded-md">
                    Please enter a Product ID in the configuration section
                    above.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WidgetPlayground;
