import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";
import { useClipboard } from "../../../../shared/hooks/use-clipboard";
import { useTheme } from "next-themes";
import { cn } from "@/shared/lib/utils.ts";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const { copy, isCopied } = useClipboard();
  const { resolvedTheme } = useTheme();

  const copyToClipboard = () => {
    copy(code);
  };

  const currentPrismTheme =
    resolvedTheme === "light" ? themes.jettwaveLight : themes.jettwaveDark;

  // No preBackgroundColor variable needed here, we rely on CSS override for .dark/.ocean .prose pre


  return (
    <div className={cn("relative group rounded-md overflow-hidden my-4")}>
      <Highlight
        code={code}
        language={language || "text"}
        theme={currentPrismTheme}
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
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              )}
            </button>
            <pre
              className="overflow-x-auto relative cursor-pointer m-0"
              style={{
                ...style, // This will include prism theme's default background and text colors
                margin: 0,
                padding: "1rem",
                // NO explicit backgroundColor here, relying on CSS to override prism theme's default bg
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
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
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
