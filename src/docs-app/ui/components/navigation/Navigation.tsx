import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/shared/lib/utils.ts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/accordion";

interface NavigationProps {
  currentPath: string;
}

const getActiveSections = (currentPath: string) => {
  const sectionConfigs = [
    { value: "introduction", condition: currentPath === "/" },
    { value: "api-reference", condition: currentPath.startsWith("/api/") },
    {
      value: "sdk",
      condition:
        currentPath.startsWith("/sdk/") || currentPath.startsWith("/widgets"),
    },
    { value: "webhooks", condition: currentPath.startsWith("/webhooks/") },
    {
      value: "google-tag-manager",
      condition: currentPath.startsWith("/google-tag-manager/"),
    },
    {
      value: "showpass-wordpress-plugin",
      condition: currentPath.startsWith("/wordpress/"),
    },
  ];
  return sectionConfigs
    .filter((section) => section.condition)
    .map((section) => section.value);
};

const Navigation = ({ currentPath }: NavigationProps) => {
  const [openSections, setOpenSections] = useState<string[]>(() =>
    getActiveSections(currentPath)
  );

  useEffect(() => {
    setOpenSections(getActiveSections(currentPath));
  }, [currentPath]);

  return (
    <Accordion
      type="multiple"
      value={openSections}
      onValueChange={setOpenSections}
      className="w-full"
    >
      <AccordionItem value="introduction">
        <AccordionTrigger className="sidebar-category mt-0">
          Introduction
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Overview
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="api-reference">
        <AccordionTrigger className="sidebar-category mt-0">
          Public API reference
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/api/01-public-api-introduction"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Public event API
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/02-public-api-event-list-by-organization"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event list by organization
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/03-public-api-query-specific-event"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Query a specific event
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="sdk">
        <AccordionTrigger className="sidebar-category mt-0">
          Javascript SDK
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/sdk/01-sdk-getting-started"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Getting started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/02-ticket-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Ticket purchase widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/03-product-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Product purchase widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/04-membership-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Membership purchase widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/05-event-calendar-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event calendar widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/06-checkout-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Checkout/shopping cart widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/07-cart-quantity-listener"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Cart quantity listener
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/widgets"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Widget playground
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="showpass-wordpress-plugin">
        <AccordionTrigger className="sidebar-category mt-0">
          Showpass Wordpress plugin
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/wordpress/01-getting-started-install-and-configure"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Getting started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/02-adding-single-button-embed-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a single button or widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/03-adding-event-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an event list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/04-adding-event-detail-page"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an event detail page
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/05-adding-calendar-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a calendar widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/06-adding-product-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a product list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/07-adding-membership-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a membership list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/08-adding-checkout-cart-button"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a checkout / cart button
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/09-advanced-dynamic-cart-counter-jquery"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Dynamic cart counter (jQuery)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/10-widgets-and-affiliate-tracking-links"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Widgets & affiliate tracking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/11-creating-custom-templates"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Creating custom templates
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/12-automatically-opening-popup-widgets"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Auto-opening popup widgets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/13-tips-and-troubleshooting"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Tips & troubleshooting
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="webhooks">
        <AccordionTrigger className="sidebar-category mt-0">
          Webhooks
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/webhooks/01-webhooks-introduction"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Introduction
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/webhooks/02-webhooks-setup-and-management"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Setup and management
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/webhooks/03-webhooks-security"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Security
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/webhooks/04-webhooks-event-types"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event types
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/webhooks/05-webhooks-payload-invoice-object"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Payload invoice object
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/webhooks/06-webhooks-logging-and-troubleshooting"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Logging and troubleshooting
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="google-tag-manager">
        <AccordionTrigger className="sidebar-category mt-0">
          Google Tag Manager
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30">
            <li>
              <NavLink
                to="/google-tag-manager/01-introduction-to-showpass-gtm-integration"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Introduction to Showpass Google Tag Manager (GTM) integration
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/02-initial-setup-ga4-and-gtm-basics"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Initial setup: GA4 and GTM basics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Standard ecommerce tracking with GA4 via GTM
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/04-cross-domain-tracking-considerations"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Cross-domain tracking considerations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Working with custom HTML & JavaScript in GTM for Showpass
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/06-tracking-custom-conversions-marketing-pixels"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Tracking custom conversions (e.g., marketing pixels)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/07-showpass-data-layer-details"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Showpass data layer details
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Advanced & preferred: iFrame purchase tracking via postMessage
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
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
                  cn("sidebar-link", isActive && "active")
                }
              >
                Example: Google Ads conversion tracking setup with GTM
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Navigation;
