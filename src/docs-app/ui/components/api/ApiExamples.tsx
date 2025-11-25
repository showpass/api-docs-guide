import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/tabs.tsx";
import { Card } from "@/shared/components/card.tsx";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";
import { ApiExamplesData } from "@/docs-app/data/types.ts";
import { Highlight } from "prism-react-renderer";
import { useClipboard } from "@/shared/hooks/use-clipboard.ts";

type ApiExamplesProps = ApiExamplesData;

const ApiExamples: React.FC<ApiExamplesProps> = ({
  endpoint,
  method,
  description,
  examples,
  response,
}) => {
  const { copy: copyCode, isCopied: isCodeCopied } = useClipboard();
  const { copy: copyResponse, isCopied: isResponseCopied } = useClipboard();
  
  // Use a minimal theme - our CSS will handle all the colors
  const minimalTheme = {
    plain: {},
    styles: [],
  };

  // Get the status code from the standardized response format
  const statusCode = response.status;
  // Get the response text as a JSON string
  const responseText = JSON.stringify(response.body, null, 2);

  return (
    <div className="space-y-6 w-full">
      <div className="border-b border-border/50 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-md border font-medium",
              `api-badge-${method}`
            )}
          >
            {method}
          </span>
          <code className="text-xs font-mono bg-muted/50 px-2 py-0.5 rounded text-muted-foreground">
            {endpoint}
          </code>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground/80">{description}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="text-xs font-medium text-muted-foreground/70 flex items-center border-b border-border/30 pb-1.5">
          <Terminal className="h-3 w-3 mr-1.5" />
          Request Examples
        </div>
        <Tabs defaultValue="python" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-10 bg-background/50 backdrop-blur-sm border border-border/50 p-1">
            <TabsTrigger 
              value="python" 
              className="flex items-center justify-center gap-2 text-xs font-medium py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted/50"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0C5.371 0 5.125 2.611 5.125 2.611v5.318h6.964v.857H3.354S0 8.737 0 15.429c0 6.691 2.931 6.458 2.931 6.458h4.381v-3.108s-.233-3.109 3.062-3.109h5.289s2.969.049 2.969-2.865V4.692S19.287 0 12 0zM8.857 1.851c.693 0 1.25.557 1.25 1.25a1.25 1.25 0 0 1-2.5 0c0-.693.557-1.25 1.25-1.25z"
                />
                <path
                  fill="currentColor"
                  d="M12 24c6.629 0 6.875-2.611 6.875-2.611v-5.318H11.91v-.857h8.736S24 15.263 24 8.571c0-6.691-2.931-6.458-2.931-6.458h-4.381v3.108s.233 3.109-3.062 3.109H8.338s-2.969-.049-2.969 2.865v8.114S4.713 24 12 24zm3.143-1.851c-.693 0-1.25-.557-1.25-1.25a1.25 1.25 0 0 1 2.5 0c0 .693-.557 1.25-1.25 1.25z"
                />
              </svg>
              <span>Python</span>
            </TabsTrigger>
            <TabsTrigger 
              value="node" 
              className="flex items-center justify-center gap-2 text-xs font-medium py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted/50"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm-1.584 17.375a.396.396 0 0 1-.215-.071l-.688-.409c-.103-.058-.052-.078-.019-.09.137-.048.165-.058.312-.143.015-.009.035-.006.05.004l.528.314a.067.067 0 0 0 .064 0l2.058-1.188a.068.068 0 0 0 .032-.058v-2.375c0-.024-.013-.046-.033-.057l-2.057-1.187a.067.067 0 0 0-.064 0l-2.057 1.187a.067.067 0 0 0-.033.057v2.375c0 .023.013.045.031.056l.563.326c.307.154.495-.028.495-.21v-2.344c0-.033.027-.06.06-.06h.261c.033 0 .06.027.06.06v2.344c0 .41-.223.647-.612.647-.12 0-.214 0-.476-.13l-.54-.31a.425.425 0 0 1-.205-.364v-2.375c0-.15.08-.29.205-.365l2.056-1.186a.423.423 0 0 1 .41 0l2.056 1.186a.422.422 0 0 1 .206.365v2.375a.425.425 0 0 1-.206.365l-2.056 1.185a.406.406 0 0 1-.205.073z"
                />
                <path
                  fill="currentColor"
                  d="M11.063 14.478c-.9 0-1.088-.414-1.088-.76 0-.033.027-.061.06-.061h.266c.03 0 .055.022.06.051.04.276.16.415.702.415.432 0 .615-.098.615-.326 0-.131-.052-.229-.724-.295-.562-.055-.909-.179-.909-.628 0-.414.349-.66.933-.66.657 0 .981.228.1022.717.002.017-.005.033-.018.046s-.03.02-.047.02h-.268a.062.062 0 0 1-.058-.047c-.064-.285-.221-.377-.611-.377-.45 0-.503.157-.503.275 0 .143.062.185.702.264.63.079.932.19.932.657-.001.448-.373.713-1.022.713z"
                />
              </svg>
              <span>Node.js</span>
            </TabsTrigger>
            <TabsTrigger 
              value="curl" 
              className="flex items-center justify-center gap-2 text-xs font-medium py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200 hover:bg-muted/50"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>cURL</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="relative mt-3">
            <Card className="bg-muted/20 p-0 overflow-hidden rounded border border-border/50">
              <Highlight
                code={examples.python}
                language="python"
                theme={minimalTheme}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <div className="relative">
                    <pre
                      className="p-3 font-mono text-xs whitespace-pre overflow-x-auto bg-[hsl(var(--prose-pre-bg))]"
                      style={{
                        margin: 0,
                      }}
                    >
                      <code className={className}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyCode(examples.python)}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 opacity-70 hover:opacity-100"
                      aria-label="Copy code"
                    >
                      {isCodeCopied ? (
                        <Check className="h-3 w-3 text-[hsl(var(--success))]" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}
              </Highlight>
            </Card>
          </TabsContent>

          <TabsContent value="node" className="relative mt-3">
            <Card className="bg-muted/20 p-0 overflow-hidden rounded border border-border/50">
              <Highlight
                code={examples.node}
                language="javascript"
                theme={minimalTheme}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <div className="relative">
                    <pre
                      className="p-3 font-mono text-xs whitespace-pre overflow-x-auto bg-[hsl(var(--prose-pre-bg))]"
                      style={{
                        margin: 0,
                      }}
                    >
                      <code className={className}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyCode(examples.node)}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 opacity-70 hover:opacity-100"
                      aria-label="Copy code"
                    >
                      {isCodeCopied ? (
                        <Check className="h-3 w-3 text-[hsl(var(--success))]" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}
              </Highlight>
            </Card>
          </TabsContent>

          <TabsContent value="curl" className="relative mt-3">
            <Card className="bg-muted/20 p-0 overflow-hidden rounded border border-border/50">
              <Highlight
                code={examples.curl}
                language="bash"
                theme={minimalTheme}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }) => (
                  <div className="relative">
                    <pre
                      className="p-3 font-mono text-xs whitespace-pre overflow-x-auto max-w-full bg-[hsl(var(--prose-pre-bg))]"
                      style={{
                        margin: 0,
                      }}
                    >
                      <code className={className}>
                        {tokens.map((line, i) => (
                          <div key={i} {...getLineProps({ line })}>
                            {line.map((token, key) => (
                              <span key={key} {...getTokenProps({ token })} />
                            ))}
                          </div>
                        ))}
                      </code>
                    </pre>
                    <button
                      onClick={() => copyCode(examples.curl)}
                      className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 opacity-70 hover:opacity-100"
                      aria-label="Copy code"
                    >
                      {isCodeCopied ? (
                        <Check className="h-3 w-3 text-[hsl(var(--success))]" />
                      ) : (
                        <Copy className="h-3 w-3 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                )}
              </Highlight>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3 mt-8">
        <div className="flex items-center justify-between border-b border-border/30 pb-1.5">
          <div className="text-xs font-medium text-muted-foreground/70 flex items-center">
            <Check className="h-3 w-3 mr-1.5 text-[hsl(var(--success))]" />
            Response
          </div>
          <div className="text-xs font-mono px-1.5 py-0.5 rounded bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--success)/0.6)]"></span>
            {statusCode}
          </div>
        </div>
        <Card className="relative bg-muted/20 p-0 overflow-hidden rounded border border-border/50">
          <Highlight
            code={responseText}
            language="javascript"
            theme={minimalTheme}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <div className="relative">
                <pre
                  className="p-3 font-mono text-xs whitespace-pre overflow-x-auto bg-[hsl(var(--prose-pre-bg))]"
                  style={{
                    margin: 0,
                  }}
                >
                  <code className={className}>
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
                <button
                  onClick={() => copyResponse(responseText)}
                  className="absolute top-1.5 right-1.5 p-1 rounded bg-background/80 hover:bg-background border border-border/50 transition-all duration-200 opacity-70 hover:opacity-100"
                  aria-label="Copy response"
                >
                  {isResponseCopied ? (
                    <Check className="h-3 w-3 text-[hsl(var(--success))]" />
                  ) : (
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            )}
          </Highlight>
        </Card>
      </div>
    </div>
  );
};

export default ApiExamples;
