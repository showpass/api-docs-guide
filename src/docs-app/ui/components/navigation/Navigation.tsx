import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/accordion.tsx";
import { ThemeToggle } from "@/shared/components/ThemeToggle.tsx";

interface NavigationProps {
  currentPath: string;
}

const getOpenSections = (currentPath: string): string[] => {
  if (currentPath === "/") {
    return ["introduction"];
  }
  if (currentPath.startsWith("/api/")) {
    if (currentPath.includes("-private-api-")) {
      return ["private-api-reference"];
    }
    return ["api-reference"];
  }
  if (currentPath.startsWith("/sdk/") || currentPath.startsWith("/widgets")) {
    return ["sdk"];
  }
  if (currentPath.startsWith("/wordpress/")) {
    return ["showpass-wordpress-plugin"];
  }
  if (currentPath.startsWith("/webhooks/")) {
    return ["webhooks"];
  }
  if (currentPath.startsWith("/google-tag-manager/")) {
    return ["google-tag-manager"];
  }
  if (currentPath.startsWith("/facebook/")) {
    return ["facebook"];
  }
  if (currentPath.startsWith("/security/")) {
    return ["security"];
  }
  return [];
};

const Navigation = ({ currentPath }: NavigationProps) => {
  const [openSections, setOpenSections] = useState<string[]>(() =>
    getOpenSections(currentPath)
  );

  useEffect(() => {
    const newOpenSections = getOpenSections(currentPath);
    setOpenSections((prev) => {
      const combined = [...new Set([...prev, ...newOpenSections])];
      return combined;
    });
  }, [currentPath]);

  // Elegant navigation link styling - subtle text changes with left indicator
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "block text-sm py-2 px-3 transition-colors text-muted-foreground hover:text-foreground relative",
      "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:rounded-full before:transition-colors",
      isActive && "text-primary font-medium before:bg-primary"
    );

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div 
        className="flex-1 overflow-y-auto navigation-scroll" 
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
        }}
      >
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="w-full"
        >
          <AccordionItem value="introduction">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Introduction
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4">
                <li>
                  <NavLink
                    to="/"
                    className={navLinkClass}
                  >
                    Overview
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="api-reference">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Public API reference
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/01-public-api-introduction"
                    className={navLinkClass}
                  >
                    Showpass Discovery API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/02-public-api-event-list-by-organization"
                    className={navLinkClass}
                  >
                    Experience list by organization
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/03-public-api-query-specific-event"
                    className={navLinkClass}
                  >
                    Query a specific experience
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="private-api-reference">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Private Organizer API
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/10-private-api-overview"
                    className={navLinkClass}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/11-private-api-scan-ticket-by-code"
                    className={navLinkClass}
                  >
                    Ticket Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/12-private-api-ticket-scan-actions"
                    className={navLinkClass}
                  >
                    Ticket Scan Actions
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sdk">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Javascript SDK
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/sdk/01-sdk-getting-started"
                    className={navLinkClass}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/02-ticket-purchase-widget"
                    className={navLinkClass}
                  >
                    Ticket purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/03-product-purchase-widget"
                    className={navLinkClass}
                  >
                    Product purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/04-membership-purchase-widget"
                    className={navLinkClass}
                  >
                    Membership purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/05-event-calendar-widget"
                    className={navLinkClass}
                  >
                    Event calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/06-checkout-widget"
                    className={navLinkClass}
                  >
                    Checkout/shopping cart widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/07-cart-quantity-listener"
                    className={navLinkClass}
                  >
                    Cart quantity listener
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/08-basic-integration-example"
                    className={navLinkClass}
                  >
                    Basic integration example
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/widget-playground"
                    className={navLinkClass}
                  >
                    Widget playground
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="showpass-wordpress-plugin">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Showpass Wordpress plugin
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/wordpress/01-getting-started-install-and-configure"
                    className={navLinkClass}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/02-adding-single-button-embed-widget"
                    className={navLinkClass}
                  >
                    Adding a single button or widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/03-adding-event-list"
                    className={navLinkClass}
                  >
                    Adding an event list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/04-adding-event-detail-page"
                    className={navLinkClass}
                  >
                    Adding an event detail page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/05-adding-calendar-widget"
                    className={navLinkClass}
                  >
                    Adding a calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/06-adding-product-list"
                    className={navLinkClass}
                  >
                    Adding a product list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/07-adding-membership-list"
                    className={navLinkClass}
                  >
                    Adding a membership list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/08-adding-checkout-cart-button"
                    className={navLinkClass}
                  >
                    Adding a checkout / cart button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/09-advanced-dynamic-cart-counter-jquery"
                    className={navLinkClass}
                  >
                    Advanced: Dynamic cart counter with jQuery
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/10-widgets-and-affiliate-tracking-links"
                    className={navLinkClass}
                  >
                    Widgets and affiliate tracking links
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/11-creating-custom-templates"
                    className={navLinkClass}
                  >
                    Creating custom templates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/12-automatically-opening-popup-widgets"
                    className={navLinkClass}
                  >
                    Automatically opening popup widgets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/13-tips-and-troubleshooting"
                    className={navLinkClass}
                  >
                    Tips and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="webhooks">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Webhooks
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/webhooks/01-webhooks-introduction"
                    className={navLinkClass}
                  >
                    Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/02-webhooks-setup-and-management"
                    className={navLinkClass}
                  >
                    Setup and management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/03-webhooks-security"
                    className={navLinkClass}
                  >
                    Security
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/04-webhooks-event-types"
                    className={navLinkClass}
                  >
                    Event types
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/05-webhooks-payload-invoice-object"
                    className={navLinkClass}
                  >
                    Payload: Invoice object
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/06-webhooks-logging-and-troubleshooting"
                    className={navLinkClass}
                  >
                    Logging and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="google-tag-manager">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Google Tag Manager integration
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/google-tag-manager/01-introduction-to-showpass-gtm-integration"
                    className={navLinkClass}
                  >
                    Introduction to Showpass GTM integration
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/02-initial-setup-ga4-and-gtm-basics"
                    className={navLinkClass}
                  >
                    Initial setup: GA4 and GTM basics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm"
                    className={navLinkClass}
                  >
                    Standard ecommerce tracking with GA4 via GTM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/04-cross-domain-tracking-considerations"
                    className={navLinkClass}
                  >
                    Cross-domain tracking considerations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass"
                    className={navLinkClass}
                  >
                    Working with custom HTML and JavaScript in GTM for Showpass
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/06-tracking-custom-conversions-marketing-pixels"
                    className={navLinkClass}
                  >
                    Tracking custom conversions / marketing pixels
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/07-showpass-data-layer-details"
                    className={navLinkClass}
                  >
                    Showpass Data Layer details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage"
                    className={navLinkClass}
                  >
                    Advanced: Iframe purchase tracking via postMessage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases"
                    className={navLinkClass}
                  >
                    Advanced: Tracking widget and direct purchases
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/10-example-google-ads-conversion-tracking-setup"
                    className={navLinkClass}
                  >
                    Example: Google Ads conversion tracking setup
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="facebook">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Facebook tracking
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/facebook/01-introduction-to-facebook-pixel"
                    className={navLinkClass}
                  >
                    Introduction to Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/02-installing-facebook-pixel"
                    className={navLinkClass}
                  >
                    Installing Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/03-about-facebook-conversions-api"
                    className={navLinkClass}
                  >
                    About Facebook Conversions API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/04-installing-facebook-conversions-api"
                    className={navLinkClass}
                  >
                    Installing Facebook Conversions API
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Security and compliance
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/security/01-compliance-overview"
                    className={navLinkClass}
                  >
                    Compliance overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/02-certifications"
                    className={navLinkClass}
                  >
                    Certifications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/03-pci-responsibility-matrix"
                    className={navLinkClass}
                  >
                    PCI responsibility matrix
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      <div className="border-t border-border p-4 flex justify-between items-center">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navigation;