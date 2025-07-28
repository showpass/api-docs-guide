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
      <div className="pl-2 py-2 max-w-6xl">
        {/* Compact Hero */}
        <div className="mb-8">
          <div className="flex items-baseline gap-2 mb-2">
            <div className="h-px bg-primary/60 w-8"></div>
            <span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Showpass Developer Platform</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 !mt-0">
            <span className="text-slate-900 dark:text-slate-100">Developer </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Documentation</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl !my-2">
            Integrate ticket sales, event management, and tracking with our comprehensive toolkit.
          </p>
        </div>

        {/* Core Integrations */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-slate-100/30 to-transparent dark:from-gray-800/50 dark:via-gray-800/30 dark:to-transparent rounded-xl"></div>
          <div className="relative px-5 pb-5 pt-3 border border-slate-200/80 dark:border-gray-700/80 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-2 mt-0 mb-2">
              <div className="h-px bg-primary/40 w-6"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0">Core Integrations</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 ml-8 !my-0 !mt-2">API, SDK, and WordPress solutions for seamless integration</p>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700/60 mb-4 mx-auto max-w-[95%]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Public API */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Public API Reference</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event listings</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Organization filtering</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Detailed queries</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Access detailed event information programmatically with our REST API.</p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/api/01-public-api-introduction" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              {/* JavaScript SDK */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">JavaScript SDK</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Interactive widgets</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Shopping cart</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event calendars</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Embeddable widgets and functions to integrate Showpass directly into your frontend.</p>
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
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">WordPress Plugin</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Simple shortcodes</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom templates</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Easy config</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Effortlessly integrate Showpass into your WordPress site with our official plugin.</p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/wordpress/01-getting-started-install-and-configure" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Integrations */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50/80 via-slate-100/30 to-transparent dark:from-gray-800/50 dark:via-gray-800/30 dark:to-transparent rounded-xl"></div>
          <div className="relative px-5 pb-5 pt-3 border border-slate-200/80 dark:border-gray-700/80 rounded-xl shadow-sm">
            <div className="flex items-baseline gap-2 mt-0 mb-2">
              <div className="h-px bg-primary/40 w-6"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0">Advanced Integrations</h2>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 ml-8 !my-0 !mt-2">Webhooks, analytics, and marketing tools</p>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-700/60 mb-4 mx-auto max-w-[95%]"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Webhooks */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <Webhook className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Webhooks</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Real-time updates</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Secure delivery</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Event automation</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Automate workflows and receive real-time notifications for Showpass events.
                  </p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/webhooks/01-webhooks-introduction">Get Started</Link>
                </Button>
              </div>

              {/* Google Tag Manager */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Google Tag Manager</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">GA4 integration</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Ecommerce tracking</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom events</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Advanced analytics and marketing tag integration with comprehensive tracking.
                  </p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">Get Started</Link>
                </Button>
              </div>

              {/* Facebook Pixels */}
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 shadow-md border border-slate-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Facebook Integration</h3>
                </div>
                <div className="flex flex-wrap gap-1 mb-3 text-xs">
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Pixel tracking</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Conversions API</span>
                  <span className="bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">Custom audiences</span>
                </div>
                <div className="mb-4">
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Track conversions and optimize advertising campaigns with Meta integration.
                  </p>
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link to="/facebook/01-introduction-to-facebook-pixel">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started Call to Action - Buttons Only */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent rounded-xl"></div>
          <div className="relative px-5 py-6 border border-primary/20 dark:border-primary/30 rounded-xl shadow-sm backdrop-blur-sm">
            <div className="flex items-baseline gap-2 mb-4">
              <div className="h-px bg-primary/60 w-6"></div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0">Ready to Integrate?</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Widget Button */}
              <Button asChild size="lg" className="flex items-center justify-center gap-2">
                <Link to="/widget-playground">
                  <Zap className="h-5 w-5" /> Widget Integration
                </Link>
              </Button>

              {/* WordPress Button */}
              <Button asChild size="lg" className="flex items-center justify-center gap-2">
                <Link to="/wordpress/01-getting-started-install-and-configure">
                  <Globe className="h-5 w-5" /> WordPress Plugin
                </Link>
              </Button>

              {/* Webhooks Button */}
              <Button asChild size="lg" className="flex items-center justify-center gap-2">
                <Link to="/webhooks/01-webhooks-introduction">
                  <Webhook className="h-5 w-5" /> Webhooks
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;