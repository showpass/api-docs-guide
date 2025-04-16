"use client"

import * as React from 'react';

// Define the window interface to include Showpass SDK
declare global {
  interface Window {
    showpass?: {
      tickets: {
        calendarWidget: (venueId: string, options: any, containerId?: string) => void;
        eventPurchaseWidget: (id: string, options: any, containerId?: string) => void;
        membershipPurchaseWidget: (id: string, options: any, containerId?: string) => void;
        productPurchaseWidget: (id: string, options: any, containerId?: string) => void;
        shoppingCartWidget: (options: any) => void;
      }
    };
    __shwps?: (method: string, ...args: any[]) => void;
  }
}

const ShowpassIntegration = () => {
  const [sdkLoaded, setSdkLoaded] = React.useState(false);

  React.useEffect(() => {
    // Don't initialize SDK if it's already present
    if (typeof window !== 'undefined' && window.showpass) {
      console.log('Showpass SDK already loaded');
      setSdkLoaded(true);
      return;
    }

    console.log('Showpass SDK initialization started');
    
    // Function to check if SDK is loaded and has the tickets property
    const checkSdkLoaded = () => {
      if (typeof window !== 'undefined' && 
          (window.showpass || window.__shwps) && 
          window.showpass && 
          window.showpass.tickets &&
          typeof window.showpass.tickets.shoppingCartWidget === 'function') {
        console.log('Showpass SDK fully loaded and ready');
        setSdkLoaded(true);
        return true;
      }
      return false;
    };
    
    // Check if already loaded
    if (checkSdkLoaded()) return;
    
    // Load the SDK script
    const script = document.createElement('script');
    script.src = 'https://beta.showpass.com/static/dist/sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('Showpass SDK script loaded');
      checkSdkLoaded();
    };
    document.body.appendChild(script);
    
    // Set up interval to check for SDK loading
    const checkInterval = setInterval(() => {
      if (checkSdkLoaded()) {
        clearInterval(checkInterval);
      }
    }, 500);
    
    // Clean up interval on component unmount
    return () => {
      clearInterval(checkInterval);
      // We don't remove the script as other components might need it
    };
  }, []);

  return null;
};

export default ShowpassIntegration;