import * as React from "react";
import { useLayoutEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "@/shared/components/input.tsx";
import { Button } from "@/shared/components/button.tsx";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import HeaderWithLink from "@/docs-app/ui/components/content/HeaderWithLink.tsx";
import { Separator } from "@/shared/components/separator.tsx";
import SEOHead from "@/shared/components/SEOHead.tsx";
import { seoDataMap } from "@/docs-app/data/seoData.ts";
import { CalendarDays, Ticket, Users, ShoppingBag, ArrowUpRight, PanelTop, ChevronDown, Check } from "lucide-react";
import { WIDGET_ENVIRONMENTS, type WidgetEnvironment } from "@/docs-app/ui/components/widgets/showpass-sdk";

// Import Showpass components
import ShowpassIntegration from "@/docs-app/ui/components/widgets/ShowpassIntegration.tsx";
import ShowpassCalendarWidget from "@/docs-app/ui/components/widgets/ShowpassCalendarWidget.tsx";
import ShowpassMembershipWidget from "@/docs-app/ui/components/widgets/ShowpassMembershipWidget.tsx";
import ShowpassProductWidget from "@/docs-app/ui/components/widgets/ShowpassProductWidget.tsx";
import ShowpassMountedCalendarWidget from "@/docs-app/ui/components/widgets/ShowpassMountedCalendarWidget.tsx";
import ShowpassMountedEventWidget from "@/docs-app/ui/components/widgets/ShowpassMountedEventWidget.tsx";
import ShowpassMountedMembershipWidget from "@/docs-app/ui/components/widgets/ShowpassMountedMembershipWidget.tsx";
import ShowpassMountedProductWidget from "@/docs-app/ui/components/widgets/ShowpassMountedProductWidget.tsx";

type PlaygroundTab = "popup" | "mounted";
type PlaygroundWidget = "calendar" | "event" | "membership" | "product";
type PlaygroundQueryKey = "environment" | "eventId" | "venueId" | "productId" | "memberId" | "theme" | "tab" | "widget";

const isPlaygroundTab = (value: string | null): value is PlaygroundTab =>
  value === "popup" || value === "mounted";

const isPlaygroundWidget = (value: string | null): value is PlaygroundWidget =>
  value === "calendar" || value === "event" || value === "membership" || value === "product";

const WIDGET_CHOICES = {
  event: {
    title: "Event tickets", description: "Sell tickets for one event.", icon: Ticket,
    fieldLabel: "Event slug", inputId: "playground-input-eventId", placeholder: "e.g. summer-music-night",
    help: "The last part of your Showpass event URL. Use the event slug, not a numeric event ID.",
    example: "showpass.com/summer-music-night/ → summer-music-night",
  },
  calendar: {
    title: "Event calendar", description: "Browse an organization's events.", icon: CalendarDays,
    fieldLabel: "Organization ID or slug", inputId: "playground-input-venueId", placeholder: "e.g. 83 or your-organization",
    help: "The Showpass organization whose events you want to display. This is also called the venue ID.",
    example: "The calendar displays events belonging to this organization.",
  },
  product: {
    title: "Products", description: "Open a product purchase flow.", icon: ShoppingBag,
    fieldLabel: "Product ID", inputId: "playground-input-productId", placeholder: "e.g. 4264",
    help: "The Showpass product identifier supplied by the organizer for the product you want to sell.",
    example: "Use a product from the selected environment.",
  },
  membership: {
    title: "Memberships", description: "Offer a membership program.", icon: Users,
    fieldLabel: "Membership identifier", inputId: "playground-input-memberId", placeholder: "Enter your membership identifier",
    help: "The membership program identifier supplied by the organizer. This identifies the program, not an individual member.",
    example: "Use a membership program from the selected environment.",
  },
} as const;

const WidgetPlayground: React.FC = () => {
  const { setPageData } = useDocLayoutData();
  const seoData = seoDataMap["/sdk/widget-playground"];

  // The URL owns shareable configuration; customer tokens stay in memory.
  // Supported params: eventId, venueId, productId, memberId (alias:
  // membershipId), theme, tab (popup|mounted), widget (calendar|event|
  // membership|product), environment (prod|demo, plus dev in development builds).
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const eventId = searchParams.get("eventId") ?? "";
  const venueId = searchParams.get("venueId") ?? "";
  const productId = searchParams.get("productId") ?? "";
  const membershipId =
    searchParams.get("memberId") ?? searchParams.get("membershipId") ?? "";
  const themeColor = searchParams.get("theme") ?? "#24727b";
  const tabParam = searchParams.get("tab");
  const widgetParam = searchParams.get("widget");
  const environmentParam = searchParams.get("environment");
  const environment: WidgetEnvironment = environmentParam && Object.prototype.hasOwnProperty.call(WIDGET_ENVIRONMENTS, environmentParam)
    ? environmentParam as WidgetEnvironment
    : "prod";

  const activeTab: PlaygroundTab = isPlaygroundTab(tabParam) ? tabParam : "popup";
  const activeWidget: PlaygroundWidget = isPlaygroundWidget(widgetParam) ? widgetParam : "event";

  const buildSearch = (changes: Partial<Record<PlaygroundQueryKey, string>>) => {
    const values = { environment, eventId, venueId, productId, memberId: membershipId, theme: themeColor, tab: activeTab, widget: activeWidget, ...changes };
    // Explicitly allow only public settings and omit empty identifiers.
    return new URLSearchParams(Object.entries(values).filter(([, value]) => value !== "")).toString();
  };
  const updateConfig = (changes: Partial<Record<PlaygroundQueryKey, string>>) => {
    navigate({ pathname: location.pathname, search: `?${buildSearch(changes)}`, hash: location.hash }, { replace: true, preventScrollReset: true });
  };
  const setEventId = (value: string) => updateConfig({ eventId: value });
  const setVenueId = (value: string) => updateConfig({ venueId: value });
  const setProductId = (value: string) => updateConfig({ productId: value });
  const setMembershipId = (value: string) => updateConfig({ memberId: value });
  const setThemeColor = (value: string) => updateConfig({ theme: value });
  const setActiveTab = (value: PlaygroundTab) => updateConfig({ tab: value });
  const setActiveWidget = (value: PlaygroundWidget) => updateConfig({ widget: value });

  const [tokenInput, setTokenInput] = React.useState("");
  const [customerAttributionToken, setCustomerAttributionToken] = React.useState("");
  const [sdkReady, setSdkReady] = React.useState(false);
  const [sdkError, setSdkError] = React.useState("");
  const [eventError, setEventError] = React.useState("");
  const [isOpeningEvent, setIsOpeningEvent] = React.useState(false);
  const openingEvent = React.useRef(false);
  const onSdkReady = React.useCallback(() => setSdkReady(true), []);

  const changeEnvironment = (value: string) => {
    // Reload before replacing the SDK so open widgets and tokens cannot cross environments.
    window.location.assign(`${location.pathname}?${buildSearch({ environment: value })}${location.hash}`);
  };

  const tokenError = tokenInput.trim().startsWith("sp_partner_")
    ? "Paste customer_attribution_token from the API response, not your Partner credential."
    : /\s/.test(tokenInput.trim()) ? "The token must not contain spaces or line breaks." : "";

  React.useEffect(() => {
    setSdkReady(false);
    setSdkError("");
    setTokenInput("");
    setCustomerAttributionToken("");
  }, [environment]);

  const selectedWidget = WIDGET_CHOICES[activeWidget];
  const identifiers = {
    event: { value: eventId, onChange: setEventId },
    calendar: { value: venueId, onChange: setVenueId },
    product: { value: productId, onChange: setProductId },
    membership: { value: membershipId, onChange: setMembershipId },
  };
  const selectedIdentifier = identifiers[activeWidget];

  // Memoize options for modal widgets
  const modalWidgetOptions = React.useMemo(() => ({ 
    "theme-primary": themeColor,
    "keep-shopping": true 
  }), [themeColor]);
  const eventWidgetOptions = React.useMemo(() => ({
    ...modalWidgetOptions,
    ...(customerAttributionToken ? { customer_attribution_token: customerAttributionToken } : {}),
  }), [modalWidgetOptions, customerAttributionToken]);

  const openEventWidget = async () => {
    if (openingEvent.current || !sdkReady || !window.showpass?.tickets) return;
    openingEvent.current = true;
    setIsOpeningEvent(true);
    setEventError("");
    try {
      await window.showpass.tickets.eventPurchaseWidget(eventId.trim(), { ...eventWidgetOptions });
    } catch {
      setEventError("Unable to open checkout. Check the event and selected environment, then try again.");
    } finally {
      openingEvent.current = false;
      setIsOpeningEvent(false);
    }
  };

  // Configure layout settings
  useLayoutEffect(() => {
    setPageData({
      hideRightSidebar: true,
      tocItems: [],
      apiExamplesData: undefined,
      activeSection: undefined,
      pageTitle: "Widget Playground",
    });
  }, [setPageData]);

  return (
    <div>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      
      <ShowpassIntegration environment={environment} onReady={onSdkReady} onError={setSdkError} />

      <div className="prose prose-slate max-w-none dark:prose-invert">
        <HeaderWithLink id="widget-playground" level={1}>
          <span data-testid="playground-title">Widget Playground</span>
        </HeaderWithLink>
        <Separator className="mb-2 opacity-60" />
        <p className="my-6 text-foreground/90 leading-relaxed text-[15px]">Choose what to sell or display, then try the Showpass experience on your page.</p>
      </div>

      <section aria-label="Widget configuration" data-testid="playground-controls" className="mb-8 overflow-hidden rounded-xl border bg-card shadow-sm">
        <fieldset className="min-w-0 p-5 sm:p-6">
          <legend className="float-left mb-4 flex w-full items-center gap-2 text-sm font-semibold">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>
            Choose a widget
          </legend>
          <div className="clear-both grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Object.entries(WIDGET_CHOICES).map(([value, choice]) => {
              const Icon = choice.icon;
              return (
                <label key={value} data-testid={`playground-widget-${value}`} className="relative cursor-pointer">
                  <input type="radio" name="widget-type" value={value} checked={activeWidget === value}
                    onChange={() => setActiveWidget(value as PlaygroundWidget)} className="peer sr-only" />
                  <span className="flex h-full gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/40 peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <span>
                      <span className="block text-sm font-semibold">{choice.title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{choice.description}</span>
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid border-t lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6 p-5 sm:p-6">
            <div>
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>
                Connect your content
              </h3>
              <label htmlFor="playground-environment" className="block text-sm font-medium">Environment</label>
              <p id="environment-help" className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {environment === "prod" ? "Live Showpass events and checkout." : environment === "demo" ? "Test with events and tokens created in demo." : "Test against your local Showpass backend."}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <select id="playground-environment" aria-label="Widget environment" aria-describedby="environment-help environment-change-help"
                  value={environment} onChange={(event) => changeEnvironment(event.target.value)}
                  className="h-10 min-w-28 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {Object.entries(WIDGET_ENVIRONMENTS).map(([value, config]) => <option key={value} value={value}>{config.label}</option>)}
                </select>
                <span className="min-w-0 break-all font-mono text-xs text-muted-foreground">{WIDGET_ENVIRONMENTS[environment].origin}</span>
              </div>
              <p id="environment-change-help" className="mt-2 text-xs text-muted-foreground">Changing environment reloads the page and clears your customer token.</p>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <label htmlFor={selectedWidget.inputId} className="text-sm font-medium">{selectedWidget.fieldLabel}</label>
                <span className="text-xs text-muted-foreground">Required</span>
              </div>
              <p id="widget-identifier-help" className="mt-1 text-xs leading-relaxed text-muted-foreground">{selectedWidget.help}</p>
              <Input id={selectedWidget.inputId} data-testid={selectedWidget.inputId} value={selectedIdentifier.value}
                onChange={(event) => selectedIdentifier.onChange(event.target.value)} placeholder={selectedWidget.placeholder}
                aria-describedby="widget-identifier-help widget-identifier-example" className="mt-3 h-11" />
              <p id="widget-identifier-example" className="mt-2 break-words text-xs text-muted-foreground">{selectedWidget.example}</p>
            </div>

            {activeWidget === "event" && (
              <details className="group rounded-lg border bg-muted/10">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                      Partner customer <span className="font-normal text-muted-foreground">Optional</span>
                      {customerAttributionToken && <span className="inline-flex items-center gap-1 text-xs text-primary"><Check className="h-3 w-3" aria-hidden="true" />Token applied</span>}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">Are you a Showpass Partner? Link checkout to a customer from your application.</span>
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="space-y-3 border-t p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Get a fresh token from your backend or the <Link className="text-primary underline" to="/api/partner-api-customer-attribution-token">Partner API Explorer</Link>.
                  </p>
                  <label htmlFor="playground-attribution-token" className="block text-sm font-medium">Customer attribution token</label>
                  <Input id="playground-attribution-token" type="password" autoComplete="off" spellCheck={false} maxLength={128}
                    value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} placeholder="customer_attribution_token"
                    aria-invalid={!!tokenError} />
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" disabled={!tokenInput.trim() || !!tokenError || tokenInput.trim() === customerAttributionToken}
                      onClick={() => setCustomerAttributionToken(tokenInput.trim())}>Apply token</Button>
                    <Button size="sm" variant="outline" disabled={!tokenInput && !customerAttributionToken}
                      onClick={() => { setTokenInput(""); setCustomerAttributionToken(""); }}>Clear token</Button>
                  </div>
                  {tokenError && <p role="alert" className="text-xs text-destructive">{tokenError}</p>}
                  {tokenInput.trim() !== customerAttributionToken && !tokenError && <p className="text-xs text-muted-foreground">Your changes have not been applied yet.</p>}
                  <p role="status" className="text-xs">{customerAttributionToken ? "Token applied to Event Tickets." : "No token applied. You can still try normal checkout."}</p>
                </div>
              </details>
            )}
          </div>

          <div className="min-w-0 space-y-6 border-t bg-muted/10 p-5 sm:p-6 lg:border-l lg:border-t-0">
            <fieldset className="min-w-0">
              <legend className="mb-5 flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">3</span>
                Choose how it appears
              </legend>
              <div className="space-y-3">
                {([
                  { value: "popup", title: "Popup", subtitle: "Modal", help: "A button opens checkout over the page.", icon: ArrowUpRight },
                  { value: "mounted", title: "Embedded", subtitle: "Mounted", help: "The widget appears directly inside your page.", icon: PanelTop },
                ] as const).map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <label key={mode.value} data-testid={`playground-tab-${mode.value}`} className="block cursor-pointer">
                      <input type="radio" name="preview-mode" value={mode.value} checked={activeTab === mode.value}
                        onChange={() => setActiveTab(mode.value)} className="peer sr-only" />
                      <span className="flex gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/30 peer-checked:border-primary peer-checked:bg-primary/5 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2">
                        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-semibold">{mode.title} <span className="ml-1 text-xs font-normal text-muted-foreground">{mode.subtitle}</span></span>
                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{mode.help}</span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="border-t pt-5">
              <label htmlFor="playground-color-hex" className="block text-sm font-medium">Brand color <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span></label>
              <p id="brand-color-help" className="mt-1 text-xs text-muted-foreground">Used for buttons and accents inside the widget.</p>
              <div className="mt-3 flex items-center gap-3">
                <input type="color" aria-label="Choose brand color" value={/^#[0-9a-f]{6}$/i.test(themeColor) ? themeColor : "#24727b"}
                  onChange={(event) => setThemeColor(event.target.value)} className="h-11 w-11 shrink-0 cursor-pointer rounded-md border bg-background p-1" />
                <Input id="playground-color-hex" value={themeColor} onChange={(event) => setThemeColor(event.target.value)}
                  placeholder="#24727b" aria-describedby="brand-color-help" className="h-11 max-w-36 font-mono" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {sdkError && <p role="alert" className="mb-4 text-destructive">{sdkError} Check that this environment is running and reload the page.</p>}
      {!sdkReady && !sdkError && <p role="status" className="mb-4">Loading Showpass widgets…</p>}

      {/* Widget Content */}
      {sdkReady && <div className="mb-10">
        {/* Modal Widgets */}
        {activeTab === "popup" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Calendar Widget */}
              {activeWidget === "calendar" && <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="space-y-3">
                  {venueId.trim() ? (
                    <div data-testid="playground-modal-calendar">
                      <ShowpassCalendarWidget
                        venueId={venueId.trim()}
                        options={modalWidgetOptions}
                      />
                    </div>
                  ) : (
                    <div className="warning-box p-4 rounded-md border">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Venue ID above to see the calendar widget in action.</p>
                    </div>
                  )}
                </div>
              </div>}

              {/* Event Widget */}
              {activeWidget === "event" && <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="space-y-3">
                  {eventId.trim() ? (
                    <Button
                      data-testid="playground-modal-event"
                      onClick={openEventWidget}
                      disabled={isOpeningEvent}
                      className="w-full transition-colors hover:bg-primary hover:text-primary-foreground"
                      size="lg"
                    >
                      {isOpeningEvent ? "Opening…" : "🎫 Buy Tickets"}
                    </Button>
                  ) : (
                    <div className="warning-box p-4 rounded-md border">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your event slug above to enable ticket purchasing.</p>
                    </div>
                  )}
                  {eventError && <p role="alert" className="text-sm text-destructive">{eventError}</p>}
                </div>
              </div>}

              {/* Membership Widget */}
              {activeWidget === "membership" && <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="space-y-3">
                  {membershipId.trim() ? (
                    <div data-testid="playground-modal-membership">
                      <ShowpassMembershipWidget
                        id={membershipId.trim()}
                        options={modalWidgetOptions}
                      />
                    </div>
                  ) : (
                    <div className="warning-box p-4 rounded-md border">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Membership ID above to show the join button.</p>
                    </div>
                  )}
                </div>
              </div>}

              {/* Product Widget */}
              {activeWidget === "product" && <div className="border rounded-lg p-6 bg-gradient-to-br from-background to-muted/20">
                <div className="space-y-3">
                  {productId.trim() ? (
                    <div data-testid="playground-modal-product">
                      <ShowpassProductWidget
                        id={productId.trim()}
                        options={modalWidgetOptions}
                      />
                    </div>
                  ) : (
                    <div className="warning-box p-4 rounded-md border">
                      <p className="font-medium mb-1">⚠️ Setup Required</p>
                      <p className="text-sm">Enter your Product ID above to enable product sales.</p>
                    </div>
                  )}
                </div>
              </div>}
            </div>
          </div>
        )}

        {/* Mounted Widgets */}
        {activeTab === "mounted" && (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-card">
              {/* Calendar Widget */}
              {activeWidget === "calendar" && (
                venueId.trim() ? (
                  <div
                    data-testid="playground-mounted-calendar"
                    className="bg-background rounded-md border min-h-[600px] p-4"
                  >
                    <ShowpassMountedCalendarWidget venueId={venueId.trim()} themeColor={themeColor} environment={environment} />
                  </div>
                ) : (
                  <div className="warning-box p-4 rounded-md border">
                    <p className="font-medium mb-1">⚠️ Setup Required</p>
                    <p className="text-sm">Enter your Venue ID above to see the calendar widget in action.</p>
                  </div>
                )
              )}

              {/* Event Widget */}
              {activeWidget === "event" && (
                eventId.trim() ? (
                  <div
                    data-testid="playground-mounted-event"
                    className="bg-background rounded-md border min-h-[500px] p-4"
                  >
                    <ShowpassMountedEventWidget id={eventId.trim()} themeColor={themeColor} options={eventWidgetOptions} environment={environment} />
                  </div>
                ) : (
                  <div className="warning-box p-4 rounded-md border">
                    <p className="font-medium mb-1">⚠️ Setup Required</p>
                    <p className="text-sm">Enter your event slug above to enable ticket purchasing.</p>
                  </div>
                )
              )}

              {/* Membership Widget */}
              {activeWidget === "membership" && (
                membershipId.trim() ? (
                  <div
                    data-testid="playground-mounted-membership"
                    className="bg-background rounded-md border min-h-[500px] p-4"
                  >
                    <ShowpassMountedMembershipWidget id={membershipId.trim()} themeColor={themeColor} environment={environment} />
                  </div>
                ) : (
                  <div className="warning-box p-4 rounded-md border">
                    <p className="font-medium mb-1">⚠️ Setup Required</p>
                    <p className="text-sm">Enter your Membership ID above to show the join button.</p>
                  </div>
                )
              )}

              {/* Product Widget */}
              {activeWidget === "product" && (
                productId.trim() ? (
                  <div
                    data-testid="playground-mounted-product"
                    className="bg-background rounded-md border min-h-[500px] p-4"
                  >
                    <ShowpassMountedProductWidget id={productId.trim()} themeColor={themeColor} environment={environment} />
                  </div>
                ) : (
                  <div className="warning-box p-4 rounded-md border">
                    <p className="font-medium mb-1">⚠️ Setup Required</p>
                    <p className="text-sm">Enter your Product ID above to enable product sales.</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>}
    </div>
  );
};

export default WidgetPlayground;
