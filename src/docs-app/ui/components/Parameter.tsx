
import React from 'react';
import { Badge } from "@/shared/components/badge.tsx";
import { cn } from "@/shared/lib/utils.ts";

interface ParameterProps {
  name: string;
  type: string;
  required?: boolean;
  description: string;
  defaultValue?: string;
  example?: string;
  className?: string;
}

const Parameter = ({
  name,
  type,
  required = false,
  description,
  defaultValue,
  example,
  className,
}: ParameterProps) => {
  return (
    <div className={cn("mb-4 border-b pb-4", className)}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <code className="font-semibold">{name}</code>
        <Badge variant="outline" className="font-mono text-xs">
          {type}
        </Badge>
        {required ? (
          <Badge className="bg-red-500 text-white hover:bg-red-600">Required</Badge>
        ) : (
          <Badge variant="secondary">Optional</Badge>
        )}
      </div>
      <p className="text-sm mt-1">{description}</p>
      {defaultValue && (
        <div className="text-sm mt-1">
          <span className="font-medium">Default:</span> <code>{defaultValue}</code>
        </div>
      )}
      {example && (
        <div className="text-sm mt-1">
          <span className="font-medium">Example:</span> <code>{example}</code>
        </div>
      )}
    </div>
  );
};

export default Parameter;
