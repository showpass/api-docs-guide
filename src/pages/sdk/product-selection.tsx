
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const ProductSelectionPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Parameters", href: "#parameters" },
    { title: "Example", href: "#example" },
  ];

  const exampleCode = `let params = {
   'theme-primary': '#dd3333',
   'keep-shopping': false,
};

showpass.tickets.productPurchaseWidget(1234, params);`;

  return (
    <DocLayout currentPath="/sdk/product-selection" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Product Selection Widget</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Opens the product selection widget for specified product (id).
        </p>
        <p className="font-mono text-sm bg-muted p-2 rounded">
          showpass.tickets.productPurchaseWidget(id, params);
        </p>
      </section>
      
      <section id="parameters" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Parameters</h2>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">id</h3>
          <p className="text-sm text-muted-foreground">[required][int] The unique id of the product on Showpass.</p>
          <p className="text-sm">To find, go to Dashboard{'>'}Marketplace{'>'}Edit Product</p>
          <p className="text-sm">Example: <code className="bg-muted p-1 rounded">https://www.showpass.com/dashboard/inventory/products/1080/edit/</code></p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.theme-primary</h3>
          <p className="text-sm text-muted-foreground">[optional][string] Hex code value for main widget color.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.theme-secondary</h3>
          <p className="text-sm text-muted-foreground">[optional][string] Hex code value for accent widget color.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.theme-dark</h3>
          <p className="text-sm text-muted-foreground">[optional][bool] Displays the widget in a dark theme.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.keep-shopping</h3>
          <p className="text-sm text-muted-foreground">[optional][bool] Displays "Keep Shopping" instead of "Close" on button verbiage.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.show-description</h3>
          <p className="text-sm text-muted-foreground">[optional][bool] Displays or hides event description. Default: true.</p>
        </div>
        
        <div className="border rounded-md p-4 mb-4">
          <h3 className="font-semibold">params.tracking-id</h3>
          <p className="text-sm text-muted-foreground">Not supported.</p>
        </div>
      </section>
      
      <section id="example" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example</h2>
        <CodeBlock value={exampleCode} language="javascript" />
      </section>
    </DocLayout>
  );
};

export default ProductSelectionPage;
