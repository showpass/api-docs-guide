import React, { useEffect } from "react";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout.tsx";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/button.tsx";
import SEOHead from "@/shared/components/SEOHead.tsx";
import { seoDataMap } from "@/docs-app/data/seoData.ts";
import { ArrowRight, Code, Zap, Globe, Webhook, BarChart3, Target, Shield } from "lucide-react";

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
            Start building powerful event experiences today with just a few lines of code.
          </p>
        </div>

        {/* Section Divider */}
        <div className="flex items-center my-6">
          <div className="w-1/3 h-px bg-slate-200 dark:bg-slate-700/60"></div>
        </div>

        {/* Core Integrations */}
        <div className="mb-12 relative">
          <div className="flex flex-col mt-0 mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0 !mb-0">Core Integrations</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Essential tools for seamless API, SDK, and WordPress integration</p>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700/60 mb-4 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Public API */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">API Reference</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Event listings</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Event filtering</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Ticket management</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Access event information and perform operations with our REST APIs.</p>
              </div>
              <div className="flex flex-col gap-2 ml-11 lg:flex-row">
                <Button asChild size="sm" className="w-full lg:flex-1">
                  <Link to="/api/01-public-api-introduction" className="flex items-center justify-center">
                    Public API <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full lg:flex-1">
                  <Link to="/api/10-private-api-overview" className="flex items-center justify-center">
                    Private API <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* JavaScript SDK */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">JavaScript SDK</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Interactive widgets</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Shopping cart</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Event calendars</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Embeddable widgets and functions to integrate Showpass directly into your frontend.</p>
              </div>
              <div className="flex flex-col gap-2 ml-11 lg:flex-row">
                <Button asChild size="sm" className="w-full lg:flex-1">
                  <Link to="/sdk/01-sdk-getting-started" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full lg:flex-1">
                  <Link to="/widget-playground">Try Live</Link>
                </Button>
              </div>
            </div>

            {/* WordPress Plugin */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">WordPress Plugin</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Simple shortcodes</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Custom templates</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Easy config</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Effortlessly integrate Showpass into your WordPress site with our official plugin.</p>
              </div>
              <div className="ml-11">
                <Button asChild size="sm" className="w-full">
                  <Link to="/wordpress/01-getting-started-install-and-configure" className="flex items-center justify-center">
                    Get Started <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex items-center my-6">
          <div className="w-1/3 h-px bg-slate-200 dark:bg-slate-700/60"></div>
        </div>

        {/* Advanced Integrations */}
        <div className="mb-12 relative">
          <div className="flex flex-col mt-0 mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0 !mb-0">Advanced Integrations</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Extend functionality with webhooks, analytics, and marketing tools</p>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700/60 mb-4 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Webhooks */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Webhook className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Webhooks</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Real-time updates</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Secure delivery</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Event automation</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Automate workflows and receive real-time notifications for Showpass events.
                </p>
              </div>
              <div className="ml-11">
                <Button asChild size="sm" className="w-full">
                  <Link to="/webhooks/01-webhooks-introduction">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Google Tag Manager */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Google Tag Manager</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">GA4 integration</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Ecommerce tracking</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Custom events</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Advanced analytics and marketing tag integration with comprehensive tracking.
                </p>
              </div>
              <div className="ml-11">
                <Button asChild size="sm" className="w-full">
                  <Link to="/google-tag-manager/01-introduction-to-showpass-gtm-integration">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Facebook Pixels */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Facebook Integration</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Pixel tracking</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Conversions API</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Custom audiences</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Track conversions and optimize advertising campaigns with Meta integration.
                </p>
              </div>
              <div className="ml-11">
                <Button asChild size="sm" className="w-full">
                  <Link to="/facebook/01-introduction-to-facebook-pixel">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section Divider */}
        <div className="flex items-center my-6">
          <div className="w-1/3 h-px bg-slate-200 dark:bg-slate-700/60"></div>
        </div>

        {/* Security & Compliance */}
        <div className="mb-12 relative">
          <div className="flex flex-col mt-0 mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 !mt-0 !mb-0">Security & Compliance</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">PCI compliance, certifications, and security documentation</p>
          </div>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700/60 mb-4 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Security & Compliance */}
            <div className="group border border-slate-200 dark:border-slate-700 rounded-lg p-4 md:col-span-2 lg:col-span-3">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-primary/10 rounded-lg mr-3 flex-shrink-0">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-[-0.3rem] text-lg font-semibold text-slate-800 dark:text-slate-200 leading-tight flex-1">Security & Compliance</h3>
              </div>
              <div className="flex flex-wrap gap-1 mb-3 text-xs ml-11">
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">PCI DSS Level 1</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">TX-RAMP Certified</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">GDPR Compliant</span>
                <span className="bg-slate-50 dark:bg-slate-800/50 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">Responsibility Matrix</span>
              </div>
              <div className="mb-4 ml-11">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Access compliance certificates, security documentation, and understand our shared responsibility model for enterprise and government customers.
                </p>
              </div>
              <div className="flex gap-2 ml-11 flex-wrap sm:flex-nowrap">
                <Button asChild size="sm">
                  <Link to="/security/01-compliance-overview" className="flex items-center justify-center">
                    Overview <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/security/02-pci-compliance">PCI Compliance</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/security/03-certifications">Certifications</Link>
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