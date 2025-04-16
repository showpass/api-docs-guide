import * as React from 'react';

interface ShowpassMountedCalendarWidgetProps {
  venueId?: string;
  themeColor?: string;
  className?: string;
  options?: Record<string, any>;
}

const ShowpassMountedCalendarWidget = ({
  venueId = '1964', // Default venue ID
  themeColor = '#FF7F00',
  className = '',
  options = {}
}: ShowpassMountedCalendarWidgetProps) => {
  const containerId = 'widgets-calendar-container';
  
  React.useEffect(() => {
    // Wait for widgets to be available
    const initWidget = () => {
      if (typeof window === 'undefined') return;
      
      const defaultOptions = {
        'theme-primary': themeColor,
        'keep-shopping': true,
        'tags': 'featured'
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      if (window.showpass && window.showpass.tickets) {
        console.log(`Mounting calendar widget into container: ${containerId}`);
        try {
          window.showpass.tickets.calendarWidget(venueId, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass calendar widget:', error);
        }
      } else if (window.__shwps) {
        // Fallback to older API
        console.log(`Mounting calendar widget into container: ${containerId} using legacy method`);
        try {
          window.__shwps('tickets.calendarWidget', venueId, mergedOptions, containerId);
        } catch (error) {
          console.error('Error mounting Showpass calendar widget with legacy method:', error);
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
  }, [containerId, venueId, themeColor, options]);

  return (
    <div id={containerId} className={`showpass-calendar-container min-h-[500px] ${className}`}>
      {/* The calendar widget will be mounted here */}
    </div>
  );
};

export default ShowpassMountedCalendarWidget;