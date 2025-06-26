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
      <div className="pl-2 py-2 max-w-none">
        {/* Compact Hero */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <div className="h-px bg-primary/60 w-8"></div>
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Showpass Developer Platform</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-slate-900 dark:text-slate-100">Developer </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Documentation</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Integrate ticket sales, event management, and tracking with our comprehensive toolkit
          </p>
        </div>

        {/* Core Integrations */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-3">
            <div className="h-px bg-primary/40 w-6"></div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Core Integrations</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Public API */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Public API Reference</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Access detailed event information programmatically with our REST API.</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event listings</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Organization filtering</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Detailed queries</span>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/api/01-public-api-introduction" className="flex items-center justify-center">
                  Get Started <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>

            {/* JavaScript SDK */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">JavaScript SDK</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Embeddable widgets and functions to integrate Showpass directly into your frontend.</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Interactive widgets</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Shopping cart</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event calendars</span>
              </div>
              <div className="flex gap-1">
                <Button asChild size="sm" className="flex-1">
                  <Link to="/sdk/01-sdk-getting-started" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <Link to="/widget-playground">Try Live</Link>
                </Button>
              </div>
            </div>

            {/* WordPress Plugin */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">WordPress Plugin</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Effortlessly integrate Showpass into your WordPress site with our official plugin.</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Simple shortcodes</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom templates</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Easy config</span>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/wordpress/01-getting-started-install-and-configure" className="flex items-center justify-center">
                  Get Started <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Advanced Integrations */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <div className="h-px bg-primary/40 w-6"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Advanced Integrations</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Webhooks, analytics, and marketing tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* Webhooks */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Webhook className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Webhooks</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Automate workflows and receive real-time notifications for Showpass events.
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Real-time updates</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Secure delivery</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event automation</span>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/webhooks/01-webhooks-introduction">Get Started</Link>
              </Button>
            </div>

            {/* Google Tag Manager */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Google Tag Manager</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Advanced analytics and marketing tag integration with comprehensive tracking.
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">GA4 integration</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Ecommerce tracking</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom events</span>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">Get Started</Link>
              </Button>
            </div>

            {/* Facebook Pixels */}
            <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Facebook Integration</h3>
              </div>
              <div className="mb-3">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Track conversions and optimize advertising campaigns with Meta integration.
                </p>
              </div>
              <div className="flex flex-wrap gap-1 mb-4 text-xs">
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Pixel tracking</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Conversions API</span>
                <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom audiences</span>
              </div>
              <Button asChild size="sm" className="w-full">
                <Link to="/facebook/01-introduction-to-facebook-pixel">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Call to Action */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-lg"></div>
          <div className="relative bg-gradient-to-r from-white/90 to-white/60 dark:from-gray-800/90 dark:to-gray-800/60 backdrop-blur-sm rounded-lg border border-primary/10 dark:border-primary/20 p-4">
            <div className="flex items-center justify-between">
              <div className="max-w-lg">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px bg-primary/60 w-6"></div>
                  <div className="text-xs uppercase tracking-wider text-primary font-medium">Get Started</div>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Ready to integrate?</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Choose your integration method and start building amazing experiences.</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button asChild className="px-3 py-1.5 text-sm">
                  <Link to="/api/01-public-api-introduction" className="flex items-center">
                    Explore API <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="px-3 py-1.5 text-sm">
                  <Link to="/widget-playground" className="flex items-center">
                    Try Widgets <Zap className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
