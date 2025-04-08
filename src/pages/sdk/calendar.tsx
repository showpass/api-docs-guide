
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const CalendarWidgetPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Parameters", href: "#parameters" },
    { title: "Example", href: "#example" },
    { title: "Embedded Calendar", href: "#embedded" },
  ];

  const calendarCode = `let params = {
   'theme-primary': '#dd3333',
   'tags': 'festivals,community',
};

showpass.tickets.calendarWidget(ORG_ID, params)`;

  const embeddedCalendarCode = `<div id="showpass-calendar-widget"></div>
<script type="text/javascript">
let params = {
   'theme-primary': '#000000',
};

showpass.tickets.mountCalendarWidget(ORG_ID, params);
</script>`;

  return (
    <DocLayout currentPath="/sdk/calendar" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Calendar Widget</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Opens the widget for a specific venue (id) that allows the user to select ticket quantities for multiple events on different days and proceed to checkout.
        </p>
        <p className="font-mono text-sm bg-muted p-2 rounded">
          showpass.tickets.calendarWidget(venue_id, params);
        </p>
      </section>
      
      <section id="parameters" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Parameters</h2>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">venue_id</h3>
          <p className="text-sm text-muted-foreground">[required][int] The unique identifier of the organization.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.theme-primary</h3>
          <p className="text-sm text-muted-foreground">[optional][string] Hex code value for main widget color.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.tags</h3>
          <p className="text-sm text-muted-foreground">[optional][string] Comma separated string which will tell calendar to only display events with these tags.</p>
        </div>
      </section>
      
      <section id="example" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example</h2>
        <CodeBlock value={calendarCode} language="javascript" />
      </section>

      <section id="embedded" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Embedded Calendar Widget</h2>
        <p className="mb-4">
          Attaches the calendar widget for a specific venue (id) to a &lt;div&gt; tag with the id showpass-calendar-widget that allows the user to select ticket quantities for multiple events on different days and proceed to checkout.
        </p>
        <CodeBlock value={embeddedCalendarCode} language="html" />
        
        <div className="border rounded-md p-4 mb-4 mt-6">
          <h3 className="font-semibold">Additional Parameters for Embedded Calendar</h3>
          <p className="text-sm text-muted-foreground mb-2">The embedded calendar accepts all the same parameters as the regular calendar widget, plus:</p>
          
          <h4 className="font-medium mt-4">params.tracking-id</h4>
          <p className="text-sm text-muted-foreground">[optional][string] Tracking link tracking-id, for tracking, bypassing passwords, displaying hidden ticket types etc.</p>
        </div>
      </section>
    </DocLayout>
  );
};

export default CalendarWidgetPage;
