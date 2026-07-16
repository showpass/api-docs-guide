import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Braces,
  Building2,
  Check,
  Code2,
  ExternalLink,
  Globe2,
  ShieldCheck,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import { seoDataMap } from "@/docs-app/data/seoData.ts";
import SEOHead from "@/shared/components/SEOHead.tsx";

type IntegrationId =
  | "public-api"
  | "javascript-sdk"
  | "organizer-api"
  | "wordpress"
  | "conversion-tracking"
  | "webhooks"
  | "security";

type TrackingGuideId = "google-tag-manager" | "meta";

interface TrackingGuide {
  id: TrackingGuideId;
  label: string;
  badge: string;
  codeLabel: string;
  codeLines: React.ReactNode[];
  action: string;
  to: string;
}

interface IntegrationPath {
  id: IntegrationId;
  label: string;
  outcome: string;
  title: string;
  description: string;
  facts: string[];
  codeLabel: string;
  codeLines: React.ReactNode[];
  action: string;
  to: string;
  icon: LucideIcon;
  trackingGuides?: TrackingGuide[];
  agentGuide?: {
    label: string;
    description: string;
    href: string;
  };
}

const gtmTrackingCodeLines = [
  <span key="gtm-guide-1">
    dataLayer.<span className="text-primary">push</span>({`{`}
  </span>,
  <span key="gtm-guide-2" className="pl-4 text-foreground">
    event: &quot;purchase&quot;,
  </span>,
  <span key="gtm-guide-3" className="pl-4 text-foreground">
    ecommerce: {`{ value, currency, transaction_id, items }`}
  </span>,
  <span key="gtm-guide-4">{`});`}</span>,
];

const integrationPaths: IntegrationPath[] = [
  {
    id: "javascript-sdk",
    label: "JavaScript SDK",
    outcome: "Embed purchase experiences",
    title: "Embed Showpass purchase and checkout flows in your site.",
    description:
      "Add event, product, membership, calendar, cart, and checkout experiences without rebuilding the Showpass purchase flow.",
    facts: ["Browser SDK", "Modal or embedded", "Hosted purchase flow"],
    codeLabel: "JavaScript",
    codeLines: [
      <span key="sdk-1">
        <span className="text-primary">showpass</span>.tickets
      </span>,
      <span key="sdk-2" className="pl-4 text-foreground">
        .eventPurchaseWidget(
      </span>,
      <span key="sdk-3" className="pl-8 text-foreground">
        &quot;my-event-slug&quot;,
      </span>,
      <span key="sdk-4" className="pl-8 text-foreground">
        {`{ "keep-shopping": true }`}
      </span>,
      <span key="sdk-5" className="pl-4">
        );
      </span>,
    ],
    action: "Read the widget guide",
    to: "/sdk/01-sdk-getting-started",
    icon: Code2,
    agentGuide: {
      label: "Integrate with your coding agent",
      description:
        "Give your coding agent the Showpass widget skill for framework-aware implementation guidance.",
      href: "https://github.com/showpass/api-docs-guide/tree/master/skills/build-showpass-widgets",
    },
  },
  {
    id: "public-api",
    label: "Public API",
    outcome: "Display Showpass events",
    title: "Search and display Showpass events in your product.",
    description:
      "Use public event data for listings, calendars, maps, and event pages. Responses are JSON and do not require an API token.",
    facts: ["REST API", "JSON responses", "No authentication"],
    codeLabel: "Request",
    codeLines: [
      <span key="public-1">
        <span className="text-primary">GET</span> /api/public/discovery/
      </span>,
      <span key="public-2" className="pl-4 text-foreground">
        Host: www.showpass.com
      </span>,
      <span key="public-3" className="pl-4 text-foreground">
        Query: page_size=3
      </span>,
    ],
    action: "Read the Discovery API",
    to: "/api/01-public-api-introduction",
    icon: Braces,
  },
  {
    id: "organizer-api",
    label: "Private Organizer API",
    outcome: "Connect ticket operations",
    title:
      "Bring ticket verification, scanning, discounts, and access control into your tools.",
    description:
      "Use authenticated organizer endpoints to connect check-in and ticket operations to internal applications or partner systems.",
    facts: ["REST API", "Organizer authentication", "Ticket operations"],
    codeLabel: "HTTP",
    codeLines: [
      <span key="organizer-1">
        <span className="text-primary">GET</span> /api/venue/{`{venue_id}`}/
      </span>,
      <span key="organizer-2" className="pl-4 text-foreground">
        tickets/items/scan/
      </span>,
      <span key="organizer-3" className="pl-4 text-foreground">
        ?code={`{ticket_code}`}
      </span>,
      <span key="organizer-4" className="pt-2 text-muted-foreground">
        Authorization: Token YOUR_API_TOKEN
      </span>,
    ],
    action: "Read the Organizer API",
    to: "/api/10-private-api-overview",
    icon: Building2,
  },
  {
    id: "wordpress",
    label: "WordPress plugin",
    outcome: "Add Showpass to WordPress",
    title: "Publish events and purchase experiences in WordPress.",
    description:
      "Use official shortcodes and templates for event lists, event pages, calendars, and Showpass purchase widgets.",
    facts: ["Event publishing", "Purchase widgets", "Custom templates"],
    codeLabel: "Shortcode",
    codeLines: [
      <span key="wordpress-1" className="text-foreground">
        [showpass_events
      </span>,
      <span key="wordpress-2" className="pl-4 text-foreground">
        type=&quot;list&quot;
      </span>,
      <span key="wordpress-3" className="pl-4 text-foreground">
        page_size=&quot;5&quot;
      </span>,
      <span key="wordpress-4" className="text-foreground">
        ]
      </span>,
    ],
    action: "Set up the WordPress plugin",
    to: "/wordpress/01-getting-started-install-and-configure",
    icon: Globe2,
  },
  {
    id: "conversion-tracking",
    label: "Conversion tracking",
    outcome: "Measure purchases and campaigns",
    title:
      "Send Showpass conversion activity to your analytics and advertising tools.",
    description:
      "Connect GA4 through Google Tag Manager or use Meta Pixel and the Conversions API for campaign attribution.",
    facts: ["GA4 + GTM", "Meta Pixel", "Conversions API"],
    codeLabel: "Data layer",
    codeLines: gtmTrackingCodeLines,
    action: "Open the GTM guide",
    to: "/google-tag-manager/01-introduction-to-showpass-gtm-integration",
    icon: BarChart3,
    trackingGuides: [
      {
        id: "google-tag-manager",
        label: "Google Tag Manager",
        badge: "GA4 + GTM",
        codeLabel: "Data layer",
        codeLines: gtmTrackingCodeLines,
        action: "Open the GTM guide",
        to: "/google-tag-manager/01-introduction-to-showpass-gtm-integration",
      },
      {
        id: "meta",
        label: "Meta",
        badge: "Pixel + CAPI",
        codeLabel: "Organizer settings",
        codeLines: [
          <span key="meta-guide-1" className="text-foreground">
            Pixel ID: 123456789012345
          </span>,
          <span key="meta-guide-2" className="text-foreground">
            Conversions API: enabled
          </span>,
          <span key="meta-guide-3" className="text-foreground">
            Events: AddToCart, Purchase
          </span>,
        ],
        action: "Open the Meta guide",
        to: "/facebook/01-introduction-to-facebook-pixel",
      },
    ],
  },
  {
    id: "webhooks",
    label: "Webhooks",
    outcome: "Sync Showpass with your systems",
    title:
      "Send purchases, refunds, and transfers to your CRM, automation, or backend.",
    description:
      "Deliver Showpass activity to Zapier, customer records, data pipelines, and internal services through signed webhooks.",
    facts: ["HTTP webhooks", "Event payloads", "Signed delivery"],
    codeLabel: "Delivery",
    codeLines: [
      <span key="webhooks-1">
        <span className="text-primary">POST</span> /api/showpass-webhook
      </span>,
      <span key="webhooks-2" className="text-foreground">
        X-SHOWPASS-SIGNATURE: ...
      </span>,
      <span key="webhooks-3" className="text-foreground">
        event_type: invoice.purchase
      </span>,
    ],
    action: "Configure webhooks",
    to: "/webhooks/01-webhooks-introduction",
    icon: Webhook,
  },
  {
    id: "security",
    label: "Security & compliance",
    outcome: "Prepare for security review",
    title: "Review the controls and responsibilities for your integration.",
    description:
      "Find certifications, platform controls, privacy practices, and shared PCI responsibilities before launch.",
    facts: ["PCI DSS Level 1", "TX-RAMP", "GDPR-aligned"],
    codeLabel: "Highlights",
    codeLines: [
      <span key="security-1" className="text-foreground">
        Payments: tokenized
      </span>,
      <span key="security-2" className="text-foreground">
        Access: MFA + role based
      </span>,
      <span key="security-3" className="text-foreground">
        Transport: end-to-end TLS
      </span>,
    ],
    action: "Review security & compliance",
    to: "/security/01-compliance-overview",
    icon: ShieldCheck,
  },
];

const Index = () => {
  const { setPageData } = useDocLayoutData();
  const seoData = seoDataMap["/"];
  const [selectedId, setSelectedId] = useState<IntegrationId>("javascript-sdk");
  const [selectedTrackingGuideId, setSelectedTrackingGuideId] =
    useState<TrackingGuideId>("google-tag-manager");
  const selectedPath =
    integrationPaths.find(({ id }) => id === selectedId) ?? integrationPaths[0];
  const selectedTrackingGuide = selectedPath.trackingGuides?.find(
    ({ id }) => id === selectedTrackingGuideId,
  );
  const activeCodeLabel =
    selectedTrackingGuide?.codeLabel ?? selectedPath.codeLabel;
  const activeCodeLines =
    selectedTrackingGuide?.codeLines ?? selectedPath.codeLines;
  const activeAction = selectedTrackingGuide?.action ?? selectedPath.action;
  const activeDestination = selectedTrackingGuide?.to ?? selectedPath.to;
  const activeBadge = selectedTrackingGuide?.badge ?? selectedPath.facts[0];

  useLayoutEffect(() => {
    setPageData({
      hideRightSidebar: true,
      tocItems: [],
      apiExamplesData: undefined,
      activeSection: undefined,
      pageTitle: undefined,
    });
  }, [setPageData]);

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />

      <div className="not-prose pb-10 pt-7 sm:pt-8 2xl:pb-4 2xl:pt-6">
        <header className="max-w-[48rem]">
          <h1 className="m-0 text-[2.4rem] font-bold leading-[1.05] tracking-[-0.045em] text-foreground sm:text-[2.8rem]">
            Build with <span className="text-primary">Showpass.</span>
          </h1>
          <p className="mb-0 mt-2.5 text-base leading-7 text-muted-foreground sm:text-lg">
            Choose the capability your application needs.
          </p>
        </header>

        <section
          aria-labelledby="integration-heading"
          className="mt-7 2xl:mt-6"
        >
          <h2 id="integration-heading" className="sr-only">
            Choose an integration
          </h2>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_48px_-36px_hsl(var(--foreground)/0.22)] lg:grid lg:grid-cols-[21rem_minmax(0,1fr)]">
            <div
              aria-label="Integration options"
              className="page-tools-scroll flex snap-x gap-1 overflow-x-auto border-b border-border bg-muted/[0.08] p-2 lg:block lg:overflow-visible lg:border-b-0 lg:border-r"
            >
              {integrationPaths.map(({ id, label, outcome, icon: Icon }) => {
                const isSelected = id === selectedId;

                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedId(id)}
                    className={`group/option flex min-h-[4.75rem] w-full min-w-[12.75rem] snap-start items-center gap-3 rounded-xl px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:min-w-0 ${
                      isSelected
                        ? "bg-background text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                        : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        isSelected
                          ? "border-primary/25 bg-primary/[0.08] text-primary"
                          : "border-border bg-background/30 text-muted-foreground group-hover/option:text-primary"
                      }`}
                    >
                      <Icon
                        className="h-[1.125rem] w-[1.125rem]"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.14em]">
                        {label}
                      </span>
                      <span className="mt-1 block text-sm font-semibold text-foreground">
                        {outcome}
                      </span>
                    </span>
                    <ArrowRight
                      className={`ml-auto hidden h-4 w-4 shrink-0 lg:block ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            <div
              aria-live="polite"
              className="grid min-w-0 lg:min-h-[34.25rem] xl:grid-cols-[minmax(0,1fr)_minmax(23rem,0.82fr)]"
            >
              <div className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 xl:px-10 2xl:px-12">
                <h3 className="m-0 max-w-[32rem] text-[1.7rem] font-semibold leading-[1.15] tracking-[-0.035em] text-foreground sm:text-[2rem] 2xl:text-[1.8rem]">
                  {selectedPath.title}
                </h3>
                <p className="mb-0 mt-3 max-w-[34rem] text-sm leading-6 text-muted-foreground">
                  {selectedPath.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {selectedPath.facts.map((fact) => (
                    <span
                      key={fact}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <Check
                        className="h-3.5 w-3.5 text-primary"
                        aria-hidden="true"
                      />
                      {fact}
                    </span>
                  ))}
                </div>
                <Link
                  to={activeDestination}
                  className="group/action mt-6 inline-flex min-h-10 self-start items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {activeAction}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <aside
                aria-label={
                  selectedPath.trackingGuides
                    ? "Conversion tracking guides"
                    : "Implementation example"
                }
                className="flex min-w-0 items-center border-t border-border bg-muted/[0.07] px-5 py-8 sm:px-8 sm:py-10 xl:border-l xl:border-t-0 xl:px-8"
              >
                <div className="w-full min-w-0">
                  <p className="m-0 mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {selectedPath.trackingGuides
                      ? "Choose a tracking guide"
                      : "Implementation example"}
                  </p>

                  {selectedPath.trackingGuides && (
                    <div
                      aria-label="Conversion tracking platform"
                      className="mb-3 grid grid-cols-2 gap-1 rounded-xl border border-border bg-background/40 p-1"
                    >
                      {selectedPath.trackingGuides.map((guide) => {
                        const isSelected = guide.id === selectedTrackingGuideId;

                        return (
                          <button
                            key={guide.id}
                            type="button"
                            aria-pressed={isSelected}
                            onClick={() => setSelectedTrackingGuideId(guide.id)}
                            className={`min-h-9 rounded-lg px-3 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              isSelected
                                ? "bg-card text-foreground shadow-[inset_0_0_0_1px_hsl(var(--border))]"
                                : "text-muted-foreground hover:bg-muted/20 hover:text-foreground"
                            }`}
                          >
                            {guide.label}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-sidebar/55">
                    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                      <span className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {activeCodeLabel}
                      </span>
                      <span className="flex items-center gap-2 text-[0.625rem] text-muted-foreground">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-primary"
                          aria-hidden="true"
                        />
                        {activeBadge}
                      </span>
                    </div>
                    <div className="overflow-x-auto px-4 py-4 font-mono text-[0.75rem] leading-6 text-sidebar-foreground">
                      <div className="min-w-max">
                        {activeCodeLines.map((line, index) => (
                          <div
                            key={index}
                            className="flex gap-3 whitespace-nowrap"
                          >
                            <span className="w-3 select-none text-right text-muted-foreground">
                              {index + 1}
                            </span>
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedPath.agentGuide && (
                    <a
                      href={selectedPath.agentGuide.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group/agent mt-4 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/[0.05] px-4 py-3.5 text-left hover:border-primary/35 hover:bg-primary/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/[0.08] text-primary">
                        <Bot className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                          {selectedPath.agentGuide.label}
                        </span>
                        <span className="mt-0.5 block text-xs leading-[1.125rem] text-muted-foreground">
                          {selectedPath.agentGuide.description}
                        </span>
                      </span>
                      <ExternalLink
                        className="h-4 w-4 shrink-0 text-muted-foreground group-hover/agent:text-primary"
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
