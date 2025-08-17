import * as React from 'react';
import { Button } from "@/shared/components/button.tsx";

interface ShowpassProductWidgetProps {
  buttonText?: string;
  buttonClassName?: string;
  id: string;
  options?: Record<string, any>;
}

const ShowpassProductWidget = ({ 
  buttonText = "Open Product View", 
  buttonClassName = "",
  id,
  options = {}
}: ShowpassProductWidgetProps) => {

  const handleClick = () => {
    if (typeof window === 'undefined') return;

    const defaultOptions = {
      'theme-primary': '#FF7F00',
      'keep-shopping': true
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      if (window.showpass && window.showpass.tickets) {
        window.showpass.tickets.productPurchaseWidget(id, mergedOptions);
      } else if (window.__shwps) {
        window.__shwps('tickets.productPurchaseWidget', id, mergedOptions);
      } else {
        console.error('Showpass SDK not found in window object');
      }
    } catch (error) {
      console.error('Error opening Showpass product widget:', error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center gap-2 ${buttonClassName}`}
    >
      {buttonText}
    </Button>
  );
};

export default ShowpassProductWidget;
