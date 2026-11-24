import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { componentName, schemaType, type Schema, type SchemaObject } from "@/docs-app/application/api-reference";

type Components = Record<string, Schema>;

export function SchemaDisclosure({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details onToggle={(event) => setOpen(event.currentTarget.open)} className="rounded-md border border-border [&[open]>summary>svg]:rotate-90">
      <summary className="flex min-w-0 cursor-pointer list-none items-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-offset-4 [&::-webkit-details-marker]:hidden [&::marker]:content-none">
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="min-w-0 break-words">{title}</span>
      </summary>
      {open && <div className="min-w-0 space-y-2 border-t border-border px-3 py-3">{children}</div>}
    </details>
  );
}

export function SchemaConstraints({ schema }: { schema?: Schema }) {
  if (!schema || typeof schema !== "object") return null;
  const constraints = [
    schema.format,
    schema.minimum !== undefined ? `minimum ${schema.minimum}` : undefined,
    schema.maximum !== undefined ? `maximum ${schema.maximum}` : undefined,
    schema.minLength !== undefined ? `min length ${schema.minLength}` : undefined,
    schema.maxLength !== undefined ? `max length ${schema.maxLength}` : undefined,
    schema.maxItems !== undefined ? `max items ${schema.maxItems}` : undefined,
    schema.default !== undefined ? `default ${JSON.stringify(schema.default)}` : undefined,
    schema.pattern ? `pattern ${schema.pattern}` : undefined,
  ].filter(Boolean);
  return (
    <>
      {constraints.length > 0 && <p className="mt-1 break-words text-xs text-muted-foreground">{constraints.join(" · ")}</p>}
      {schema.enum && <EnumValues values={schema.enum} />}
    </>
  );
}

function EnumValues({ values }: { values: unknown[] }) {
  const renderedValues = values.map((value) => JSON.stringify(value)).join(", ");
  if (values.length < 9) {
    return <p className="mt-1 break-words text-xs text-muted-foreground">Values {renderedValues}</p>;
  }
  return (
    <div className="mt-2">
      <SchemaDisclosure title={`Allowed values (${values.length})`}>
        <p className="max-h-40 overflow-auto break-words font-mono text-xs leading-relaxed">{renderedValues}</p>
      </SchemaDisclosure>
    </div>
  );
}

function FieldLabel({ name, value, required }: {
  name: string;
  value: Schema;
  required?: boolean;
}) {
  return (
    <span className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
      <code className="break-all text-xs font-semibold text-foreground">{name}</code>
      <span className="break-all text-xs font-normal text-muted-foreground">{schemaType(value)}</span>
      {required && <span className="text-xs font-medium text-primary">Required</span>}
    </span>
  );
}

function hasStructure(schema: SchemaObject) {
  return Boolean(schema.$ref || schema.properties || schema.items || schema.anyOf || schema.oneOf || schema.allOf ||
    typeof schema.additionalProperties === "object");
}

export function OpenApiSchema({ schema, components, seen = [] }: {
  schema: Schema;
  components: Components;
  seen?: string[];
}) {
  if (typeof schema === "boolean") return <p className="text-sm text-muted-foreground">{schemaType(schema)}</p>;
  const name = schema.$ref && componentName(schema.$ref);
  const reference = name && components[name];
  if (name && reference === undefined) {
    return <p className="break-all font-mono text-xs text-muted-foreground">{schema.$ref}</p>;
  }
  if (name && seen.includes(name)) {
    return <p className="break-all font-mono text-xs text-muted-foreground">Recursive reference to {name}</p>;
  }

  const resolved = typeof reference === "object" ? { ...reference, ...schema } : schema;
  const nextSeen = name ? [...seen, name] : seen;
  const variants = resolved.anyOf ?? resolved.oneOf ?? resolved.allOf;
  const properties = Object.entries(resolved.properties ?? {});

  return (
    <div className="min-w-0 space-y-2">
      {resolved.description && (
        <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
          {resolved.description}
        </p>
      )}
      {resolved["x-showpass-field-scopes"]?.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Field scopes <code className="break-all text-foreground">{resolved["x-showpass-field-scopes"].join(", ")}</code>
        </p>
      )}
      {resolved.readOnly && <p className="text-xs text-muted-foreground">Read only</p>}
      {resolved.writeOnly && <p className="text-xs text-muted-foreground">Write only</p>}
      <SchemaConstraints schema={resolved} />
      {variants && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {resolved.allOf ? "Combined schemas" : "Possible shapes"}
          </p>
          {variants.map((variant, index) => (
            <SchemaDisclosure key={index} title={schemaType(variant)}>
              <OpenApiSchema schema={variant} components={components} seen={nextSeen} />
            </SchemaDisclosure>
          ))}
        </div>
      )}
      {properties.length > 0 && (
        <ul className="space-y-2">
          {properties.map(([field, value]) => {
            const label = <FieldLabel name={field} value={value} required={resolved.required?.includes(field)} />;
            return (
              <li key={field} className="min-w-0">
                {typeof value === "object" && hasStructure(value) ? (
                  <SchemaDisclosure title={label}>
                    <OpenApiSchema schema={value} components={components} seen={nextSeen} />
                  </SchemaDisclosure>
                ) : (
                  <div className="rounded-md border border-border px-3 py-2">
                    {label}
                    {typeof value === "object" && (
                      <OpenApiSchema schema={value} components={components} seen={nextSeen} />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {resolved.items && (
        <SchemaDisclosure title={`Array items · ${schemaType(resolved.items)}`}>
          <OpenApiSchema schema={resolved.items} components={components} seen={nextSeen} />
        </SchemaDisclosure>
      )}
      {typeof resolved.additionalProperties === "object" && (
        <SchemaDisclosure title="Additional properties">
          <OpenApiSchema schema={resolved.additionalProperties} components={components} seen={nextSeen} />
        </SchemaDisclosure>
      )}
      {resolved.additionalProperties === false && properties.length === 0 && (
        <p className="text-sm text-muted-foreground">Empty object</p>
      )}
    </div>
  );
}
