
import DocLayout from "@/components/DocLayout";

const PublicEventAPI = () => {
  const tocItems = [
    { title: "Introduction", href: "#introduction" },
    { title: "API Endpoints", href: "#endpoints" },
  ];

  return (
    <DocLayout currentPath="/api/events" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Public Event API</h1>
      
      <section id="introduction" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4">
          The Showpass Public Event API provides access to public event data. You can use this API to fetch information about events, venues, and more.
        </p>
        <p className="mb-4">
          Base URL: <code className="bg-muted p-1 rounded">https://www.showpass.com/api/public/events/</code>
        </p>
      </section>

      <section id="endpoints" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
        <p className="mb-4">
          The Public Event API provides several endpoints to access different types of event data:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Get all public events</li>
          <li className="mb-2">Filter events by organization</li>
          <li className="mb-2">Query specific events by slug</li>
        </ul>
      </section>
    </DocLayout>
  );
};

export default PublicEventAPI;
