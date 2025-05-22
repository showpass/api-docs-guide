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
          Public API Reference
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
                Public Event API
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/02-public-api-event-list-by-organization"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event List by Organization
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/03-public-api-query-specific-event"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Query a Specific Event
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
                Getting Started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/02-ticket-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Ticket Purchase Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/03-product-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Product Purchase Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/04-membership-purchase-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Membership Purchase Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/05-event-calendar-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event Calendar Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/06-checkout-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Checkout/Shopping Cart Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/07-cart-quantity-listener"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Cart Quantity Listener
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/widgets"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Widget Playground
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="showpass-wordpress-plugin">
        <AccordionTrigger className="sidebar-category mt-0">
          Showpass Wordpress Plugin
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
                Getting Started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/02-adding-single-button-embed-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a Single Button or Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/03-adding-event-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an Event List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/04-adding-event-detail-page"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an Event Detail Page
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/05-adding-calendar-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a Calendar Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/06-adding-product-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a Product List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/07-adding-membership-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a Membership List
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/08-adding-checkout-cart-button"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a Checkout / Cart Button
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/09-advanced-dynamic-cart-counter-jquery"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Dynamic Cart Counter (jQuery)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/10-widgets-and-affiliate-tracking-links"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Widgets & Affiliate Tracking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/11-creating-custom-templates"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Creating Custom Templates
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/12-automatically-opening-popup-widgets"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Auto-Opening Popup Widgets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/13-tips-and-troubleshooting"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Tips & Troubleshooting
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
                to="/webhooks/getting-started"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Webhooks
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
                Introduction to Showpass Google Tag Manager (GTM) Integration
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/02-initial-setup-ga4-and-gtm-basics"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Initial Setup: GA4 and GTM Basics
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Standard Ecommerce Tracking with GA4 via GTM
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/04-cross-domain-tracking-considerations"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Cross-Domain Tracking Considerations
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Working with Custom HTML & JavaScript in GTM for Showpass
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/06-tracking-custom-conversions-marketing-pixels"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Tracking Custom Conversions (e.g., Marketing Pixels)
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/07-showpass-data-layer-details"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Showpass Data Layer Details
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Advanced & Preferred: iFrame Purchase Tracking via postMessage
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Advanced: Differentiating Widget (iFrame) vs. Direct
                showpass.com Event Tracking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/google-tag-manager/10-example-google-ads-conversion-tracking-setup"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Example: Google Ads Conversion Tracking Setup with GTM
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Navigation;
