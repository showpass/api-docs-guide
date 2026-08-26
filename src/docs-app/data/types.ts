
/**
 * Shared types for the documentation system
 */

// API Examples types
export interface ApiExampleSet {
  curl: string;
  python: string;
  node: string;
}

export interface ApiResponseField {
  name: string;
  type: string;
  description: string;
}

export interface ApiResponseData {
  status: number;
  body: Record<string, any>;
  fields?: ApiResponseField[];
}

export interface ApiQueryParameter {
  description?: string;
  name: string;
  required?: boolean;
}

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiOperation {
  endpoint: string;
  id: string;
  label: string;
  method: ApiMethod;
  queryParameters?: ApiQueryParameter[];
  requestBodyTemplate?: string;
}

export interface ApiExamplesData {
  endpoint: string;
  method: ApiMethod;
  methods?: ApiMethod[];
  operations?: ApiOperation[];
  description?: string;
  queryParameters?: ApiQueryParameter[];
  requestBodyTemplate?: string;
  examples: ApiExampleSet;
  response: ApiResponseData;
}

// TableOfContents types
export interface TocItem {
  title: string;
  href: string;
  level: number;
}

// Parameter Table types
export interface ParameterRow {
  parameter: string;
  type: string;
  status: string;
  description: string;
}
