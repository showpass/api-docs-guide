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
import "./navigation.css";

interface NavigationProps {
  currentPath: string;
  onNavigate?: () => void;
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
  if (currentPath.startsWith("/cli/")) {
    return ["cli"];
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

const accordionTriggerClass =
  "rounded-md border-b-0 px-2 py-2.5 text-left text-sm font-medium leading-5 [word-spacing:0.12em] text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar";

const Navigation = ({ currentPath, onNavigate }: NavigationProps) => {
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

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative block rounded-md px-3 py-2 text-sm leading-5 [word-spacing:0.04em] text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
      "before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-4 before:rounded-full before:transition-colors",
      isActive && "font-medium text-primary before:bg-primary"
    );

  const handleLinkClick = () => {
    onNavigate?.();
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="navigation-scroll min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-1">
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="w-full"
        >
          <AccordionItem value="introduction">
            <AccordionTrigger className={accordionTriggerClass}>
              Introduction
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4">
                <li>
                  <NavLink
                    to="/"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="api-reference">
            <AccordionTrigger className={accordionTriggerClass}>
              Public API reference
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/01-public-api-introduction"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Showpass Discovery API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/02-public-api-event-list-by-organization"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Experience list by organization
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/03-public-api-query-specific-event"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Query a specific experience
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="private-api-reference">
            <AccordionTrigger className={accordionTriggerClass}>
              Private Organizer API
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/10-private-api-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/11-private-api-scan-ticket-by-code"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/12-private-api-ticket-scan-actions"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket Scan Actions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/20-private-api-tracking-links"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Tracking Links
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/21-private-api-discounts"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Discounts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/22-private-api-passwords"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Passwords
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="sdk">
            <AccordionTrigger className={accordionTriggerClass}>
              JavaScript SDK
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/sdk/01-sdk-getting-started"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/02-ticket-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/03-product-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Product purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/04-membership-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Membership purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/05-event-calendar-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Event calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/06-checkout-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Checkout/shopping cart widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/07-cart-quantity-listener"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Cart quantity listener
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/08-basic-integration-example"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Basic integration example
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/widget-playground"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Widget playground
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cli">
            <AccordionTrigger className={accordionTriggerClass}>
              CLI
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/cli/01-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cli/02-commands"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Commands reference
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="showpass-wordpress-plugin">
            <AccordionTrigger className={accordionTriggerClass}>
              Showpass WordPress plugin
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/wordpress/01-getting-started-install-and-configure"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/02-adding-single-button-embed-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a single button or widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/03-adding-event-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding an event list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/04-adding-event-detail-page"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding an event detail page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/05-adding-calendar-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/06-adding-product-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a product list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/07-adding-membership-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a membership list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/08-adding-checkout-cart-button"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a checkout / cart button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/09-advanced-dynamic-cart-counter-jquery"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Advanced: Dynamic cart counter with jQuery
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/10-widgets-and-affiliate-tracking-links"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Widgets and affiliate tracking links
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/11-creating-custom-templates"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Creating custom templates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/12-automatically-opening-popup-widgets"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Automatically opening popup widgets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/13-tips-and-troubleshooting"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Tips and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="webhooks">
            <AccordionTrigger className={accordionTriggerClass}>
              Webhooks
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/webhooks/01-webhooks-introduction"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    1. Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/02-webhooks-setup-and-management"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    2. Setup and management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/03-webhooks-security"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    3. Security
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/04-webhooks-event-types"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    4. Event types
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/05-webhooks-payload-invoice-object"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    5. Payload: Invoice object
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/06-webhooks-logging-and-troubleshooting"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    6. Logging and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="google-tag-manager">
            <AccordionTrigger className={accordionTriggerClass}>
              Google Tag Manager integration
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/google-tag-manager/01-introduction-to-showpass-gtm-integration"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    1. Introduction to Showpass GTM integration
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/02-initial-setup-ga4-and-gtm-basics"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    2. Initial setup: GA4 and GTM basics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    3. Standard ecommerce tracking with GA4 via GTM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/04-cross-domain-tracking-considerations"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    4. Cross-domain tracking considerations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    5. Working with custom HTML and JavaScript in GTM for Showpass
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/06-tracking-custom-conversions-marketing-pixels"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    6. Tracking custom conversions / marketing pixels
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/07-showpass-data-layer-details"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    7. Showpass Data Layer details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    8. Advanced: Iframe purchase tracking via postMessage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    9. Advanced: Tracking widget and direct purchases
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/10-example-google-ads-conversion-tracking-setup"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    10. Example: Google Ads conversion tracking setup
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/11-gtm-faq-troubleshooting-guide"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    11. FAQ and Troubleshooting guide
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/12-json-ready-to-use-importable-containers"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    12. Ready-to-use importable containers
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="facebook">
            <AccordionTrigger className={accordionTriggerClass}>
              Facebook tracking
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/facebook/01-introduction-to-facebook-pixel"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Introduction to Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/02-installing-facebook-pixel"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Installing Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/03-about-facebook-conversions-api"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    About Facebook Conversions API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/04-installing-facebook-conversions-api"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Installing Facebook Conversions API
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger className={accordionTriggerClass}>
              Security and compliance
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/security/01-compliance-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Compliance overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/02-certifications"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Certifications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/03-pci-responsibility-matrix"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    PCI responsibility matrix
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/04-outgoing-ip-addresses"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Outgoing IP addresses
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <div className="border-t border-sidebar-border bg-sidebar px-5 py-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navigation;
