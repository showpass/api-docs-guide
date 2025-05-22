import React from "react";
import { DocLayoutDataProvider } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button";

const Index = () => {
  const activeSection = useScrollSpy("h2[id], h3[id]", 100);

  const tableOfContentsItems = [
    { title: "Overview", href: "#overview" },
    { title: "Getting started with the SDK", href: "#getting-started-sdk" },
    { title: "Public API reference", href: "#api-reference" },
    { title: "Javascript SDK", href: "#javascript-sdk" },
    { title: "Showpass Wordpress plugin", href: "#wordpress-plugin" },
    { title: "Webhooks", href: "#webhooks" },
    { title: "Google Tag Manager", href: "#google-tag-manager" },
  ];

  const pageDataForLayout = {
    tocItems: tableOfContentsItems,
    activeSection: activeSection,
    hideRightSidebar: false,
    apiExamplesData: undefined,
  };

  return (
    <DocLayoutDataProvider {...pageDataForLayout}>
      <h1 className="mt-5">Showpass Developer Documentation</h1>

      <section id="overview">
        <h2>Overview</h2>
        <p>
          Welcome to the Showpass developer documentation. This site provides
          comprehensive information about the Showpass Public API, Javascript
          SDK, WordPress Plugin, Webhooks, and Google Tag Manager integration.
          Our goal is to help you seamlessly integrate Showpass ticket sales,
          event management, and tracking features into your websites and
          applications.
        </p>
      </section>

      <section id="getting-started-sdk">
        <h2>Getting started with the SDK</h2>
        <p>
          To begin integrating Showpass widgets and functionality into your
          website, include the Showpass SDK script. The recommended method is
          using the asynchronous loader:
        </p>
        <CodeBlock
          language="javascript"
          code={`(function(window, document, src) {
  let config = window.__shwps;
  if (typeof config === "undefined") {
    config = function() { config.c(arguments); };
    config.q = [];
    config.c = function(args) { config.q.push(args); };
    window.__shwps = config;
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;
    let x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }
})(window, document, 'https://www.showpass.com/static/dist/sdk.js');`}
        />
        <p className="mt-4">
          For detailed SDK setup and usage, please see the{" "}
          <Link
            to="/sdk/01-sdk-getting-started"
            className="underline hover:text-primary"
          >
            SDK Getting Started guide
          </Link>
          .
        </p>
      </section>

      <section id="api-reference">
        <h2>Public API reference</h2>
        <p>
          Access detailed information about Showpass events programmatically.
          Our Public Event API allows you to fetch, query, and display event
          data for your custom applications.
        </p>
        <p className="mt-2">
          Key endpoints include listing all events, filtering events by
          organization, and querying specific event details.
        </p>
        <Button asChild className="mt-4">
          <Link to="/api/01-public-api-introduction">
            Explore API Reference
          </Link>
        </Button>
      </section>

      <section id="javascript-sdk">
        <h2>Javascript SDK</h2>
        <p>
          Our Javascript SDK provides a suite of embeddable widgets and
          functions to integrate Showpass directly into your website frontend.
          Easily add ticket selection, product purchase flows, calendars,
          shopping cart functionality, and more.
        </p>
        <p className="mt-2">
          Widgets include: Ticket Purchase, Product Purchase, Membership
          Purchase, Event Calendar, Checkout, and Cart Quantity Listener.
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button asChild>
            <Link to="/sdk/01-sdk-getting-started">SDK Documentation</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/widgets">Widget Playground</Link>
          </Button>
        </div>
      </section>

      <section id="wordpress-plugin">
        <h2>Showpass Wordpress plugin</h2>
        <p>
          Effortlessly integrate Showpass into your WordPress site with our
          official plugin. Add event listings, buy buttons, calendars, and
          product displays using simple shortcodes, with extensive customization
          options available.
        </p>
        <Button asChild className="mt-4">
          <Link to="/wordpress/01-getting-started-install-and-configure">
            WordPress Plugin Guide
          </Link>
        </Button>
      </section>

      <section id="webhooks">
        <h2>Webhooks</h2>
        <p>
          Automate your workflows and receive real-time notifications for events
          occurring in Showpass. Integrate with external systems when new orders
          are placed, tickets are transferred, or refunds are processed.
        </p>
        <Button asChild className="mt-4">
          <Link to="/webhooks/01-webhooks-introduction">
            Learn about Webhooks
          </Link>
        </Button>
      </section>

      <section id="google-tag-manager">
        <h2>Google Tag Manager</h2>
        <p>
          Leverage Google Tag Manager (GTM) for advanced analytics and marketing
          tag integration. Track detailed ecommerce events, send data to Google
          Analytics 4 (GA4), and manage third-party pixels for comprehensive
          insights into customer behavior and conversions.
        </p>
        <Button asChild className="mt-4">
          <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">
            GTM Integration Guide
          </Link>
        </Button>
      </section>
    </DocLayoutDataProvider>
  );
};

export default Index;
