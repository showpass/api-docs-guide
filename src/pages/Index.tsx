import React, { useEffect } from "react";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button";
import SEOHead from "@/shared/components/SEOHead";
import { seoDataMap } from "@/docs-app/data/seoData";

const Index = () => {
  const { setPageData } = useDocLayoutData();
  const seoData = seoDataMap["/"];

  useEffect(() => {
    if (setPageData) {
      setPageData({
        hideRightSidebar: true,
        apiExamplesData: undefined,
      });
    }
    return () => {
      if (setPageData) {
        setPageData({
          tocItems: [],
          apiExamplesData: undefined,
          hideRightSidebar: false,
        });
      }
    };
  }, [setPageData]);

  return (
    <>
      <SEOHead 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      <div className="max-w-4xl ml-8 px-6 py-8 border-l-4 border-primary bg-gradient-to-br from-white to-slate-50/30 dark:from-gray-900 dark:to-gray-800">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-slate-700 dark:from-primary dark:to-slate-300">Showpass Developer Documentation</h1>

        <div className="space-y-12">
          <section id="overview" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Overview</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Welcome to the Showpass developer documentation. This site provides
              comprehensive information about the Showpass Public API, Javascript
              SDK, WordPress Plugin, Webhooks, and Google Tag Manager integration.
              Our goal is to help you seamlessly integrate Showpass ticket sales,
              event management, and tracking features into your websites and
              applications.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section id="api-reference" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Public API reference</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Access detailed information about Showpass events programmatically.
                Our Public Event API allows you to fetch, query, and display event
                data for your custom applications.
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                Key endpoints include listing all events, filtering events by
                organization, and querying specific event details.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/api/01-public-api-introduction">
                  Explore API Reference
                </Link>
              </Button>
            </section>

            <section id="javascript-sdk" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Javascript SDK</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Our Javascript SDK provides a suite of embeddable widgets and
                functions to integrate Showpass directly into your website frontend.
                Easily add ticket selection, product purchase flows, calendars,
                shopping cart functionality, and more.
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                Widgets include: Ticket Purchase, Product Purchase, Membership
                Purchase, Event Calendar, Checkout, and Cart Quantity Listener.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                <Button asChild className="flex-1">
                  <Link to="/sdk/01-sdk-getting-started">SDK Documentation</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/widget-playground">Widget Playground</Link>
                </Button>
              </div>
            </section>

            <section id="wordpress-plugin" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Showpass Wordpress plugin</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Effortlessly integrate Showpass into your WordPress site with our
                official plugin. Add event listings, buy buttons, calendars, and
                product displays using simple shortcodes, with extensive customization
                options available.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/wordpress/01-getting-started-install-and-configure">
                  WordPress Plugin Guide
                </Link>
              </Button>
            </section>

            <section id="webhooks" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Webhooks</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Automate your workflows and receive real-time notifications for events
                occurring in Showpass. Integrate with external systems when new orders
                are placed, tickets are transferred, or refunds are processed.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/webhooks/01-webhooks-introduction">
                  Learn about Webhooks
                </Link>
              </Button>
            </section>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section id="google-tag-manager" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Google Tag Manager</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Leverage Google Tag Manager (GTM) for advanced analytics and marketing
                tag integration. Track detailed ecommerce events, send data to Google
                Analytics 4 (GA4), and manage third-party pixels for comprehensive
                insights into customer behavior and conversions.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">
                  GTM Integration Guide
                </Link>
              </Button>
            </section>

            <section id="facebook-pixels" className="bg-slate-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm border-l-2 border-primary hover:shadow-md transition-all duration-300">
              <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary/10 to-transparent dark:from-primary/20 dark:to-transparent p-2 rounded">Facebook Pixels & Conversions API</h2>
              <p className="text-slate-700 dark:text-slate-300">
                Integrate Facebook Pixel (Meta Pixel) and Conversions API with your 
                Showpass events to track conversions, optimize advertising campaigns, 
                and build custom audiences.
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                Measure the effectiveness of your Facebook ads and gain valuable 
                insights into ticket sales and attendee behavior.
              </p>
              <p className="mt-2 text-slate-700 dark:text-slate-300">
                Learn how to set up both browser-based tracking with Facebook Pixel 
                and server-side tracking with Conversions API for comprehensive data 
                collection and improved attribution.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/facebook/01-introduction-to-facebook-pixel">
                  Facebook Integration Guide
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
