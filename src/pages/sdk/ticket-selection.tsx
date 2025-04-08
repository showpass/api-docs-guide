
import React, { useState, useEffect } from "react";
import DocLayout from "../../components/DocLayout";
import Navigation from "../../components/Navigation";
import TableOfContents from "../../components/TableOfContents";
import CodeBlock from "../../components/CodeBlock";
import Parameter from "../../components/Parameter";

const TicketSelectionPage = () => {
  const [activeSection, setActiveSection] = useState("");
  
  const tableOfContentsItems = [
    { title: "Overview", href: "#overview" },
    { title: "Usage", href: "#usage" },
    { title: "Parameters", href: "#parameters" },
    { title: "Example", href: "#example" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h2[id], h3[id]");
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        
        if (rect.top <= 100) {
          setActiveSection(`#${section.id}`);
          break;
        }
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <DocLayout 
      navigation={<Navigation currentPath="/sdk/ticket-selection" />}
      tableOfContents={<TableOfContents items={tableOfContentsItems} activeItem={activeSection} />}
    >
      <h1>Ticket Selection Widget</h1>
      
      <section id="overview">
        <h2>Overview</h2>
        <p>
          The Ticket Selection Widget allows users to select ticket quantities for a specific event
          and proceed to checkout. This widget is typically used on event pages where you want to
          display ticket options for purchase.
        </p>
      </section>

      <section id="usage">
        <h2>Usage</h2>
        <p>
          Use the <code>showpass.tickets.eventPurchaseWidget</code> function to open the ticket selection widget:
        </p>
        <CodeBlock 
          language="javascript"
          value={`showpass.tickets.eventPurchaseWidget(slug, params);`} 
        />
      </section>

      <section id="parameters">
        <h2>Parameters</h2>
        
        <Parameter
          name="slug"
          type="string"
          required={true}
          description="The unique slug of the event on Showpass (showpass.com/this-is-the-slug/)"
          example="this-is-the-slug"
        />
        
        <Parameter
          name="params.theme-primary"
          type="string"
          description="Hex code value for main widget color"
          example="#dd3333"
        />
        
        <Parameter
          name="params.show-specific-tickets"
          type="string"
          description="Only show specific ticket types in the widget. Accepts a comma separated list of ticket type ids in a string format"
          example="1234,5678"
        />
        
        <Parameter
          name="params.keep-shopping"
          type="boolean"
          description="Displays 'Keep Shopping' instead of 'Close' on button verbiage"
          defaultValue="false"
        />
        
        <Parameter
          name="params.tracking-id"
          type="string"
          description="Tracking link tracking-id, for affiliate tracking, bypassing passwords, displaying hidden ticket types etc."
          example="123ABC34"
        />
        
        <Parameter
          name="params.show-description"
          type="boolean"
          description="Displays or hides event description"
          defaultValue="true"
        />
      </section>

      <section id="example">
        <h2>Example</h2>
        <p>Here's a complete example of how to use the Ticket Selection Widget:</p>
        <CodeBlock 
          language="javascript"
          value={`let params = {
   'theme-primary': '#dd3333',
   'keep-shopping': false,
   'tracking-id': '123ABC34',
   'show-description': true,
   'show-specific-tickets': '1234,5678',
};

showpass.tickets.eventPurchaseWidget('this-is-the-slug', params);`} 
        />
        
        <p className="mt-4">
          You can call this function from a button click event or any other user interaction:
        </p>
        
        <CodeBlock 
          language="html"
          value={`<button 
  onclick="showpass.tickets.eventPurchaseWidget('this-is-the-slug', {
    'theme-primary': '#dd3333'
  });"
  class="buy-tickets-button"
>
  Buy Tickets
</button>`} 
        />
      </section>
    </DocLayout>
  );
};

export default TicketSelectionPage;
