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
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import SEOHead from "@/shared/components/SEOHead";
import { seoDataMap } from "@/docs-app/data/seoData";

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
  const seoData = seoDataMap["/widget-playground"];

  // State for widget configuration
  const [eventId, setEventId] = React.useState<string>("");
  const [membershipId, setMembershipId] = React.useState<string>("");
  const [productId, setProductId] = React.useState<string>("");
  const [venueId, setVenueId] = React.useState<string>("");
  const [themeColor, setThemeColor] = React.useState<string>("#24727b");
  
  // State for navigation
  const [activeTab, setActiveTab] = React.useState<"popup" | "mounted">("popup");
  const [activeWidget, setActiveWidget] = React.useState<"calendar" | "event" | "membership" | "product">("calendar");

  // Memoize options for modal widgets
  const modalWidgetOptions = React.useMemo(() => ({ 
    "theme-primary": themeColor,
    "keep-shopping": true 
  }), [themeColor]);

  // Configure layout settings
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
          hideRightSidebar: false,
          tocItems: [],
          apiExamplesData: undefined,
          activeSection: undefined,
        });
      }
    };
  }, [setPageData]);

  return (
    <div>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      
      <ShowpassIntegration />

      <h1 className="text-3xl font-bold mb-4">Widget Playground</h1>

      {/* Compact Sticky Control Center */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border rounded-lg mb-6 shadow-lg">
        <div className="p-4">
          {/* Configuration Row */}
          <div className="flex items-start gap-3 mb-3">
            <div className="flex items-start gap-2 flex-1">
              <div className="flex flex-col items-center gap-1">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-8 h-8 rounded border cursor-pointer"
                  title="Theme"
                />
                <span className="text-xs text-muted-foreground/60">Theme</span>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  placeholder="#24727b"
                  className="font-mono text-xs w-24"
                />
                <span className="text-xs text-muted-foreground/60 text-center opacity-0">Color</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <Input
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Event ID"
                className="w-24 text-xs"
              />
              <span className="text-xs text-muted-foreground/60 text-center">
                {eventId ? "Event" : ""}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <Input
                value={venueId}
                onChange={(e) => setVenueId(e.target.value)}
                placeholder="Venue ID"
                className="w-24 text-xs"
              />
              <span className="text-xs text-muted-foreground/60 text-center">
                {venueId ? "Venue" : ""}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <Input
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="Product ID"
                className="w-24 text-xs"
              />
              <span className="text-xs text-muted-foreground/60 text-center">
                {productId ? "Product" : ""}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <Input
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                placeholder="Member ID"
                className="w-24 text-xs"
              />
              <span className="text-xs text-muted-foreground/60 text-center">
                {membershipId ? "Member" : ""}
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setThemeColor("#24727b");
                  setEventId("272406");
                  setVenueId("83");
                  setProductId("4264");
                  setMembershipId("1058");
                }}
                className="text-xs whitespace-nowrap h-8"
              >
                Demo Data
              </Button>
              <span className="text-xs opacity-0">spacer</span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 h-8 bg-muted/50 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("popup")}
                className="text-xs h-6 px-3"
                style={activeTab === "popup" ? {
                  backgroundColor: '#24727b',
                  color: 'white'
                } : {}}
              >
                Modal
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab("mounted")}
                className="text-xs h-6 px-3"
                style={activeTab === "mounted" ? {
                  backgroundColor: '#24727b',
                  color: 'white'
                } : {}}
              >
                Mounted
              </Button>
            </div>
            
            {/* Widget Sub-navigation */}
            {activeTab === "mounted" && (
              <div className="grid grid-cols-4 h-8 bg-muted/30 rounded-md p-1 flex-1">
                {(["calendar", "event", "membership", "product"] as const).map((widget) => (
                  <Button
                    key={widget}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveWidget(widget)}
                    className="text-xs h-6 px-2"
                    style={activeWidget === widget ? {
                      backgroundColor: '#24727b',
                      color: 'white'
                    } : {}}
                  >
                    {widget === "calendar" && "📅 Cal"}
                    {widget === "event" && "🎫 Event"}
                    {widget === "membership" && "👥 Member"}
                    {widget === "product" && "🛍️ Product"}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Content */}
      <div className="mb-10">
        {/* Modal Widgets */}
        {activeTab === "popup" && (
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Modal Integration Examples</h2>
              <p className="text-sm text-muted-foreground">
                See how your widgets would appear on a partner website. These buttons trigger the same modals your customers will see.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar Widget */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Event Calendar</h3>
                  <p className="text-sm text-muted-foreground">Browse all upcoming events at your venue</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Venue:</span> {venueId || "Your Venue Name"}
                  </div>
                  {venueId ? (
                    <ShowpassCalendarWidget
                      venueId={venueId}
                      options={modalWidgetOptions}
                    />
                  ) : (
                    <div className="text-amber-600 dark:text-amber-400 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Venue ID above to see the calendar widget in action.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Event Widget */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Event Tickets</h3>
                  <p className="text-sm text-muted-foreground">Direct ticket sales for your event</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Event:</span> {eventId ? `Event #${eventId}` : "Your Event Name"}
                  </div>
                  {eventId ? (
                    <Button
                      onClick={() => {
                        if (window.showpass && window.showpass.tickets) {
                          window.showpass.tickets.eventPurchaseWidget(eventId, modalWidgetOptions);
                        }
                      }}
                      className="w-full transition-colors hover:bg-[#24727b] hover:text-white"
                      size="lg"
                    >
                      🎫 Buy Tickets
                    </Button>
                  ) : (
                    <div className="text-amber-600 dark:text-amber-400 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Event ID above to enable ticket purchasing.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Membership Widget */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Membership Program</h3>
                  <p className="text-sm text-muted-foreground">Offer recurring memberships to your community</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Program:</span> {membershipId ? `Membership #${membershipId}` : "Your Membership Program"}
                  </div>
                  {membershipId ? (
                    <ShowpassMembershipWidget
                      id={membershipId}
                      options={modalWidgetOptions}
                    />
                  ) : (
                    <div className="text-amber-600 dark:text-amber-400 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Membership ID above to show the join button.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Widget */}
              <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">Merchandise Store</h3>
                  <p className="text-sm text-muted-foreground">Sell products and merchandise to your audience</p>
                </div>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Product:</span> {productId ? `Product #${productId}` : "Your Product"}
                  </div>
                  {productId ? (
                    <ShowpassProductWidget
                      id={productId}
                      options={modalWidgetOptions}
                    />
                  ) : (
                    <div className="text-amber-600 dark:text-amber-400 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Product ID above to enable product sales.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mounted Widgets */}
        {activeTab === "mounted" && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {activeWidget === "calendar" && "📅"}
                  {activeWidget === "event" && "🎫"}
                  {activeWidget === "membership" && "👥"}
                  {activeWidget === "product" && "🛍️"}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {activeWidget === "calendar" && "Calendar Widget"}
                    {activeWidget === "event" && "Event Widget"}
                    {activeWidget === "membership" && "Membership Widget"}
                    {activeWidget === "product" && "Product Widget"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {activeWidget === "calendar" && "Interactive calendar view for venue events"}
                    {activeWidget === "event" && "Direct ticket purchase interface"}
                    {activeWidget === "membership" && "Membership purchase interface"}
                    {activeWidget === "product" && "Product purchase interface"}
                  </p>
                </div>
              </div>
              
              {/* Calendar Widget */}
              {activeWidget === "calendar" && (
                venueId ? (
                  <div className="bg-background rounded-md border min-h-[600px] p-4">
                    <ShowpassMountedCalendarWidget venueId={venueId} themeColor={themeColor} />
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="font-medium">Venue ID Required</p>
                  </div>
                )
              )}

              {/* Event Widget */}
              {activeWidget === "event" && (
                eventId ? (
                  <div className="bg-background rounded-md border min-h-[500px] p-4">
                    <ShowpassMountedEventWidget id={eventId} themeColor={themeColor} />
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="font-medium">Event ID Required</p>
                  </div>
                )
              )}

              {/* Membership Widget */}
              {activeWidget === "membership" && (
                membershipId ? (
                  <div className="bg-background rounded-md border min-h-[500px] p-4">
                    <ShowpassMountedMembershipWidget id={membershipId} themeColor={themeColor} />
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="font-medium">Membership ID Required</p>
                  </div>
                )
              )}

              {/* Product Widget */}
              {activeWidget === "product" && (
                productId ? (
                  <div className="bg-background rounded-md border min-h-[500px] p-4">
                    <ShowpassMountedProductWidget id={productId} themeColor={themeColor} />
                  </div>
                ) : (
                  <div className="text-amber-600 dark:text-amber-400 p-6 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 text-center">
                    <div className="text-2xl mb-2">⚠️</div>
                    <p className="font-medium">Product ID Required</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WidgetPlayground;
