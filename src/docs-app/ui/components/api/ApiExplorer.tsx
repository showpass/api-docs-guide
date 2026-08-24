import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, LoaderCircle, Play } from "lucide-react";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/tooltip.tsx";
import type {
  ApiExamplesData,
  ApiMethod,
  ApiOperation,
  ApiQueryParameter,
} from "@/docs-app/data/types.ts";

interface ApiExplorerProps {
  description?: string;
  endpoint: ApiExamplesData["endpoint"];
  method: ApiMethod;
  operations?: ApiOperation[];
  queryParameters?: ApiQueryParameter[];
  requestBodyTemplate?: string;
}

interface ApiResponse {
  body: string;
  status: number;
  statusText: string;
}

const isShowpassApiHost = (hostname: string) =>
  hostname === "showpass.com" || hostname.endsWith(".showpass.com");

const EXPLORER_STORAGE_KEYS = {
  authorization: "showpass-docs-explorer-authorization",
  baseUrl: "showpass-docs-explorer-base-url",
  partnerKeyId: "showpass-docs-explorer-partner-key-id",
  partnerSecret: "showpass-docs-explorer-partner-secret",
};

const getSessionValue = (key: string, fallback = "") => {
  if (typeof window === "undefined") return fallback;

  try {
    return window.sessionStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const normalizeEndpointPath = (path: string) =>
  path.replace(/%7B([^%]+)%7D/gi, "{$1}");

const getEndpointPathTemplate = (endpoint: string) =>
  normalizeEndpointPath(endpoint.replace(/^https?:\/\/[^/]+/, ""));

const getPathParameterNames = (path: string) => [
  ...new Set(Array.from(path.matchAll(/\{([^}]+)\}/g), ([, name]) => name)),
];

const setSessionValue = (key: string, value: string) => {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Session storage can be unavailable in privacy-restricted browser contexts.
  }
};

const formatJsonResponse = (body: string) => {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return undefined;
  }
};

interface CredentialWarningTooltipProps {
  label: string;
  message: string;
}

const CredentialWarningTooltip: React.FC<CredentialWarningTooltipProps> = ({
  label,
  message,
}) => (
  <TooltipProvider delayDuration={100} skipDelayDuration={0}>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-amber-600 transition-colors hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:text-amber-400"
        >
          <AlertCircle className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        sideOffset={4}
        className="max-w-xs text-xs leading-relaxed"
      >
        {message}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const createPartnerSignature = async (
  secret: string,
  method: string,
  path: string,
  body: string,
  timestamp: string,
  nonce: string,
) => {
  const encoder = new TextEncoder();
  const bodyHash = Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(body))),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  const canonical = ["v1", timestamp, nonce, method, path, bodyHash].join("\n");
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(canonical));

  return `sha256=${Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}`;
};

/**
 * Executes a user-authored request directly from the documentation page.
 * Credentials are kept in component state and sessionStorage for this browser
 * session. Browser cookies are never attached to the request.
 */
const ApiExplorer: React.FC<ApiExplorerProps> = ({
  description,
  endpoint,
  method,
  operations,
  queryParameters = [],
  requestBodyTemplate,
}) => {
  const defaultOperation = useMemo<ApiOperation>(
    () => ({
      endpoint,
      id: "default",
      label: method,
      method,
      queryParameters,
      requestBodyTemplate,
    }),
    [endpoint, method, queryParameters, requestBodyTemplate],
  );
  const availableOperations = operations?.length ? operations : [defaultOperation];
  const initialOperationId = availableOperations[0].id;
  const getOperationOptionLabel = (operation: ApiOperation) => {
    const collectionPath = getEndpointPathTemplate(endpoint);
    const operationPath = getEndpointPathTemplate(operation.endpoint);
    const hasDuplicateMethodAndPath = availableOperations.some(
      (candidate) =>
        candidate.id !== operation.id &&
        candidate.method === operation.method &&
        getEndpointPathTemplate(candidate.endpoint) === operationPath,
    );
    const suffix = operationPath.startsWith(collectionPath)
      ? operationPath.slice(collectionPath.length).replace(/\/$/, "")
      : operationPath;

    if (hasDuplicateMethodAndPath) return `${operation.method} ${operation.label}`;

    return suffix ? `${operation.method} /${suffix}` : operation.method;
  };
  const [selectedOperationId, setSelectedOperationId] = useState(
    initialOperationId,
  );
  const selectedOperation =
    availableOperations.find((operation) => operation.id === selectedOperationId) ??
    availableOperations[0];
  const activeEndpoint = selectedOperation.endpoint;
  const activeMethod = selectedOperation.method;
  const activeQueryParameters = selectedOperation.queryParameters ?? [];
  const activeRequestBodyTemplate = selectedOperation.requestBodyTemplate;
  const endpointUrl = useMemo(() => new URL(activeEndpoint), [activeEndpoint]);
  const isPartnerEndpoint = endpointUrl.pathname.startsWith("/api/partner/");
  const isPublicEndpoint = endpointUrl.pathname.startsWith("/api/public/");
  const [baseUrl, setBaseUrl] = useState(() =>
    getSessionValue(EXPLORER_STORAGE_KEYS.baseUrl, endpointUrl.origin),
  );
  const [endpointPath, setEndpointPath] = useState(() =>
    getEndpointPathTemplate(endpoint),
  );
  const [pathParameters, setPathParameters] = useState<Record<string, string>>({});
  const [queryParameterValues, setQueryParameterValues] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState(() =>
    getSessionValue(EXPLORER_STORAGE_KEYS.authorization),
  );
  const [partnerKeyId, setPartnerKeyId] = useState(() =>
    getSessionValue(EXPLORER_STORAGE_KEYS.partnerKeyId),
  );
  const [partnerSecret, setPartnerSecret] = useState(() =>
    getSessionValue(EXPLORER_STORAGE_KEYS.partnerSecret),
  );
  const [body, setBody] = useState(
    activeMethod === "GET" ? "" : activeRequestBodyTemplate ?? "{\n  \n}",
  );
  const [response, setResponse] = useState<ApiResponse>();
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const pathParameterNames = useMemo(
    () => getPathParameterNames(endpointPath),
    [endpointPath],
  );
  const resolvedEndpointPath = useMemo(
    () =>
      endpointPath.replace(/\{([^}]+)\}/g, (_, name) =>
        encodeURIComponent(pathParameters[name]?.trim() ?? ""),
      ),
    [endpointPath, pathParameters],
  );

  useEffect(() => {
    setSelectedOperationId(initialOperationId);
  }, [endpoint, initialOperationId]);

  useEffect(() => {
    setEndpointPath(getEndpointPathTemplate(activeEndpoint));
    setPathParameters({});
    setQueryParameterValues({});
    setBody(
      activeMethod === "GET" ? "" : activeRequestBodyTemplate ?? "{\n  \n}",
    );
    setError("");
    setResponse(undefined);
  }, [activeEndpoint, activeMethod, activeRequestBodyTemplate]);
  const formattedResponse = response && formatJsonResponse(response.body);

  const sendRequest = async () => {
    setError("");
    setResponse(undefined);

    let base: URL;
    try {
      base = new URL(baseUrl);
    } catch {
      setError("Enter a valid Showpass API base URL.");
      return;
    }

    if (base.protocol !== "https:") {
      setError("Use HTTPS for Showpass API requests.");
      return;
    }

    if (!isShowpassApiHost(base.hostname)) {
      setError("Use a Showpass API host, such as beta.showpass.com or demo.showpass.com.");
      return;
    }

    if (pathParameterNames.some((name) => !pathParameters[name]?.trim())) {
      setError("Enter a value for every endpoint parameter before sending.");
      return;
    }

    if (
      activeQueryParameters.some(
        (parameter) => parameter.required && !queryParameterValues[parameter.name]?.trim(),
      )
    ) {
      setError("Enter a value for every required query parameter before sending.");
      return;
    }

    if (
      !resolvedEndpointPath.startsWith("/") ||
      resolvedEndpointPath.startsWith("//")
    ) {
      setError("Enter an endpoint path beginning with a single slash.");
      return;
    }

    let url: URL;
    try {
      url = new URL(`${base.origin}${resolvedEndpointPath}`);
    } catch {
      setError("Enter a valid API endpoint path.");
      return;
    }

    activeQueryParameters.forEach((parameter) => {
      const value = queryParameterValues[parameter.name]?.trim();
      if (value) {
        url.searchParams.set(parameter.name, value);
      } else {
        url.searchParams.delete(parameter.name);
      }
    });

    if (isPartnerEndpoint && (!partnerKeyId || !partnerSecret)) {
      setError("Enter both your Partner Key ID and Partner Secret.");
      return;
    }

    if (!isPublicEndpoint && !isPartnerEndpoint && !apiKey.trim()) {
      setError("Enter your Showpass API key.");
      return;
    }

    setIsSending(true);
    try {
      const headers = new Headers();
      if (body) headers.set("Content-Type", "application/json");

      if (isPartnerEndpoint) {
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = crypto.randomUUID();
        const signature = await createPartnerSignature(
          partnerSecret,
          activeMethod,
          `${url.pathname}${url.search}`,
          body,
          timestamp,
          nonce,
        );
        headers.set("X-Showpass-Partner-Key-Id", partnerKeyId);
        headers.set("X-Showpass-Partner-Timestamp", timestamp);
        headers.set("X-Showpass-Partner-Nonce", nonce);
        headers.set("X-Showpass-Partner-Signature", signature);
      } else if (!isPublicEndpoint) {
        const token = apiKey.trim().replace(/^Token\s+/i, "");
        headers.set("Authorization", `Token ${token}`);
      }

      const apiResponse = await fetch(url, {
        method: activeMethod,
        headers,
        body: body || undefined,
        credentials: "omit",
      });
      const responseBody = await apiResponse.text();
      setResponse({
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        body: responseBody || "(empty response)",
      });
    } catch {
      setError(
        "The request could not be completed. Check the URL, credentials, and API CORS configuration.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 px-1 text-sm">
      <p className="text-xs leading-relaxed text-muted-foreground">
        Send a live request from this page. {description ? `${description}. ` : ""}{isPublicEndpoint
          ? "This public endpoint does not require credentials."
          : "Credentials remain in this browser session and are not sent with browser cookies."} Browser cookies are not sent.
      </p>

      <div
        className={
          availableOperations.length > 1
            ? "grid grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] gap-2"
            : "block"
        }
      >
        {availableOperations.length > 1 && (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-foreground">Method</span>
            <select
              value={selectedOperation.id}
              onChange={(event) => setSelectedOperationId(event.target.value)}
              className="h-7 w-full rounded-md border border-input bg-background px-2 text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {availableOperations.map((operation) => (
                <option key={operation.id} value={operation.id}>
                  {getOperationOptionLabel(operation)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground">Base URL</span>
          <input
            value={baseUrl}
            onChange={(event) => {
              setBaseUrl(event.target.value);
              setSessionValue(EXPLORER_STORAGE_KEYS.baseUrl, event.target.value);
            }}
            className="h-7 w-full rounded-md border border-input bg-background px-2 font-mono text-[11px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Base URL"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-foreground">Endpoint path</span>
        <input
          value={endpointPath}
          onChange={(event) => setEndpointPath(normalizeEndpointPath(event.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Endpoint path"
        />
      </label>

      {pathParameterNames.map((name) => (
        <label key={name} className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground">{name}</span>
          <input
            value={pathParameters[name] ?? ""}
            onChange={(event) =>
              setPathParameters((current) => ({
                ...current,
                [name]: event.target.value,
              }))
            }
            placeholder={`Value for ${name}`}
            className="h-9 w-full rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={name}
          />
        </label>
      ))}

      {activeQueryParameters.map((parameter) => (
        <label key={parameter.name} className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground">
            {parameter.name}
            {parameter.required ? "" : " (optional)"}
          </span>
          <input
            value={queryParameterValues[parameter.name] ?? ""}
            onChange={(event) =>
              setQueryParameterValues((current) => ({
                ...current,
                [parameter.name]: event.target.value,
              }))
            }
            placeholder={parameter.description ?? `Value for ${parameter.name}`}
            className="h-9 w-full rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={parameter.name}
          />
        </label>
      ))}

      {isPartnerEndpoint ? (
        <>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-foreground">Partner Key ID</span>
            <input
              value={partnerKeyId}
              onChange={(event) => {
                setPartnerKeyId(event.target.value);
                setSessionValue(EXPLORER_STORAGE_KEYS.partnerKeyId, event.target.value);
              }}
              autoComplete="off"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              Partner Secret
              <CredentialWarningTooltip
                label="Partner credential security warning"
                message="Partner secrets should stay in server-side code. Use this Explorer only with test credentials. Do not enter production Partner secrets in a browser because page scripts or an XSS vulnerability could access them."
              />
            </span>
            <input
              type="password"
              value={partnerSecret}
              onChange={(event) => {
                setPartnerSecret(event.target.value);
                setSessionValue(EXPLORER_STORAGE_KEYS.partnerSecret, event.target.value);
              }}
              autoComplete="off"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </>
      ) : !isPublicEndpoint ? (
        <>
          <label className="block space-y-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              API key
              <CredentialWarningTooltip
                label="API key security warning"
                message="API keys are sensitive credentials. Use a test key when possible, never share it, and avoid using production keys in a browser."
              />
            </span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                setSessionValue(EXPLORER_STORAGE_KEYS.authorization, event.target.value);
              }}
              placeholder="Your Showpass API key"
              autoComplete="off"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </>
      ) : null}

      {activeMethod !== "GET" && (
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-foreground">Request body</span>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            spellCheck={false}
            className="min-h-28 w-full resize-y rounded-md border border-input bg-background p-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Request body"
          />
        </label>
      )}

      {activeMethod !== "GET" && (
        <div className="flex gap-2 rounded-md border border-amber-500/30 bg-amber-500/10 p-2 text-xs leading-relaxed text-foreground">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          This request can change production data. Confirm the URL and body before sending.
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={sendRequest}
        disabled={isSending}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {isSending ? "Sending request" : "Try now"}
      </button>

      {response && (
        <div className="overflow-hidden rounded-md border border-border/70">
          <div className="border-b border-border/70 bg-muted/40 px-3 py-2 font-mono text-xs font-medium text-foreground">
            {response.status} {response.statusText}
          </div>
          {formattedResponse ? (
            <CodeBlock code={formattedResponse} language="javascript" colorful />
          ) : (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed text-foreground">
              {response.body}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiExplorer;
