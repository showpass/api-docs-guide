
import React, { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-md overflow-hidden my-4">
      <Highlight 
        code={code} 
        language={language || "text"} // Fallback to text if language is not provided
        theme={themes.github}  // Use GitHub theme (light) for all languages
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <div className="relative">
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted/70 transition-colors focus:outline-none focus:ring-2 focus:ring-primary opacity-0 group-hover:opacity-100 z-10"
              aria-label="Copy code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <pre 
              className="overflow-x-auto relative cursor-pointer"
              style={{ 
                ...style,
                margin: 0,
                padding: "1rem",
                background: "rgb(246, 248, 250)"  // Light background for all code blocks
              }}
              onClick={copyToClipboard}
            >
              <code className={className}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="inline-block w-6 mr-4 text-right select-none opacity-50 text-gray-400">
                      {i + 1}
                    </span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
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
