
import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

const CartCounterPage = () => {
  const tocItems = [
    { title: "Overview", href: "#overview" },
    { title: "Example", href: "#example" },
  ];

  const cartCounterCode = `jQuery.noConflict();

(function($) {

    $(window).on('load', function() {
        // Initialize counter and update count and cookie value when changed
        showpass.tickets.addCartCountListener(function (count) {
            let html = '';
            if (count > 0) {
                html = 'Cart ('+count+')';
                Cookies.set('cart', html);
                $('.menu-item-449 a span').html(html);
            } else {
                html = 'Cart';
                Cookies.set('cart', html);
                $('.menu-item-449 a span').html(html);
            }
        });
    });

    $(document).on('ready', function() {
        // Display cart quantity on page load
        if (Cookies.get('cart')) {
            $('.menu-item-449 a span').html(Cookies.get('cart'));
        }
    });

})(jQuery);`;

  return (
    <DocLayout currentPath="/sdk/cart-counter" tocItems={tocItems}>
      <h1 className="text-3xl font-bold mb-6">Cart Quantity Counter</h1>
      
      <section id="overview" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          Returns the number of items in the current shopping cart.
        </p>
        <p className="mb-4">
          Can be used with js-cookie (<a href="https://github.com/js-cookie/js-cookie" className="text-primary hover:underline">https://github.com/js-cookie/js-cookie</a>) and jQuery to display a dynamic cart count throughout the shopping experience and on page load.
        </p>
        <p className="font-mono text-sm bg-muted p-2 rounded">
          showpass.tickets.addCartCountListener(count);
        </p>
      </section>
      
      <section id="example" className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Example</h2>
        <CodeBlock value={cartCounterCode} language="javascript" />
      </section>
    </DocLayout>
  );
};

export default CartCounterPage;
