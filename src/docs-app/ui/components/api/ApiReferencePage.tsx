import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownToLine, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  developerRequestExamples,
  loadReference,
  referencePath,
  schemaType,
  type OperationResponse,
  type Parameter,
  type ReferenceDocument,
  type ReferenceOperation,
  type ReferenceProfile,
  type Schema,
} from "@/docs-app/application/api-reference";
import { OpenApiSchema, SchemaConstraints, SchemaDisclosure } from "./OpenApiSchema";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock";
import { seoDataMap } from "@/docs-app/data/seoData";
import type { ApiExamplesData, ApiMethod } from "@/docs-app/data/types";
import { useDocLayoutData } from "@/docs-app/ui/components/layout/DocLayout";
import { useHashScroll } from "@/docs-app/ui/hooks/useHashScroll";
import { useScrollSpy } from "@/docs-app/ui/hooks/useScrollSpy";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/alert";
import { Button } from "@/shared/components/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/shared/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/popover";
import SEOHead from "@/shared/components/SEOHead";
import { cn } from "@/shared/lib/utils";

const methodStyles: Record<string, string> = {
  get: "border-sky-500/35 bg-sky-500/10",
  post: "border-emerald-500/35 bg-emerald-500/10",
  put: "border-amber-500/35 bg-amber-500/10",
  patch: "border-amber-500/35 bg-amber-500/10",
  delete: "border-rose-500/35 bg-rose-500/10",
};

const exampleMethods: Partial<Record<ReferenceOperation["method"], ApiMethod>> = {
  get: "GET", delete: "DELETE", post: "POST", put: "PUT", patch: "PATCH",
};

const stagingTargets = [
  { label: "Beta (beta.showpass.com)", origin: "https://beta.showpass.com" },
  { label: "Demo (demo.showpass.com)", origin: "https://demo.showpass.com" },
];

const testTargets = import.meta.env.DEV && ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? [{ label: "Local API (127.0.0.1:8000)", origin: "http://127.0.0.1:8000" }, ...stagingTargets]
  : stagingTargets;

const outlineSections = [
  { id: "authentication", title: "Authentication" },
  { id: "parameters", title: "Parameters" },
  { id: "request-body", title: "Request body" },
  { id: "responses", title: "Responses" },
] as const;

function makeExamples(operation: ReferenceOperation, spec: ReferenceDocument["spec"]): ApiExamplesData | undefined {
  const method = exampleMethods[operation.method];
  const server = spec.servers?.[0]?.url;
  const key = spec.components?.securitySchemes?.DeveloperKey;
  const usesDeveloperKey = operation.security?.some((requirement) =>
    Object.keys(requirement).length === 1 && "DeveloperKey" in requirement);
  if (!method || !server || !usesDeveloperKey ||
      key?.type !== "apiKey" || key.in !== "header" || key.name !== "Authorization") return;

  const endpoint = `${server.replace(/\/$/, "")}${operation.path}`;
  const success = Object.entries(operation.responses).find(([status]) => /^2\d{2}$/.test(status));
  const media = success?.[1].content?.["application/json"];
  const body = media?.example ?? Object.values(media?.examples ?? {}).find(({ value }) => value !== undefined)?.value;
  const requestMedia = operation.requestBody?.content["application/json"];
  if (operation.requestBody && !requestMedia) return;
  const requestExample = requestMedia?.example ??
    Object.values(requestMedia?.examples ?? {}).find(({ value }) => value !== undefined)?.value;
  const requestBodyTemplate = requestMedia ? JSON.stringify(requestExample ?? {}, null, 2) : undefined;

  return {
    endpoint,
    method,
    queryParameters: operation.parameters?.filter(({ in: location }) => location === "query"),
    description: "Replace the path placeholders and set SHOWPASS_API_KEY for the API host.",
    examples: developerRequestExamples(method, endpoint, requestBodyTemplate),
    requestBodyTemplate,
    response: success && body && typeof body === "object" && !Array.isArray(body)
      ? { status: Number(success[0]), body: body as Record<string, unknown> }
      : undefined,
    testTargets,
  };
}

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={cn(
      "inline-flex w-14 shrink-0 justify-center rounded border px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-foreground",
      methodStyles[method] ?? "border-border bg-muted",
    )}>
      {method}
    </span>
  );
}

function ParameterList({ parameters }: { parameters: Parameter[] }) {
  return (
    <dl className="divide-y divide-border">
      {parameters.map((parameter) => (
        <div key={`${parameter.in}:${parameter.name}`} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] sm:gap-4">
          <dt className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
            <code className="break-all text-xs font-semibold">{parameter.name}</code>
            <span className="break-words text-xs text-muted-foreground">{schemaType(parameter.schema)}</span>
            {parameter.required && <span className="text-xs font-medium text-primary">Required</span>}
            {parameter.deprecated && <span className="text-xs font-medium text-muted-foreground">Deprecated</span>}
          </dt>
          <dd className="min-w-0">
            {parameter.description && <p className="break-words text-sm leading-relaxed text-muted-foreground">{parameter.description}</p>}
            <SchemaConstraints schema={parameter.schema} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function MediaContent({ content, components, schemaTitle }: {
  content?: OperationResponse["content"];
  components: Record<string, Schema>;
  schemaTitle: string;
}) {
  return (
    <>
      {Object.entries(content ?? {}).map(([mediaType, media]) => (
        <div key={mediaType} className="min-w-0 space-y-2">
          <p className="font-mono text-xs text-muted-foreground">{mediaType}</p>
          {media.schema !== undefined && (
            <SchemaDisclosure title={schemaTitle}>
              <OpenApiSchema schema={media.schema} components={components} />
            </SchemaDisclosure>
          )}
          {Object.entries(media.examples ?? {}).map(([name, example]) => example.value !== undefined && (
            <SchemaDisclosure key={name} title={`Example · ${example.summary ?? name}`}>
              <CodeBlock code={JSON.stringify(example.value, null, 2)} language="json" colorful />
            </SchemaDisclosure>
          ))}
          {media.example !== undefined && (
            <SchemaDisclosure title="Example">
              <CodeBlock code={JSON.stringify(media.example, null, 2)} language="json" colorful />
            </SchemaDisclosure>
          )}
        </div>
      ))}
    </>
  );
}

function ResponseBody({ response, components }: { response: OperationResponse; components: Record<string, Schema> }) {
  return (
    <>
      {response.headers && Object.keys(response.headers).length > 0 && (
        <SchemaDisclosure title="Response headers">
          <ParameterList
            parameters={Object.entries(response.headers).map(([name, header]) => ({ name, in: "header", ...header }))}
          />
        </SchemaDisclosure>
      )}
      <MediaContent content={response.content} components={components} schemaTitle="Response schema" />
    </>
  );
}

function OperationDetails({ operation, spec, guidePath }: {
  operation: ReferenceOperation;
  spec: ReferenceDocument["spec"];
  guidePath: string;
}) {
  const components = spec.components?.schemas ?? {};
  const schemeNames = new Set(operation.security?.flatMap((requirement) => Object.keys(requirement)));
  const schemes = Object.entries(spec.components?.securitySchemes ?? {}).filter(([name]) => schemeNames.has(name));
  const scopes = operation["x-showpass-scopes"] ?? [];
  const permissions = operation["x-showpass-employee-permissions"] ?? [];
  const queryParameters = (operation.parameters ?? []).filter((parameter) => parameter.in === "query");
  const otherParameters = (operation.parameters ?? []).filter((parameter) => parameter.in !== "query");
  return (
    <>
      <header className="min-w-0 space-y-4 pb-5">
        <h2 className="m-0 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{operation.summary}</h2>
        <div className="flex min-w-0 items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-3">
          <MethodBadge method={operation.method} />
          <code className="min-w-0 break-all pt-0.5 text-xs leading-relaxed sm:text-sm">{operation.path}</code>
        </div>
        {operation.description && <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{operation.description}</p>}
      </header>

      <section className="space-y-3 border-b border-border py-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 id={`${operation.operationId}/authentication`} data-reference-section className="text-xl font-semibold tracking-tight">Authentication</h3>
          <Link to={guidePath} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            API guide <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        {scopes.length > 0 && (
          <p className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">Required scope</span>
            {scopes.map((scope) => (
              <code key={scope} className="rounded border border-primary/25 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">{scope}</code>
            ))}
          </p>
        )}
        {permissions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Employee permission <code className="text-xs text-foreground">{permissions.join(", ")}</code>
          </p>
        )}
        {schemes.map(([name, scheme]) => (
          <p key={name} className="text-sm leading-relaxed text-muted-foreground">
            {scheme.name && <code className="mr-2 rounded bg-muted px-1.5 py-0.5 text-xs text-foreground">{scheme.name}</code>}
            {scheme.description}
          </p>
        ))}
      </section>

      <section className="space-y-3 border-b border-border py-5">
        <h3 id={`${operation.operationId}/parameters`} data-reference-section className="text-xl font-semibold tracking-tight">Parameters</h3>
        {otherParameters.length > 0 && <ParameterList parameters={otherParameters} />}
        {queryParameters.length > 0 && (
          <SchemaDisclosure title={`Query parameters (${queryParameters.length})`}>
            <ParameterList parameters={queryParameters} />
          </SchemaDisclosure>
        )}
      </section>

      {operation.requestBody && (
        <section className="space-y-3 border-b border-border py-5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`${operation.operationId}/request-body`} data-reference-section className="text-xl font-semibold tracking-tight">Request body</h3>
            {operation.requestBody.required && <span className="text-xs font-medium text-primary">Required</span>}
          </div>
          {operation.requestBody.description && (
            <p className="text-sm text-muted-foreground">{operation.requestBody.description}</p>
          )}
          <MediaContent content={operation.requestBody.content} components={components} schemaTitle="Request schema" />
        </section>
      )}

      <section className="space-y-2 pt-5">
        <h3 id={`${operation.operationId}/responses`} data-reference-section className="text-xl font-semibold tracking-tight">Responses</h3>
        {Object.entries(operation.responses).map(([code, response]) => (
          <SchemaDisclosure key={code} title={
            <span className="flex min-w-0 items-start gap-2">
              <code className={cn("shrink-0 text-xs", code.startsWith("2") && "text-primary")}>{code}</code>
              <span className="break-words text-xs font-normal leading-relaxed text-muted-foreground">{response.description}</span>
            </span>
          }>
            <ResponseBody response={response} components={components} />
          </SchemaDisclosure>
        ))}
      </section>
    </>
  );
}

export default function ApiReferencePage({ profile }: { profile: ReferenceProfile }) {
  const { hash } = useLocation();
  const navigate = useNavigate();
  const { setPageData } = useDocLayoutData();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { data, error, isPending, isFetching, refetch } = useQuery({
    queryKey: ["api-reference", profile.schemaPath, profile.sha256],
    queryFn: ({ signal }) => loadReference(profile, signal),
    retry: false,
    staleTime: Infinity,
  });

  const requestedId = hash.slice(1).split("/")[0];
  const selected = data?.operations.find((operation) => operation.operationId === requestedId) ?? data?.operations[0];
  const description = profile.description ?? data?.spec.info.description;
  const examples = useMemo(() => data && selected ? makeExamples(selected, data.spec) : undefined, [data, selected]);
  const activeSection = useScrollSpy("[data-reference-section]", 100);

  useLayoutEffect(() => {
    setPageData({
      pageTitle: profile.title,
      hideRightSidebar: !selected,
      tocItems: selected ? outlineSections
        .filter(({ id }) => id !== "request-body" || selected.requestBody)
        .map(({ id, title }) => ({ title, href: `#${selected.operationId}/${id}`, level: 2 })) : [],
      activeSection: activeSection ?? undefined,
      apiExamplesData: examples,
    });
  }, [profile.title, selected, examples, activeSection, setPageData]);

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [profile.slug]);

  useHashScroll(100, Boolean(selected), hash);

  return (
    <div className="min-w-0 pb-5">
      <SEOHead {...seoDataMap[referencePath(profile)]} />
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5 pt-4">
        <div className="min-w-0 max-w-2xl space-y-2">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{profile.title}</h1>
          {description && <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>}
          {data && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>Contract <strong className="font-medium text-foreground">{profile.contractVersion}</strong></span>
              <span>OpenAPI {data.spec.openapi}</span>
            </div>
          )}
        </div>
        {data && (
          <Button size="sm" variant="outline" asChild>
            <a href={profile.schemaPath} download>
              <ArrowDownToLine className="mr-2 h-4 w-4" aria-hidden="true" /> Download OpenAPI
            </a>
          </Button>
        )}
      </header>

      {isPending && <p className="py-6 text-sm text-muted-foreground" role="status">Loading API reference…</p>}
      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>API reference unavailable</AlertTitle>
          <AlertDescription>
            <p>{error.message}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => void refetch()} disabled={isFetching}>
              {isFetching ? "Retrying…" : "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {data && !selected && (
        <p className="py-6 text-sm text-muted-foreground">This contract contains no operations.</p>
      )}
      {data && selected && (
        <>
          <div className="pb-6 pt-5">
            <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-auto min-h-10 max-w-full justify-between gap-2 px-3 py-2 text-left"
                  aria-label={`Choose endpoint, ${selected.summary}`}>
                  <MethodBadge method={selected.method} />
                  <span className="whitespace-normal break-words">{selected.summary}</span>
                  <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-[min(26rem,calc(100vw-2rem))] p-0" aria-label={`Choose an endpoint in the ${profile.title}`}>
                <Command label="Search endpoints">
                  <CommandInput placeholder="Search endpoints…" aria-label="Search endpoints" />
                  <CommandList>
                    <CommandEmpty>No endpoints match this search.</CommandEmpty>
                    {data.operations.map((operation) => (
                      <CommandItem key={operation.operationId} value={operation.operationId}
                        keywords={[operation.method, operation.summary, operation.path, ...(operation["x-showpass-scopes"] ?? [])]}
                        onSelect={() => {
                          setPickerOpen(false);
                          navigate(`${referencePath(profile)}#${operation.operationId}`);
                        }}>
                        <MethodBadge method={operation.method} />
                        <span className="ml-2 break-words">{operation.summary}</span>
                      </CommandItem>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <article id={selected.operationId} className="min-w-0 scroll-mt-24" aria-label={selected.summary}>
            <OperationDetails key={selected.operationId} operation={selected} spec={data.spec} guidePath={profile.guidePath} />
          </article>
        </>
      )}
    </div>
  );
}
