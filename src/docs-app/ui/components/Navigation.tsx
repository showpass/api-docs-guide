
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/shared/lib/utils.ts";
import { ChevronRight } from 'lucide-react';

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath }: NavigationProps) => {
  return (
    <nav className="space-y-8">
      <div>
        <h3 className="sidebar-category flex items-center">
          <ChevronRight className="h-4 w-4 mr-1" />
          Introduction
        </h3>
        <ul className="space-y-1 pl-5 border-l border-border/30">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Overview
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category flex items-center">
          <ChevronRight className="h-4 w-4 mr-1" />
          API Reference
        </h3>
        <ul className="space-y-1 pl-5 border-l border-border/30">
          <li>
            <NavLink 
              to="/api/events" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Public Event API
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/api/event-list" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Event List by Organization
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/api/query-event" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Query a Specific Event
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category flex items-center">
          <ChevronRight className="h-4 w-4 mr-1" />
          SDK
        </h3>
        <ul className="space-y-1 pl-5 border-l border-border/30">
          <li>
            <NavLink 
              to="/sdk/getting-started" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Getting Started
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/ticket-selection" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Ticket Selection Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/product-selection" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Product Selection Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/shopping-cart" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Shopping Cart Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/check-out" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Check Out Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/login" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Login Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/calendar" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Calendar Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/embedded-calendar" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Embedded Calendar Widget
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/sdk/cart-counter" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Cart Quantity Counter
            </NavLink>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category flex items-center">
          <ChevronRight className="h-4 w-4 mr-1" />
          Advanced
        </h3>
        <ul className="space-y-1 pl-5 border-l border-border/30">
          <li>
            <NavLink 
              to="/advanced/google-analytics" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Google Analytics Integration
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/advanced/webhooks" 
              className={({ isActive }) => cn("sidebar-link", isActive && "active")}
            >
              Webhooks
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
