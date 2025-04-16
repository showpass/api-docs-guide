import * as React from 'react';
import { Button } from "@/shared/components/button.tsx";

interface ShowpassMembershipWidgetProps {
  buttonText?: string;
  buttonClassName?: string;
  id: string;
  options?: Record<string, any>;
}

const ShowpassMembershipWidget = ({ 
  buttonText = "Open Membership View", 
  buttonClassName = "",
  id,
  options = {}
}: ShowpassMembershipWidgetProps) => {

  const handleClick = () => {
    if (typeof window === 'undefined' || !id) return;
    
    const defaultOptions = {
      'theme-primary': '#FF7F00',
      'keep-shopping': true
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
      if (window.showpass && window.showpass.tickets) {
        window.showpass.tickets.membershipPurchaseWidget(id, mergedOptions);
      } else if (window.__shwps) {
        window.__shwps('tickets.membershipPurchaseWidget', id, mergedOptions);
      } else {
        console.error('Showpass SDK not found in window object');
      }
    } catch (error) {
      console.error('Error opening Showpass membership widget:', error);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`flex items-center gap-2 ${buttonClassName}`}
      disabled={!id}
    >
      {buttonText}
    </Button>
  );
};

export default ShowpassMembershipWidget;