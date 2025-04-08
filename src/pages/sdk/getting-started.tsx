
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const GettingStarted = () => {
  const tocItems = [
    { title: "Introduction", href: "#introduction" },
    { title: "Installation", href: "#installation" },
    { title: "Available Functions", href: "#functions" },
  ];

  const sdkCodeScript = `(function(window, document, src) {
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
})(window, document, 'https://www.showpass.com/static/dist/sdk.js');`;

  const htmlInclude = `<script type="text/javascript" src="https://showpass.com/static/dist/sdk.js"></script>`;

  return (
    <DocLayout currentPath="/sdk/getting-started" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Getting Started with Showpass SDK</h1>
      
      <section id="introduction" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          Showpass has an SDK that makes it easy to embed and call the ticket selection and purchase widgets.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="text-sm">
            <strong>Note:</strong> Your domain must have a valid SSL certificate installed in order to work properly.
          </p>
        </div>
      </section>
      
      <section id="installation" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        
        <h3 className="text-xl font-medium mb-2">Option 1: Include the Showpass SDK into your JavaScript file</h3>
        <CodeBlock value={sdkCodeScript} language="javascript" />
        
        <h3 className="text-xl font-medium mb-2 mt-6">Option 2: Include the Showpass SDK into your HTML header</h3>
        <CodeBlock value={htmlInclude} language="html" />
      </section>
      
      <section id="functions" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Functions</h2>
        <p className="mb-4">
          Showpass has 6 functions that can be called using the SDK:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Ticket Selection Widget</li>
          <li className="mb-2">Product Selection Widget</li>
          <li className="mb-2">Shopping Cart Widget</li>
          <li className="mb-2">Check out Widget</li>
          <li className="mb-2">Login Widget</li>
          <li className="mb-2">Cart Quantity Counter</li>
        </ul>
        <p className="mb-4">
          You can call showpass.tickets using an onclick="" function within the HTML template, or from the JavaScript file.
        </p>
      </section>
    </DocLayout>
  );
};

export default GettingStarted;
