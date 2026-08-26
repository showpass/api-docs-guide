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
  if (currentPath.startsWith("/api/")) {
    if (currentPath.includes("partner-api-")) {
      return ["partner-api-reference"];
    }
    if (currentPath.includes("private-api-")) {
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
    return ["meta"];
  }
  if (currentPath.startsWith("/security/")) {
    return ["security"];
  }
  return [];
};

const accordionTriggerClass =
  "rounded-md border-b-0 px-2 py-2.5 text-left text-sm font-medium leading-5 tracking-normal text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar";

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
      "relative block rounded-md px-3 py-2 text-sm leading-5 tracking-normal text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-1 focus-visible:ring-offset-sidebar",
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
          <AccordionItem value="api-reference">
            <AccordionTrigger className={accordionTriggerClass}>
              Public API reference
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/public-api-introduction"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Showpass Discovery API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/public-api-event-list-by-organization"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Experience list by organization
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/public-api-query-specific-event"
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
                    to="/api/private-api-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/private-api-scan-ticket-by-code"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/private-api-ticket-scan-actions"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket Scan Actions
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/private-api-tracking-links"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Tracking Links
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/private-api-discounts"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Discounts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/private-api-passwords"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Passwords
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="partner-api-reference">
            <AccordionTrigger className={accordionTriggerClass}>
              Partner API
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/api/partner-api-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/partner-api-users"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Create or reuse a partner user
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/partner-api-customer-attribution-token"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Customer attribution token
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/partner-api-order-manage-link"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Order-management link
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/partner-api-webhooks"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Partner attribution in webhooks
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
                    to="/webhooks/webhooks-introduction"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/webhooks-setup-and-management"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Setup and management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/webhooks-security"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Security
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/webhooks-event-types"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Event types
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/webhooks-payload-invoice-object"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Payload: Invoice object
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/webhooks-logging-and-troubleshooting"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Logging and troubleshooting
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
                    to="/sdk/sdk-getting-started"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/ticket-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ticket purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/product-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Product purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/membership-purchase-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Membership purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/event-calendar-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Event calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/checkout-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Checkout/shopping cart widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/cart-quantity-listener"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Cart quantity listener
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/basic-integration-example"
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
                    to="/cli/overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/cli/commands"
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
                    to="/wordpress/getting-started-install-and-configure"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-single-button-embed-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a single button or widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-event-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding an event list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-event-detail-page"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding an event detail page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-calendar-widget"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-product-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a product list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-membership-list"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a membership list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/adding-checkout-cart-button"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Adding a checkout / cart button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/advanced-dynamic-cart-counter-jquery"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Advanced: Dynamic cart counter with jQuery
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/widgets-and-affiliate-tracking-links"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Widgets and affiliate tracking links
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/creating-custom-templates"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Creating custom templates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/automatically-opening-popup-widgets"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Automatically opening popup widgets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/tips-and-troubleshooting"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Tips and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="google-tag-manager">
            <AccordionTrigger className={accordionTriggerClass}>
              Google Tag Manager
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/google-tag-manager/introduction-to-showpass-gtm-integration"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Introduction to Showpass GTM integration
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/initial-setup-ga4-and-gtm-basics"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Initial setup: GA4 and GTM basics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/standard-ecommerce-tracking-with-ga4-via-gtm"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Standard ecommerce tracking with GA4 via GTM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/cross-domain-tracking-considerations"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Cross-domain tracking considerations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/working-with-custom-html-and-javascript-in-gtm-for-showpass"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Working with custom HTML and JavaScript in GTM for Showpass
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/tracking-custom-conversions-marketing-pixels"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Tracking custom conversions / marketing pixels
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/showpass-data-layer-details"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Showpass Data Layer details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/advanced-iframe-purchase-tracking-via-postmessage"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Advanced: Iframe purchase tracking via postMessage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/advanced-tracking-widget-and-direct-purchases"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Advanced: Tracking widget and direct purchases
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/example-google-ads-conversion-tracking-setup"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Example: Google Ads conversion tracking setup
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/gtm-faq-troubleshooting-guide"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    FAQ and Troubleshooting guide
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/json-ready-to-use-importable-containers"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Ready-to-use importable containers
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="meta">
            <AccordionTrigger className={accordionTriggerClass}>
              Meta tracking
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/facebook/introduction-to-facebook-pixel"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Introduction to Meta Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/installing-facebook-pixel"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Installing Meta Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/about-facebook-conversions-api"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    About Meta Conversions API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/installing-facebook-conversions-api"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Installing Meta Conversions API
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
                    to="/security/compliance-overview"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Compliance overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/certifications"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    Certifications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/pci-responsibility-matrix"
                    className={navLinkClass}
                    onClick={handleLinkClick}
                  >
                    PCI responsibility matrix
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/outgoing-ip-addresses"
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
