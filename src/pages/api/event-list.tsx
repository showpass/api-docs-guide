
import DocLayout from "@/components/DocLayout";

const EventListPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Required Parameters", href: "#required-parameters" },
    { title: "Optional Parameters", href: "#optional-parameters" },
  ];

  return (
    <DocLayout currentPath="/api/event-list" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Event List by Organization</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          This endpoint displays all upcoming public events for a specific organization.
        </p>
        <p className="mb-4">
          Endpoint: <code className="bg-muted p-1 rounded">https://www.showpass.com/api/public/events/?venue__in=id</code>
        </p>
        <p className="mb-4">
          Navigate to <a href="https://www.showpass.com/dashboard/venues/edit/" className="text-primary hover:underline">https://www.showpass.com/dashboard/venues/edit/</a> to find the organization ID in the top right corner.
        </p>
        <p className="mb-4">
          Make sure you add your website's domain to the "Integrations" tab on the same page.
        </p>
      </section>
      
      <section id="required-parameters" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Required Parameters</h2>
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">venue__in</h3>
          <p className="text-sm text-muted-foreground">The unique identifier for the organization.</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">?venue__in=123</code></p>
        </div>
      </section>
      
      <section id="optional-parameters" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Optional Parameters</h2>
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">categories</h3>
          <p className="text-sm text-muted-foreground">Include all events that have the following categories.</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">&categories="category_one,category_two"</code></p>
        </div>
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">tags</h3>
          <p className="text-sm text-muted-foreground">Include all events that have the following tags.</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">&tags="tag+one,tag+two"</code></p>
        </div>
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">page_size</h3>
          <p className="text-sm text-muted-foreground">Number of results to return [default: 20].</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">&page_size=8</code></p>
        </div>
      </section>
    </DocLayout>
  );
};

export default EventListPage;
