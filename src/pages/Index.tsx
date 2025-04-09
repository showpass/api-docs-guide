
import React from "react";
import DocLayout from "@/docs-app/ui/components/DocLayout";
import CodeBlock from "@/docs-app/ui/components/CodeBlock";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy";
import { BookOpen, Code, Calendar, Webhook } from "lucide-react";

const Index = () => {
  const activeSection = useScrollSpy("h2[id], h3[id]", 100);
  
  const tableOfContentsItems = [
    { title: "Overview", href: "#overview" },
    { title: "Key Features", href: "#key-features" },
    { title: "Getting Started", href: "#getting-started" },
    { title: "API Reference", href: "#api-reference" },
    { title: "SDK Components", href: "#sdk-components" },
    { title: "Webhooks", href: "#webhooks" },
  ];

  return (
    <DocLayout 
      currentPath="/"
      tocItems={tableOfContentsItems}
    >
      <h1>Showpass Public API & SDK</h1>
      
      <section id="overview">
        <h2>Overview</h2>
        <p>
          Using Javascript or jQuery, HTML, CSS and the Showpass SDK you can easily integrate 
          Showpass into any website. This documentation provides comprehensive information about 
          the Showpass Public API and SDK, helping you seamlessly integrate ticket sales and 
          event management features into your application.
        </p>
      </section>

      <section id="key-features">
        <h2>Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Comprehensive Public Event API for accessing event data</li>
          <li>Customizable widgets for ticket selection and purchases</li>
          <li>Product selection and shopping cart integration</li>
          <li>Calendar display for upcoming events</li>
          <li>Webhook support for real-time event notifications</li>
        </ul>
      </section>

      <section id="getting-started">
        <h2>Getting Started</h2>
        <p>
          To get started with the Showpass SDK, include the following script in your HTML header:
        </p>
        <CodeBlock 
          language="javascript"
          code={`(function(window, document, src) {
    let config = window.__shwps;
    if (typeof config === "undefined") {
        config = function() {
            config.c(arguments)
        };
        config.q = [];
        config.c = function(args) {
            config.q.push(args)
        };
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
        
        <p>Alternatively, you can include it directly in your HTML:</p>
        <CodeBlock 
          language="html"
          code={`<script type="text/javascript" src="https://showpass.com/static/dist/sdk.js"></script>`} 
        />
      </section>

      <section id="api-reference">
        <h2>API Reference</h2>
        <p>
          The Showpass Public API provides endpoints for accessing event data programmatically:
        </p>
        
        <h3>Main Endpoints</h3>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Event List</strong>: <code>https://www.showpass.com/api/public/discovery/</code></li>
          <li><strong>Event List by Organization</strong>: <code>https://www.showpass.com/api/public/discovery/?venue__in=id</code></li>
          <li><strong>Query a Specific Event</strong>: <code>https://www.showpass.com/api/public/events/slug/</code></li>
        </ul>
        
        <p>
          Navigate to the API Reference section for detailed information about query parameters and response formats.
        </p>
      </section>

      <section id="sdk-components">
        <h2>SDK Components</h2>
        <p>
          The Showpass SDK provides several components for integrating with your website:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Ticket Selection Widget</h4>
            <p className="text-sm text-muted-foreground">
              Allow users to select ticket quantities for an event
            </p>
          </div>
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Product Selection Widget</h4>
            <p className="text-sm text-muted-foreground">
              Displays products for purchase
            </p>
          </div>
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Shopping Cart Widget</h4>
            <p className="text-sm text-muted-foreground">
              Displays the current shopping cart contents
            </p>
          </div>
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Check Out Widget</h4>
            <p className="text-sm text-muted-foreground">
              Handles the checkout process
            </p>
          </div>
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Login Widget</h4>
            <p className="text-sm text-muted-foreground">
              Handles user authentication
            </p>
          </div>
          <div className="border rounded-md p-4 hover:border-primary transition-colors bg-white">
            <h4 className="font-medium">Calendar Widget</h4>
            <p className="text-sm text-muted-foreground">
              Displays events in a calendar format
            </p>
          </div>
        </div>
      </section>

      <section id="webhooks">
        <h2>Webhooks</h2>
        <p>
          Showpass provides webhook functionality to notify your systems about events such as:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>New orders (<code>invoice.purchase</code>)</li>
          <li>Refunds (<code>invoice.refund</code>)</li>
          <li>Transaction voids (<code>invoice.void</code>)</li>
          <li>Ticket transfers (<code>invoice.transfer</code>, <code>invoice.transferred</code>)</li>
        </ul>
        <p>
          Refer to the Webhooks section for detailed implementation guidance and payload formats.
        </p>
      </section>
    </DocLayout>
  );
};

export default Index;
