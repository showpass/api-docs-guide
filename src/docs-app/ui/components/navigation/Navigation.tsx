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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Showpass Discovery API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/02-public-api-event-list-by-organization"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Experience list by organization
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/03-public-api-query-specific-event"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/11-private-api-scan-ticket-by-code"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Ticket Verification
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/api/12-private-api-ticket-scan-actions"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/02-ticket-purchase-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Ticket purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/03-product-purchase-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Product purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/04-membership-purchase-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Membership purchase widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/05-event-calendar-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Event calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/06-checkout-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Checkout/shopping cart widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/07-cart-quantity-listener"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Cart quantity listener
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/sdk/08-basic-integration-example"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Basic integration example
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/widget-playground"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Getting started
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/02-adding-single-button-embed-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding a single button or widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/03-adding-event-list"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding an event list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/04-adding-event-detail-page"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding an event detail page
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/05-adding-calendar-widget"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding a calendar widget
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/06-adding-product-list"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding a product list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/07-adding-membership-list"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding a membership list
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/08-adding-checkout-cart-button"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Adding a checkout / cart button
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/09-advanced-dynamic-cart-counter-jquery"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Dynamic cart counter (jQuery)
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/10-widgets-and-affiliate-tracking-links"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Widgets & affiliate tracking
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/11-creating-custom-templates"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Creating custom templates
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/12-automatically-opening-popup-widgets"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Auto-opening popup widgets
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/wordpress/13-tips-and-troubleshooting"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Tips & troubleshooting
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
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Introduction
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/02-webhooks-setup-and-management"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Setup and management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/03-webhooks-security"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Security
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/04-webhooks-event-types"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Event types
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/05-webhooks-payload-invoice-object"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Payload invoice object
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/webhooks/06-webhooks-logging-and-troubleshooting"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Logging and troubleshooting
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="google-tag-manager">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Google Tag Manager
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/google-tag-manager/01-introduction-to-showpass-gtm-integration"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Introduction to Showpass Google Tag Manager (GTM) integration
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/02-initial-setup-ga4-and-gtm-basics"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Initial setup: GA4 and GTM basics
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Standard ecommerce tracking with GA4 via GTM
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/04-cross-domain-tracking-considerations"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Cross-domain tracking considerations
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Working with custom HTML & JavaScript in GTM for Showpass
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/06-tracking-custom-conversions-marketing-pixels"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Tracking custom conversions (e.g., marketing pixels)
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/07-showpass-data-layer-details"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Showpass data layer details
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Advanced & preferred: iFrame purchase tracking via postMessage
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Advanced: differentiating widget (iFrame) vs. direct
                    Showpass.com event tracking
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/google-tag-manager/10-example-google-ads-conversion-tracking-setup"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Example: Google Ads conversion tracking setup with GTM
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="facebook">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Facebook Pixels & Conversions API
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/facebook/01-introduction-to-facebook-pixel"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    About Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/02-installing-facebook-pixel"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Installing Facebook Pixel
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/03-about-facebook-conversions-api"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    About Facebook Conversions API
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/facebook/04-installing-facebook-conversions-api"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Installing Facebook Conversions API
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b-0 hover:no-underline">
              Security & Compliance
            </AccordionTrigger>
            <AccordionContent className="pb-2">
              <ul className="px-4 space-y-1">
                <li>
                  <NavLink
                    to="/security/01-compliance-overview"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/02-certifications"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    Certifications
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/security/03-pci-responsibility-matrix"
                    className={({ isActive }) =>
                      cn(
                        "block text-sm py-2 px-3 rounded-md transition-colors text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        isActive && "text-primary bg-muted font-medium"
                      )
                    }
                  >
                    PCI DSS Responsibilities
                  </NavLink>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      
      {/* Theme Toggle at Bottom - Sticky */}
      <div className="fixed bottom-0 left-0 w-[250px] bg-background border-t px-1 py-1 flex-shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navigation;