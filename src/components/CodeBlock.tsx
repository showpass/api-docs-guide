
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language?: string;
  value: string;
  className?: string;
}

const CodeBlock = ({ language, value, className }: CodeBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-4 top-4 h-6 w-6 text-muted-foreground"
        onClick={onCopy}
      >
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="mb-0 mt-0 overflow-x-auto bg-muted p-4">
        <code className="relative font-mono text-sm">{value}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
