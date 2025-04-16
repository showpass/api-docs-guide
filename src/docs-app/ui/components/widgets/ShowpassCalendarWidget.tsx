import * as React from 'react';
import { Button } from "@/shared/components/button.tsx";
import { CalendarRange } from 'lucide-react';

interface ShowpassCalendarWidgetProps {
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  buttonClassName?: string;
  venueId?: string;
  options?: Record<string, any>;
}

const ShowpassCalendarWidget = ({ 
  buttonText = "Open Calendar View", 
  buttonIcon = <CalendarRange size={18} />,
  buttonClassName = "",
  venueId = "1964", // Default venue ID
  options = {}
}: ShowpassCalendarWidgetProps) => {

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    
    const defaultOptions = {
      'theme-primary': '#FF7F00',
      'tags': 'featured',
      'keep-shopping': true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      if (window.showpass && window.showpass.tickets) {
        window.showpass.tickets.calendarWidget(venueId, mergedOptions);
      } else if (window.__shwps) {
        window.__shwps('tickets.calendarWidget', venueId, mergedOptions);
      } else {
        console.error('Showpass SDK not found in window object');
      }
    } catch (error) {
      console.error('Error opening Showpass calendar widget:', error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center gap-2 ${buttonClassName}`}
    >
      {buttonIcon}
      {buttonText}
    </Button>
  );
};

export default ShowpassCalendarWidget;