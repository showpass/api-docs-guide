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
    { value: "advanced", condition: currentPath.startsWith("/advanced/") },
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
        <AccordionTrigger className="sidebar-category">
          Introduction
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30 py-2">
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
        <AccordionTrigger className="sidebar-category">
          API Reference
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30 py-2">
            <li>
              <NavLink
                to="/api/events"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Public Event API
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/event-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Event List by Organization
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/api/query-event"
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
        <AccordionTrigger className="sidebar-category">SDK</AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30 py-2">
            <li>
              <NavLink
                to="/sdk/getting-started"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Getting Started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/ticket-selection"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Ticket Selection Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/product-selection"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Product Selection Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/shopping-cart"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Shopping Cart Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/check-out"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Check Out Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/login"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Login Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/calendar"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Calendar Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/embedded-calendar"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Embedded Calendar Widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/sdk/cart-counter"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Cart Quantity Counter
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

      <AccordionItem value="advanced">
        <AccordionTrigger className="sidebar-category">
          Advanced
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30 py-2">
            <li>
              <NavLink
                to="/advanced/google-analytics"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Google Analytics Integration
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/advanced/webhooks"
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

      <AccordionItem value="showpass-wordpress-plugin">
        <AccordionTrigger className="sidebar-category">
          Showpass Wordpress Plugin
        </AccordionTrigger>
        <AccordionContent>
          <ul className="space-y-1 pl-5 border-l border-border/30 py-2">
            <li>
              <NavLink
                to="/wordpress/getting-started"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Getting started
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/single-button"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Add a single button or widget
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-an-event-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an event list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-an-event-detail-page"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an event detail page
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-a-calendar-widget"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding an event calendar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-a-product-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a product list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-a-membership-list"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a membership list
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-a-checkout-shopping-cart-button"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding the checkout component
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/adding-a-cart-counter"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Adding a custom cart counter
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/widgets-and-tracking-links-affiliate-tracking"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Widgets and tracking links
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/creating-custom-templates-for-showpass-data"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Creating custom templates
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/automatically-opening-pop-up-widgets-on-page-load"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Automatically opening the widget on page load
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wordpress/tips-troubleshooting-for-the-showpass-wordpress-plugin"
                className={({ isActive }) =>
                  cn("sidebar-link", isActive && "active")
                }
              >
                Tips &amp; Troubleshooting
              </NavLink>
            </li>
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default Navigation;
