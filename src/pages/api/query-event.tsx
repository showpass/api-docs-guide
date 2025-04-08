
import DocLayout from "@/components/DocLayout";

const QueryEventPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Parameters", href: "#parameters" },
    { title: "Response Format", href: "#response" },
  ];

  return (
    <DocLayout currentPath="/api/query-event" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Query a Specific Event</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          This endpoint allows you to fetch details for a specific event using its slug.
        </p>
        <p className="mb-4">
          Endpoint: <code className="bg-muted p-1 rounded">https://www.showpass.com/api/public/events/slug/</code>
        </p>
      </section>
      
      <section id="parameters" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Parameters</h2>
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">slug</h3>
          <p className="text-sm text-muted-foreground">[required][string] The unique slug of the event on Showpass.</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">showpass.com/this-is-the-slug/</code></p>
        </div>
      </section>
      
      <section id="response" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">API Response</h2>
        <p className="mb-4">
          Simply copy and paste the completed URL into your browser to view the response.
        </p>
        <p className="mb-4">
          Download the JSON View extension for Chrome for in-browser formatting for readability.
        </p>
      </section>
    </DocLayout>
  );
};

export default QueryEventPage;
