import React, { useEffect } from "react";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button";
import SEOHead from "@/shared/components/SEOHead";
import { seoDataMap } from "@/docs-app/data/seoData";

const Index = () => {
  const activeSection = useScrollSpy("h2[id], h3[id]", 100);
  const { setPageData } = useDocLayoutData();
  const seoData = seoDataMap["/"];

  useEffect(() => {
    if (setPageData) {
      setPageData({
        activeSection: activeSection,
        hideRightSidebar: true,
        apiExamplesData: undefined,
      });
    }
    return () => {
      if (setPageData) {
        setPageData({
          tocItems: [],
          apiExamplesData: undefined,
          activeSection: undefined,
          hideRightSidebar: false,
        });
      }
    };
  }, [setPageData, activeSection]);

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
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
            <Link to="/widget-playground">Widget Playground</Link>
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

      <section id="facebook-pixels">
        <h2>Facebook Pixels & Conversions API</h2>
        <p>
          Integrate Facebook Pixel (Meta Pixel) and Conversions API with your Showpass events to track conversions, optimize advertising campaigns, and build custom audiences. Measure the effectiveness of your Facebook ads and gain valuable insights into ticket sales and attendee behavior.
        </p>
        <p className="mt-2">
          Learn how to set up both browser-based tracking with Facebook Pixel and server-side tracking with Conversions API for comprehensive data collection and improved attribution.
        </p>
        <Button asChild className="mt-4">
          <Link to="/facebook/01-introduction-to-facebook-pixel">
            Facebook Integration Guide
          </Link>
        </Button>
      </section>
    </>
  );
};

export default Index;
