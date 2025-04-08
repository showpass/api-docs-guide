
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavigationProps {
  currentPath: string;
}

const Navigation = ({ currentPath }: NavigationProps) => {
  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="space-y-6">
      <div>
        <h3 className="sidebar-category">Introduction</h3>
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              className={cn("sidebar-link", isActive("/") && "active")}
            >
              Overview
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category">API Reference</h3>
        <ul className="space-y-1">
          <li>
            <Link 
              to="/api/events" 
              className={cn("sidebar-link", isActive("/api/events") && "active")}
            >
              Public Event API
            </Link>
          </li>
          <li>
            <Link 
              to="/api/event-list" 
              className={cn("sidebar-link", isActive("/api/event-list") && "active")}
            >
              Event List by Organization
            </Link>
          </li>
          <li>
            <Link 
              to="/api/query-event" 
              className={cn("sidebar-link", isActive("/api/query-event") && "active")}
            >
              Query a Specific Event
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category">SDK</h3>
        <ul className="space-y-1">
          <li>
            <Link 
              to="/sdk/getting-started" 
              className={cn("sidebar-link", isActive("/sdk/getting-started") && "active")}
            >
              Getting Started
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/ticket-selection" 
              className={cn("sidebar-link", isActive("/sdk/ticket-selection") && "active")}
            >
              Ticket Selection Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/product-selection" 
              className={cn("sidebar-link", isActive("/sdk/product-selection") && "active")}
            >
              Product Selection Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/shopping-cart" 
              className={cn("sidebar-link", isActive("/sdk/shopping-cart") && "active")}
            >
              Shopping Cart Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/check-out" 
              className={cn("sidebar-link", isActive("/sdk/check-out") && "active")}
            >
              Check Out Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/login" 
              className={cn("sidebar-link", isActive("/sdk/login") && "active")}
            >
              Login Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/calendar" 
              className={cn("sidebar-link", isActive("/sdk/calendar") && "active")}
            >
              Calendar Widget
            </Link>
          </li>
          <li>
            <Link 
              to="/sdk/cart-counter" 
              className={cn("sidebar-link", isActive("/sdk/cart-counter") && "active")}
            >
              Cart Quantity Counter
            </Link>
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="sidebar-category">Advanced</h3>
        <ul className="space-y-1">
          <li>
            <Link 
              to="/advanced/google-analytics" 
              className={cn("sidebar-link", isActive("/advanced/google-analytics") && "active")}
            >
              Google Analytics Integration
            </Link>
          </li>
          <li>
            <Link 
              to="/advanced/webhooks" 
              className={cn("sidebar-link", isActive("/advanced/webhooks") && "active")}
            >
              Webhooks
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
