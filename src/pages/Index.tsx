import React, { useEffect } from "react";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button";
import SEOHead from "@/shared/components/SEOHead";
import { seoDataMap } from "@/docs-app/data/seoData";
import { ArrowRight, Code, Zap, Globe, Webhook, BarChart3, Target } from "lucide-react";

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
      <div className="max-w-6xl mx-auto px-6 py-4">
        {/* Compact Hero Section */}
        <div className="text-center mb-8 py-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-slate-700 dark:from-primary dark:via-primary/80 dark:to-slate-300">
            Developer Documentation
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Integrate Showpass ticket sales, event management, and tracking into your applications with our comprehensive developer toolkit.
          </p>
        </div>

        {/* Main Integration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Public API */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">
                Public API Reference
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Access detailed information about Showpass events programmatically with our comprehensive REST API.
              </p>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Event listings</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Organization filtering</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Detailed event queries</span>
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/api/01-public-api-introduction" className="flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* JavaScript SDK */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">
                JavaScript SDK
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Embeddable widgets and functions to integrate Showpass directly into your website frontend.
              </p>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Ticket widgets</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Shopping cart</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Event calendars</span>
              </li>
            </ul>
            <div className="flex gap-2">
              <Button asChild className="flex-1 text-sm">
                <Link to="/sdk/01-sdk-getting-started" className="flex items-center justify-center">
                  Get Started
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 text-sm">
                <Link to="/widget-playground">Try Live</Link>
              </Button>
            </div>
          </div>

          {/* WordPress Plugin */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">
                WordPress Plugin
              </h3>
            </div>
            <div className="mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Effortlessly integrate Showpass into your WordPress site with our official plugin.
              </p>
            </div>
            <ul className="space-y-2 mb-6 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Simple shortcodes</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Custom templates</span>
              </li>
              <li className="flex items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                <span>Easy configuration</span>
              </li>
            </ul>
            <Button asChild className="w-full">
              <Link to="/wordpress/01-getting-started-install-and-configure" className="flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Advanced Integrations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-slate-200">
            Advanced Integrations
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 mb-6 text-sm">
            Webhooks, analytics, and marketing tools for enhanced functionality.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Webhooks */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                  <Webhook className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Webhooks</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Automate workflows and receive real-time notifications for Showpass events.
                </p>
              </div>
              <ul className="space-y-1 mb-4 text-xs text-slate-600 dark:text-slate-400">
                <li>• Real-time updates</li>
                <li>• Secure delivery</li>
                <li>• Event automation</li>
              </ul>
              <Button asChild size="sm" className="w-full">
                <Link to="/webhooks/01-webhooks-introduction">Get Started</Link>
              </Button>
            </div>

            {/* Google Tag Manager */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Google Tag Manager</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Advanced analytics and marketing tag integration with comprehensive tracking.
                </p>
              </div>
              <ul className="space-y-1 mb-4 text-xs text-slate-600 dark:text-slate-400">
                <li>• GA4 integration</li>
                <li>• Ecommerce tracking</li>
                <li>• Custom events</li>
              </ul>
              <Button asChild size="sm" className="w-full">
                <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">Get Started</Link>
              </Button>
            </div>

            {/* Facebook Pixels */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-5 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg mr-4 flex-shrink-0">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-xl font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Facebook Pixels & Conversions API</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Track conversions and optimize advertising campaigns with Meta integration.
                </p>
              </div>
              <ul className="space-y-1 mb-4 text-xs text-slate-600 dark:text-slate-400">
                <li>• Pixel tracking</li>
                <li>• Conversions API</li>
                <li>• Custom audiences</li>
              </ul>
              <Button asChild size="sm" className="w-full">
                <Link to="/facebook/01-introduction-to-facebook-pixel">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-slate-50/50 dark:from-primary/20 dark:via-primary/10 dark:to-gray-800/50 rounded-2xl p-6 text-center border border-primary/20">
          <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">
            Ready to get started?
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-xl mx-auto text-sm">
            Choose your integration method and start building amazing ticket purchasing experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="px-6">
              <Link to="/api/01-public-api-introduction" className="flex items-center">
                Explore API
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="px-6">
              <Link to="/widget-playground" className="flex items-center">
                Try Widgets
                <Zap className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
