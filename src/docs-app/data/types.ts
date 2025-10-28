
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

export interface ApiExamplesData {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  description?: string;
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
