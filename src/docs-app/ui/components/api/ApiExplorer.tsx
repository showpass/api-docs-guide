import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, LoaderCircle, Play } from "lucide-react";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import { developerRequestExamples } from "@/docs-app/application/api-reference";
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
  referenceTargets?: readonly { label: string; origin: string }[];
}

interface ApiResponse {
  body: string;
  status: number;
  statusText: string;
  elapsedMs: number;
}

const isShowpassApiHost = (hostname: string) =>
  hostname === "showpass.com" || hostname.endsWith(".showpass.com");

const isProductionShowpassHost = (hostname: string) =>
  hostname === "showpass.com" || hostname === "www.showpass.com";

const EXPLORER_STORAGE_KEYS = {
  baseUrl: "showpass-docs-explorer-base-url",
};

const LEGACY_CREDENTIAL_STORAGE_KEYS = [
  "showpass-docs-explorer-authorization",
  "showpass-docs-explorer-partner-key-id",
  "showpass-docs-explorer-partner-secret",
] as const;

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
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Session storage can be unavailable in privacy-restricted browser contexts.
  }
};

const removeSessionValue = (key: string) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(key);
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

function buildRequestUrl(
  origin: string,
  path: string,
  parameters: ApiQueryParameter[],
  values: Record<string, string>,
) {
  const url = new URL(`${origin}${path}`);
  parameters.forEach(({ name }) => {
    const value = values[name]?.trim();
    if (value) url.searchParams.set(name, value);
    else url.searchParams.delete(name);
  });
  return url;
}

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
  // This is the signing protocol marker, independent of the API URL version.
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
 * Credentials are kept in component state only. Browser cookies are never
 * attached to the request.
 */
const ApiExplorer: React.FC<ApiExplorerProps> = ({
  endpoint,
  method,
  operations,
  queryParameters = [],
  requestBodyTemplate,
  referenceTargets,
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
  const hasRequestBody = referenceTargets ? Boolean(activeRequestBodyTemplate) : activeMethod !== "GET";
  const endpointUrl = useMemo(() => new URL(activeEndpoint), [activeEndpoint]);
  const isPartnerEndpoint = endpointUrl.pathname.startsWith("/api/v1/partner/");
  const isPublicEndpoint = endpointUrl.pathname.startsWith("/api/public/");
  const [baseUrl, setBaseUrl] = useState(() =>
    referenceTargets?.[0]?.origin ?? getSessionValue(EXPLORER_STORAGE_KEYS.baseUrl, endpointUrl.origin),
  );
  const [endpointPath, setEndpointPath] = useState(() =>
    getEndpointPathTemplate(endpoint),
  );
  const [pathParameters, setPathParameters] = useState<Record<string, string>>({});
  const [queryParameterValues, setQueryParameterValues] = useState<Record<string, string>>({});
  const [apiKey, setApiKey] = useState("");
  const [partnerKeyId, setPartnerKeyId] = useState("");
  const [partnerSecret, setPartnerSecret] = useState("");
  const [body, setBody] = useState(
    hasRequestBody ? activeRequestBodyTemplate ?? "{\n  \n}" : "",
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
  const deleteRequest = Boolean(referenceTargets && activeMethod === "DELETE");
  const archiveRequest = deleteRequest && endpointUrl.pathname.includes("/events/");
  const completePath = pathParameterNames.every((name) => pathParameters[name]?.trim());
  const validReferencePath = pathParameterNames.every((name) => {
    const value = pathParameters[name]?.trim() ?? "";
    return value !== "" && value !== "." && value !== ".." && !/[\\/]/.test(value);
  });
  const curl = referenceTargets && validReferencePath
    ? developerRequestExamples(
      activeMethod, buildRequestUrl(baseUrl, resolvedEndpointPath, activeQueryParameters, queryParameterValues).href,
      hasRequestBody ? body : undefined,
    ).curl
    : undefined;
  let requestLabel = referenceTargets ? "Send request" : "Try now";
  if (isSending) {
    requestLabel = "Sending request";
  } else if (archiveRequest) {
    requestLabel = "Archive test event";
  } else if (deleteRequest) {
    requestLabel = "Delete test resource";
  }

  useEffect(() => {
    setSelectedOperationId(initialOperationId);
  }, [endpoint, initialOperationId]);

  useEffect(() => {
    // Remove credentials written by versions of the Explorer that persisted them.
    LEGACY_CREDENTIAL_STORAGE_KEYS.forEach(removeSessionValue);
  }, []);

  useEffect(() => {
    setEndpointPath(getEndpointPathTemplate(activeEndpoint));
    setPathParameters({});
    setQueryParameterValues({});
    setBody(
      hasRequestBody ? activeRequestBodyTemplate ?? "{\n  \n}" : "",
    );
    setError("");
    setResponse(undefined);
  }, [activeEndpoint, activeMethod, activeRequestBodyTemplate, hasRequestBody]);
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

    if (referenceTargets && !referenceTargets.some(({ origin }) => origin === baseUrl)) {
      setError("Select a Showpass test server.");
      return;
    }

    if (!referenceTargets && base.protocol !== "https:") {
      setError("Use HTTPS for Showpass API requests.");
      return;
    }

    if (!referenceTargets && !isShowpassApiHost(base.hostname)) {
      setError("Use a Showpass API host, such as beta.showpass.com or demo.showpass.com.");
      return;
    }

    if (!completePath) {
      setError("Enter a value for every endpoint parameter before sending.");
      return;
    }

    if (referenceTargets && !validReferencePath) {
      setError("Enter a single ID or slug for each path parameter.");
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
      url = buildRequestUrl(base.origin, resolvedEndpointPath, activeQueryParameters, queryParameterValues);
    } catch {
      setError("Enter a valid API endpoint path.");
      return;
    }

    if (isProductionShowpassHost(base.hostname) && !isPublicEndpoint) {
      setError(
        "For security, authenticated Explorer requests are blocked on Showpass production. Use beta.showpass.com or demo.showpass.com, or make the request from server-side code.",
      );
      return;
    }

    const keyId = partnerKeyId.trim();
    if (isPartnerEndpoint && (!keyId || !partnerSecret || /\s/.test(keyId))) {
      setError("Enter your Partner key ID and Partner secret separately.");
      return;
    }

    const token = apiKey.trim().replace(/^Token(?:\s+|$)/i, "");
    // Trimming cleans up the ends, so the whitespace check still catches a split key.
    if (!isPublicEndpoint && !isPartnerEndpoint && (!token || (referenceTargets && /\s/.test(token)))) {
      setError("Enter your Showpass API key.");
      return;
    }

    if (referenceTargets && hasRequestBody && formatJsonResponse(body) === undefined) {
      setError("Enter a valid JSON request body.");
      return;
    }

    if (deleteRequest) {
      const action = archiveRequest ? "Archive the test event" : "Delete the test resource";
      if (!window.confirm(`${action} at ${url.href}?`)) return;
    }

    setIsSending(true);
    const started = performance.now();
    try {
      const headers = new Headers();
      if (referenceTargets) headers.set("Accept", "application/json");
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
        headers.set("X-Showpass-Partner-Key-Id", keyId);
        headers.set("X-Showpass-Partner-Timestamp", timestamp);
        headers.set("X-Showpass-Partner-Nonce", nonce);
        headers.set("X-Showpass-Partner-Signature", signature);
      } else if (!isPublicEndpoint) {
        headers.set("Authorization", `Token ${token}`);
      }

      const apiResponse = await fetch(url, {
        method: activeMethod,
        headers,
        body: body || undefined,
        credentials: "omit",
        ...(referenceTargets && { redirect: "error", cache: "no-store" }),
      });
      const responseBody = await apiResponse.text();
      setResponse({
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        body: responseBody || "(empty response)",
        elapsedMs: Math.round(performance.now() - started),
      });
    } catch {
      setError(
        referenceTargets
          ? "The browser could not reach the test API. Check that the server allows requests from this page, or run a request example from your terminal."
          : "The request could not be completed. Check the URL, credentials, and API CORS configuration.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const renderQueryParameter = (parameter: ApiQueryParameter) => (
    <label key={parameter.name} className="block space-y-1.5">
      <span className="text-xs font-medium text-foreground">
        {parameter.name}
        {referenceTargets ? (parameter.required ? " (required)" : "") : (parameter.required ? "" : " (optional)")}
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
  );

  const optionalQueryParameters = activeQueryParameters.filter(({ required }) => !required);

  return (
    <div className="space-y-4 px-1 text-sm">
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

        {referenceTargets ? (
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-foreground">Test server</span>
            <select
              value={baseUrl}
              disabled={isSending}
              onChange={(event) => {
                setBaseUrl(event.target.value);
                setApiKey("");
                setResponse(undefined);
                setError("");
              }}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {referenceTargets.map(({ label, origin }) => <option key={origin} value={origin}>{label}</option>)}
            </select>
          </label>
        ) : (
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
        )}
      </div>

      {!referenceTargets && <label className="block space-y-1.5">
        <span className="text-xs font-medium text-foreground">Endpoint path</span>
        <input
          value={endpointPath}
          onChange={(event) => setEndpointPath(normalizeEndpointPath(event.target.value))}
          className="h-9 w-full rounded-md border border-input bg-background px-2 font-mono text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Endpoint path"
        />
      </label>}

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

      {referenceTargets ? (
        <>
          {activeQueryParameters.filter(({ required }) => required).map(renderQueryParameter)}
          {optionalQueryParameters.length > 0 && (
            <details className="rounded-md border border-border">
              <summary className="cursor-pointer px-3 py-2 text-xs font-medium">
                Optional query parameters ({optionalQueryParameters.length})
              </summary>
              <div className="grid gap-3 border-t border-border p-3 sm:grid-cols-2">
                {optionalQueryParameters.map(renderQueryParameter)}
              </div>
            </details>
          )}
        </>
      ) : activeQueryParameters.map(renderQueryParameter)}

      {isPartnerEndpoint ? (
        <>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-foreground">Partner key ID</span>
            <input
              type="text"
              value={partnerKeyId}
              onChange={(event) => setPartnerKeyId(event.target.value)}
              placeholder="<partner_key_id>"
              autoComplete="off"
              spellCheck={false}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-foreground">
              Partner secret
              <CredentialWarningTooltip
                label="Partner secret security warning"
                message="Enter the separate secret provided by Showpass. The Explorer uses it for HMAC signing and sends only the key ID and signature. Both values are held in memory only and are cleared when the page is reloaded. Use test credentials only; authenticated production requests are blocked."
              />
            </span>
            <input
              type="password"
              value={partnerSecret}
              onChange={(event) => setPartnerSecret(event.target.value)}
              placeholder="Your Partner secret"
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
                message="API keys are sensitive credentials. This value is held in memory only and is cleared when the page is reloaded. Use a test key; authenticated production requests are blocked."
              />
            </span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
              }}
              placeholder="Your Showpass API key"
              aria-label="API key"
              autoComplete="off"
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </>
      ) : null}

      {hasRequestBody && (
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

      {error && (
        <div role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {deleteRequest && (
        <p className="text-xs text-muted-foreground">
          {archiveRequest
            ? "This request archives the specified event on the selected test server."
            : "This request deletes the specified resource on the selected test server."}
        </p>
      )}
      <button
        type="button"
        onClick={sendRequest}
        disabled={isSending}
        className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {requestLabel}
      </button>

      {response && (
        <div className="overflow-hidden rounded-md border border-border/70">
          <div role="status" className="flex flex-wrap justify-between gap-2 border-b border-border/70 bg-muted/40 px-3 py-2 font-mono text-xs font-medium text-foreground">
            <span>{response.status} {response.statusText || (response.status >= 200 && response.status < 300 ? "Success" : "")}</span>
            {referenceTargets && <span className="text-muted-foreground">{response.elapsedMs} ms</span>}
          </div>
          <div className={referenceTargets ? "max-h-80 overflow-auto bg-[hsl(var(--prose-pre-bg))]" : undefined}>
            {formattedResponse ? (
              <CodeBlock code={formattedResponse} language="json" colorful />
            ) : (
              <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-xs leading-relaxed text-foreground">
                {response.body}
              </pre>
            )}
          </div>
        </div>
      )}
      {curl && (
        <details className="rounded-md border border-border">
          <summary className="cursor-pointer px-3 py-2 text-xs font-medium">Copy this request as cURL</summary>
          <div className="border-t border-border px-3">
            <CodeBlock code={curl} language="bash" />
          </div>
        </details>
      )}
    </div>
  );
};

export default ApiExplorer;
