// Use the canonical SDK in hosted environments. Locally, the current frontend
// build lives at /platform/sdk/sdk.js; /static/dist/sdk.js is still the legacy SDK.
export const SHOWPASS_SDK_URL =
  "https://www.showpass.com/static/dist/sdk.js";

export const WIDGET_ENVIRONMENTS = {
  prod: { label: "prod", origin: "https://www.showpass.com" },
  demo: { label: "demo", origin: "https://demo.showpass.com" },
  ...(import.meta.env.DEV ? { dev: { label: "dev", origin: "https://localhost.showpass.com" } } : {}),
} as const;
export type WidgetEnvironment = keyof typeof WIDGET_ENVIRONMENTS;

const SDK_LOADER_ATTRIBUTE = "data-showpass-sdk-loader";
const SDK_LOAD_TIMEOUT_MS = 15_000;

export type ShowpassWidgetParams = Record<
  string,
  string | boolean | undefined
>;

export interface ShowpassWidgetHandle {
  unmount?: () => void;
  remount?: () => void;
}

type ShowpassIdentifier = string | number;

export interface ShowpassTickets {
  eventPurchaseWidget: (
    slug: string,
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  productPurchaseWidget: (
    identifier: ShowpassIdentifier,
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  membershipPurchaseWidget: (
    identifier: ShowpassIdentifier,
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  calendarWidget: (
    venueIdOrSlug: ShowpassIdentifier,
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  checkoutWidget: (
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  expressCheckoutWidget: (
    params: ShowpassWidgetParams,
    containerId?: string,
  ) => Promise<ShowpassWidgetHandle>;
  addCartCountListener: (listener: (count: number) => void) => () => void;
}

type ShowpassWindow = Window & {
  showpass?: {
    tickets?: ShowpassTickets;
    config?: { host?: string };
  };
};

interface ScriptSubscriber {
  resolve: (tickets: ShowpassTickets) => void;
  reject: (error: Error) => void;
}

interface ScriptLoadState {
  script: HTMLScriptElement;
  adopted: boolean;
  status: "loading" | "loaded" | "failed";
  subscribers: Set<ScriptSubscriber>;
  disposeObserver: () => void;
}

let activeOrigin: string | undefined;
let sdkPromise: Promise<ShowpassTickets> | undefined;
let observedScriptState: ScriptLoadState | undefined;

function getTickets() {
  return (window as unknown as ShowpassWindow).showpass?.tickets;
}

function settleScriptState(
  state: ScriptLoadState,
  result:
    | { status: "loaded"; tickets: ShowpassTickets }
    | { status: "failed"; error: Error },
) {
  if (state.status !== "loading") return;

  state.status = result.status;
  state.disposeObserver();
  state.script.setAttribute(SDK_LOADER_ATTRIBUTE, result.status);

  for (const subscriber of [...state.subscribers]) {
    if (result.status === "loaded") subscriber.resolve(result.tickets);
    else subscriber.reject(result.error);
  }
  state.subscribers.clear();
}

function observeScript(
  script: HTMLScriptElement,
  adopted: boolean,
): ScriptLoadState {
  const state: ScriptLoadState = {
    script,
    adopted,
    status: "loading",
    subscribers: new Set(),
    disposeObserver: () => {},
  };

  const handleLoad = () => {
    const tickets = getTickets();
    const host = (window as unknown as ShowpassWindow).showpass?.config?.host?.replace(/\/$/, "");
    if (!host) {
      settleScriptState(state, { status: "failed", error: new Error("The current Showpass SDK is unavailable in this environment.") });
    } else if (host !== activeOrigin) {
      settleScriptState(state, { status: "failed", error: new Error("The loaded SDK does not match the selected environment.") });
    } else if (tickets) {
      settleScriptState(state, { status: "loaded", tickets });
    } else {
      settleScriptState(state, {
        status: "failed",
        error: new Error("Showpass SDK loaded without exposing tickets"),
      });
    }
  };

  const handleError = () => {
    settleScriptState(state, {
      status: "failed",
      error: new Error("Unable to load the Showpass SDK"),
    });
  };

  state.disposeObserver = () => {
    script.removeEventListener("load", handleLoad);
    script.removeEventListener("error", handleError);
  };

  script.addEventListener("load", handleLoad, { once: true });
  script.addEventListener("error", handleError, { once: true });
  script.setAttribute(SDK_LOADER_ATTRIBUTE, "loading");

  return state;
}

function scriptElementReportsComplete(script: HTMLScriptElement) {
  const readyState = (
    script as HTMLScriptElement & { readyState?: string }
  ).readyState;
  return readyState === "complete";
}

function scriptRequestAppearsComplete(script: HTMLScriptElement) {
  if (scriptElementReportsComplete(script)) return true;

  try {
    return (
      window.performance?.getEntriesByName(script.src, "resource").length > 0
    );
  } catch {
    return false;
  }
}

function copyScriptSecurityAttributes(
  source: HTMLScriptElement,
  target: HTMLScriptElement,
) {
  if (source.nonce) target.nonce = source.nonce;
  if (source.integrity) target.integrity = source.integrity;
  if (source.crossOrigin) target.crossOrigin = source.crossOrigin;
  if (source.referrerPolicy) target.referrerPolicy = source.referrerPolicy;
}

function getOrCreateScriptState(sdkUrl: string) {
  const previous = document.querySelector<HTMLScriptElement>(
    'script[src="' + sdkUrl + '"]',
  );
  const previousStatus = previous?.getAttribute(SDK_LOADER_ATTRIBUTE);

  if (
    previous &&
    previousStatus !== "failed" &&
    previousStatus !== "loaded" &&
    observedScriptState?.script === previous &&
    observedScriptState.status === "loading"
  ) {
    return observedScriptState;
  }

  const previousIsTerminal =
    previousStatus === "failed" ||
    previousStatus === "loaded" ||
    (previous !== null && scriptElementReportsComplete(previous));

  const script =
    previous && !previousIsTerminal
      ? previous
      : document.createElement("script");

  if (previous && previousIsTerminal) {
    copyScriptSecurityAttributes(previous, script);
    previous.remove();
  }

  const state = observeScript(script, script === previous);
  observedScriptState = state;

  if (!previous || previousIsTerminal) {
    script.src = sdkUrl;
    script.async = true;
    document.head.appendChild(script);
  }

  return state;
}

function waitForScript(state: ScriptLoadState): Promise<ShowpassTickets> {
  const attempt = new Promise<ShowpassTickets>((resolve, reject) => {
    const resetAttempt = () => {
      if (sdkPromise === attempt) sdkPromise = undefined;
    };

    const removeSubscriber = () => {
      state.subscribers.delete(subscriber);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };

    const subscriber: ScriptSubscriber = {
      resolve(tickets) {
        removeSubscriber();
        resolve(tickets);
      },
      reject(error) {
        removeSubscriber();
        resetAttempt();
        reject(error);
      },
    };

    state.subscribers.add(subscriber);
    const timeoutId = window.setTimeout(() => {
      removeSubscriber();
      resetAttempt();

      if (
        state.adopted &&
        state.status === "loading" &&
        scriptRequestAppearsComplete(state.script)
      ) {
        state.status = "failed";
        state.disposeObserver();
        state.script.setAttribute(SDK_LOADER_ATTRIBUTE, "failed");
      }

      reject(new Error("Timed out while loading the Showpass SDK"));
    }, SDK_LOAD_TIMEOUT_MS);
  });

  sdkPromise = attempt;
  return attempt;
}

export function loadShowpassSdk(environment: WidgetEnvironment = "prod"): Promise<ShowpassTickets> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Showpass SDK requires a browser"));
  }

  const config = WIDGET_ENVIRONMENTS[environment];
  if (!config) return Promise.reject(new Error("This widget environment is unavailable in this build."));
  const origin = config.origin;
  const loadedHost = (window as unknown as ShowpassWindow).showpass?.config?.host?.replace(/\/$/, "");
  if ((activeOrigin && activeOrigin !== origin) || (loadedHost && loadedHost !== origin)) {
    return Promise.reject(new Error("Reload the playground to use the selected environment."));
  }
  activeOrigin = origin;
  const readyTickets = getTickets();
  if (readyTickets) {
    if (!loadedHost) return Promise.reject(new Error("Reload the playground to load the current Showpass SDK."));
    return Promise.resolve(readyTickets);
  }
  if (sdkPromise) return sdkPromise;

  const sdkPath = environment === "dev" ? "/platform/sdk/sdk.js" : "/static/dist/sdk.js";
  return waitForScript(getOrCreateScriptState(`${origin}${sdkPath}`));
}
