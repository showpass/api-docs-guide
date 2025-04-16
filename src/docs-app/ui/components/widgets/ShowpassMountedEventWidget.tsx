import * as React from 'react';

interface ShowpassMountedEventWidgetProps {
  id: string;
  themeColor?: string;
  className?: string;
  options?: Record<string, any>;
}

const ShowpassMountedEventWidget = ({
  id,
  themeColor = '#FF7F00',
  className = '',
  options = {}
}: ShowpassMountedEventWidgetProps) => {
  const containerId = 'widgets-event-container';
  
  React.useEffect(() => {
    if (!id) {
      console.error('Event ID is required for ShowpassMountedEventWidget');
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
        console.log(`Mounting event widget into container: ${containerId}`);
        try {
          window.showpass.tickets.eventPurchaseWidget(id, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass event widget:', error);
        }
      } else if (window.__shwps) {
        // Fallback to older API
        console.log(`Mounting event widget into container: ${containerId} using legacy method`);
        try {
          window.__shwps('tickets.eventPurchaseWidget', id, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass event widget with legacy method:', error);
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
    return <div className="text-red-500 p-4">Error: Event ID is required</div>;
  }

  return (
    <div id={containerId} className={`showpass-event-container min-h-[500px] ${className}`}>
      {/* The event widget will be mounted here */}
    </div>
  );
};

export default ShowpassMountedEventWidget;