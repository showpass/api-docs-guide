
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const GoogleAnalyticsPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Implementation", href: "#implementation" },
    { title: "Verification", href: "#verification" },
  ];

  const gaCode = `/*
* Decorate iFrame for GA cross domain tracking
*/
const mutationObserver = new MutationObserver(function(mutations) {
   mutations.forEach(function(mutation) {
       if (mutation.target.className.includes('showpass-widget-body')) {
           let gobj = window[window.GoogleAnalyticsObject];
           let tracker, linker;
           let iFrame = document.getElementById('showpass-widget');
           if (gobj) {
               tracker = gobj.getAll()[0];
               linker = new window.gaplugins.Linker(tracker);
               iFrame.src = linker.decorate(iFrame.src);
           }
       }
   });
});


mutationObserver.observe(document.documentElement, { attributes: true });`;

  return (
    <DocLayout currentPath="/advanced/google-analytics" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Google Analytics Integration</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          If you are using the widget with Google Analytics you will need to add cross domain tracking to the iFrame in order to not double count sessions.
        </p>
        <p className="mb-4">
          We do this by default if you are using our WordPress plugin, but if you have a custom integration, you will need to add some custom JavaScript code.
        </p>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="text-sm">
            <strong>Note:</strong> This will only work if the Showpass widget is introduced after the initial page load - embedding the calendar widget directly on the page may require a timeout after initial page load to embed the calendar.
          </p>
        </div>
      </section>
      
      <section id="implementation" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Implementation</h2>
        <CodeBlock value={gaCode} language="javascript" />
      </section>
      
      <section id="verification" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Verification</h2>
        <p className="mb-4">
          Once added, you can use the browser's development tool to ensure that the iFrame src parameter has the __ga= URL parameter appended to the URL.
        </p>
        <p className="mb-4">
          You also need to update the referral exclusion list on your Google Analytics view. Please see our support article for more information.
        </p>
      </section>
    </DocLayout>
  );
};

export default GoogleAnalyticsPage;
