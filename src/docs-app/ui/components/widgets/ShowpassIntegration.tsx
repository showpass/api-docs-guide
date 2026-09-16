import * as React from "react";
import {
  loadShowpassSdk,
  type ShowpassTickets,
  type WidgetEnvironment,
} from "./showpass-sdk";

declare global {
  interface Window {
    showpass?: { tickets: ShowpassTickets; config?: { host?: string } };
    __shwps?: (method: string, ...args: unknown[]) => void;
  }
}

interface ShowpassIntegrationProps {
  environment?: WidgetEnvironment;
  onReady: () => void;
  onError: (message: string) => void;
}

const ShowpassIntegration = ({ environment = "prod", onReady, onError }: ShowpassIntegrationProps) => {
  React.useEffect(() => {
    let disposed = false;
    loadShowpassSdk(environment).then(
      () => { if (!disposed) onReady(); },
      (error: Error) => { if (!disposed) onError(error.message); },
    );
    return () => { disposed = true; };
  }, [environment, onReady, onError]);

  return null;
};

export default ShowpassIntegration;
