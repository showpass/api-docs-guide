import * as React from 'react';

interface ShowpassMountedProductWidgetProps {
  id?: string;
  themeColor?: string;
  className?: string;
  options?: Record<string, any>;
}

const ShowpassMountedProductWidget = ({
  id = "1894", // Default product ID
  themeColor = '#FF7F00',
  className = '',
  options = {}
}: ShowpassMountedProductWidgetProps) => {
  const containerId = 'widgets-product-container';

  React.useEffect(() => {
    if (!id) {
      console.error('Product ID is required for ShowpassMountedProductWidget');
      return;
    }

    // Wait for widgets to be available
    const initWidget = () => {
      if (typeof window === 'undefined') return;

      const defaultOptions = {
        'theme-primary': themeColor,
        'keep-shopping': true
      };

      const mergedOptions = { ...defaultOptions, ...options };

      if (window.showpass && window.showpass.tickets) {
        console.log(`Mounting product widget into container: ${containerId}`);
        try {
          window.showpass.tickets.productPurchaseWidget(id, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass product widget:', error);
        }
      } else if (window.__shwps) {
        // Fallback to older API
        console.log(`Mounting product widget into container: ${containerId} using legacy method`);
        try {
          window.__shwps('tickets.productPurchaseWidget', id, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass product widget with legacy method:', error);
        }
      } else {
        console.error('Showpass SDK not found in window object');
      }
    };

    // Check if SDK is already loaded
    if (window.showpass || window.__shwps) {
      initWidget();
    } else {
      // Setup a watcher to initialize when SDK becomes available
      const checkInterval = setInterval(() => {
        if (window.showpass || window.__shwps) {
          initWidget();
          clearInterval(checkInterval);
        }
      }, 500);

      // Clean up interval on component unmount
      return () => clearInterval(checkInterval);
    }
  }, [containerId, id, themeColor, options]);

  if (!id) {
    return <div className="text-red-500 p-4">Error: Product ID is required</div>;
  }

  return (
    <div id={containerId} className={`showpass-product-container min-h-[500px] ${className}`}>
      {/* The product widget will be mounted here */}
    </div>
  );
};

export default ShowpassMountedProductWidget;
