import * as React from "react";

interface ShowpassMountedCalendarWidgetProps {
  venueId?: string;
  themeColor?: string;
  className?: string;
  options?: Record<string, any>;
}

const ShowpassMountedCalendarWidget = ({
  venueId = "1964",
  themeColor = "#24727b",
  className = "",
  options = {},
}: ShowpassMountedCalendarWidgetProps) => {
  const containerId = React.useRef(`calendar-widget-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const isInitialized = React.useRef(false);
  
  const memoizedOptions = React.useMemo(() => ({
    "theme-primary": themeColor,
    "keep-shopping": true,
    ...options
  }), [themeColor, options]);

  React.useEffect(() => {
    if (isInitialized.current) return;
    
    const initWidget = () => {
      if (window.showpass?.tickets) {
        window.showpass.tickets.calendarWidget(venueId, memoizedOptions, containerId.current);
        isInitialized.current = true;
      } else if (window.__shwps) {
        window.__shwps("tickets.calendarWidget", venueId, memoizedOptions, containerId.current);
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
  }, [venueId, memoizedOptions]);

  return (
    <div 
      id={containerId.current}
      className={`w-full min-h-[500px] ${className}`}
    />
  );
};

export default ShowpassMountedCalendarWidget;