import React from "react";
import { Highlight } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";
import { useClipboard } from "../../../../shared/hooks/use-clipboard";
import { cn } from "@/shared/lib/utils.ts";

interface CodeBlockProps {
  code: string;
  colorful?: boolean;
  language: string;
}

const getJsonTokenClass = (types: string[]) => {
  if (types.includes("property")) return "!text-cyan-700 dark:!text-cyan-300";
  if (types.includes("string")) return "!text-amber-700 dark:!text-amber-300";
  if (types.includes("number")) return "!text-violet-700 dark:!text-violet-300";
  if (types.includes("boolean") || types.includes("null")) {
    return "!text-rose-700 dark:!text-rose-300";
  }
  if (types.includes("punctuation")) return "!text-slate-500 dark:!text-slate-400";

  return "";
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, colorful = false }) => {
  const { copy, isCopied } = useClipboard();

  const copyToClipboard = () => {
    copy(code);
  };

  // Use a minimal theme - our CSS will handle all the colors
  const minimalTheme = {
    plain: {},
    styles: [],
  };


  return (
    <div className={cn("relative group rounded-md overflow-hidden my-4")}>
      <Highlight
        code={code}
        language={language || "text"}
        theme={minimalTheme}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className="relative">
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-2 p-2 rounded-md bg-background/90 hover:bg-background border border-border shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition-all z-10"
              aria-label="Copy code"
              title={isCopied ? "Copied!" : "Copy to clipboard"}
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-[hsl(var(--success))]" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
            <pre
              className="overflow-x-auto relative cursor-pointer m-0 bg-[hsl(var(--prose-pre-bg))]"
              style={{
                margin: 0,
                padding: "1rem",
              }}
              onClick={copyToClipboard}
            >
              <code className={`language-${language}`}>
                {tokens.map((line, i) => (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className="table-row"
                  >
                    <span className="table-cell pr-4 text-right select-none opacity-50">
                      {i + 1}
                    </span>
                    <span className="table-cell">
                      {line.map((token, key) => {
                        const tokenProps = getTokenProps({ token });

                        return (
                          <span
                            key={key}
                            {...tokenProps}
                            className={cn(
                              tokenProps.className,
                              colorful && getJsonTokenClass(token.types),
                            )}
                          />
                        );
                      })}
                    </span>
                  </div>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
