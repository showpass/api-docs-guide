import * as React from 'react';

interface ShowpassMountedProductWidgetProps {
  id: string;
  themeColor?: string;
  className?: string;
  options?: Record<string, any>;
}

const ShowpassMountedProductWidget = ({
  id,
  themeColor = '#24727b',
  className = '',
  options = {}
}: ShowpassMountedProductWidgetProps) => {
  const containerId = React.useRef(`product-widget-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const isInitialized = React.useRef(false);
  
  const memoizedOptions = React.useMemo(() => ({
    'theme-primary': themeColor,
    'keep-shopping': true,
    ...options
  }), [themeColor, options]);
  
  React.useEffect(() => {
    if (isInitialized.current) return;
    
    const initWidget = () => {
      if (window.showpass?.tickets) {
        window.showpass.tickets.productPurchaseWidget(id, memoizedOptions, containerId.current);
        isInitialized.current = true;
      } else if (window.__shwps) {
        window.__shwps('tickets.productPurchaseWidget', id, memoizedOptions, containerId.current);
        isInitialized.current = true;
      }
    };

    if (window.showpass || window.__shwps) {
      initWidget();
    } else {
      const checkInterval = setInterval(() => {
        if (window.showpass || window.__shwps) {
          initWidget();
          clearInterval(checkInterval);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }
  }, [id, memoizedOptions]);

  return (
    <div 
      id={containerId.current} 
      className={`w-full min-h-[400px] ${className}`}
    />
  );
};

export default ShowpassMountedProductWidget;