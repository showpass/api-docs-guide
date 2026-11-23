import type { ApiExampleSet, ApiMethod } from "@/docs-app/data/types";
import catalog from "@/docs-app/data/api-reference-catalog.json";

export interface ReferenceProfile {
  slug: string;
  title: string;
  description?: string;
  guidePath: string;
  schemaPath: string;
  contractVersion: string;
  sha256: string;
  sourceRevision: string;
  sourceDiffSha256?: string;
}

export const referenceProfiles: ReferenceProfile[] = catalog;
export const referencePath = (profile: ReferenceProfile) => `/api/${profile.slug}`;

type HttpMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";
const methods: HttpMethod[] = ["get", "put", "post", "delete", "options", "head", "patch", "trace"];

export interface SchemaObject {
  $ref?: string;
  type?: string | string[];
  description?: string;
  format?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  items?: Schema;
  anyOf?: Schema[];
  oneOf?: Schema[];
  allOf?: Schema[];
  additionalProperties?: Schema;
  enum?: unknown[];
  default?: unknown;
  readOnly?: boolean;
  writeOnly?: boolean;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  maxItems?: number;
  pattern?: string;
  "x-showpass-field-scopes"?: string[];
}

export type Schema = SchemaObject | boolean;

export interface Parameter {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: Schema;
}

interface MediaType {
  schema?: Schema;
  example?: unknown;
  examples?: Record<string, { summary?: string; value?: unknown }>;
}

export interface OperationResponse {
  description: string;
  headers?: Record<string, { description?: string; schema?: Schema }>;
  content?: Record<string, MediaType>;
}

interface Operation {
  operationId: string;
  summary: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  security?: Record<string, string[]>[];
  responses: Record<string, OperationResponse>;
  "x-showpass-scopes"?: string[];
  "x-showpass-employee-permissions"?: string[];
}

interface SecurityScheme {
  type: string;
  name?: string;
  in?: string;
  description?: string;
}

interface OpenApiDocument {
  openapi: string;
  info: { title: string; version: string; description?: string };
  servers?: { url: string; description?: string }[];
  paths: Record<string, Partial<Record<HttpMethod, Operation>>>;
  components?: {
    schemas?: Record<string, Schema>;
    securitySchemes?: Record<string, SecurityScheme>;
  };
}

export interface ReferenceOperation extends Operation {
  method: HttpMethod;
  path: string;
}

export interface ReferenceDocument {
  spec: OpenApiDocument;
  operations: ReferenceOperation[];
}

export async function loadReference(profile: ReferenceProfile, signal: AbortSignal): Promise<ReferenceDocument> {
  const response = await fetch(profile.schemaPath, { signal, cache: "no-cache" });
  if (!response.ok || !response.headers.get("content-type")?.includes("json")) {
    throw new Error("The OpenAPI file is missing or unavailable.");
  }

  const bytes = await response.arrayBuffer();
  if (!crypto.subtle) throw new Error("Checksum verification requires HTTPS or localhost.");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const checksum = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (checksum !== profile.sha256) {
    throw new Error("The OpenAPI file failed its checksum verification.");
  }

  const spec = JSON.parse(new TextDecoder().decode(bytes)) as OpenApiDocument;
  if (!spec.openapi?.startsWith("3.1.") || spec.info?.version !== profile.contractVersion || !spec.paths) {
    throw new Error("The OpenAPI file does not match the reference version.");
  }

  const operations = Object.entries(spec.paths).flatMap(([path, item]) =>
    methods.flatMap((method) => {
      const operation = item[method];
      return operation ? [{ ...operation, method, path }] : [];
    }),
  );

  return { spec, operations };
}

export function componentName(ref: string) {
  const prefix = "#/components/schemas/";
  return ref.startsWith(prefix) ? ref.slice(prefix.length).replace(/~1/g, "/").replace(/~0/g, "~") : undefined;
}

export function schemaType(schema: Schema | undefined): string {
  if (schema === false) return "never";
  if (!schema || schema === true) return "any";
  if (schema.$ref) return componentName(schema.$ref) ?? "schema reference";
  if (schema.items !== undefined) return `array of ${schemaType(schema.items)}`;
  if (Array.isArray(schema.type)) return schema.type.join(" or ");
  if (schema.type) return schema.type;
  if (schema.anyOf || schema.oneOf) {
    const options = [...new Set((schema.anyOf ?? schema.oneOf).map(schemaType))];
    return options.length > 2 ? `${options.length} possible shapes` : options.join(" or ");
  }
  if (schema.allOf) return schema.allOf.map(schemaType).join(" and ");
  return schema.properties ? "object" : "any";
}

export function developerRequestExamples(method: ApiMethod, url: string): ApiExampleSet {
  const quotedUrl = "'" + url.replace(/'/g, "'\"'\"'") + "'";
  const urlLiteral = JSON.stringify(url);
  return {
    curl: [
      `curl --request ${method} ${quotedUrl}`,
      '  --header "Authorization: Token $SHOWPASS_API_KEY"',
      "  --header 'Accept: application/json'",
    ].join(" \\\n"),
    python: [
      "import os",
      "import requests",
      "",
      "response = requests.request(",
      `    "${method}",`,
      `    ${urlLiteral},`,
      "    headers={",
      '        "Authorization": "Token " + os.environ["SHOWPASS_API_KEY"],',
      '        "Accept": "application/json",',
      "    },",
      "    timeout=30,",
      "    allow_redirects=False,",
      ")",
      "print(response.status_code, response.text)",
    ].join("\n"),
    node: [
      `const response = await fetch(${urlLiteral}, {`,
      `  method: "${method}",`,
      "  headers: {",
      '    Authorization: "Token " + process.env.SHOWPASS_API_KEY,',
      '    Accept: "application/json",',
      "  },",
      '  redirect: "error",',
      "});",
      "console.log(response.status, await response.text());",
    ].join("\n"),
  };
}
