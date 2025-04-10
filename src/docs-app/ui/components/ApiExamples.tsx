import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/tabs";
import { Card } from "@/shared/components/card";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ApiExamplesData } from "@/docs-app/data/types.ts";

interface ApiExamplesProps extends ApiExamplesData {}

const ApiExamples: React.FC<ApiExamplesProps> = ({
  endpoint,
  method,
  description,
  examples,
  response,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const copyToClipboard = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(language);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyResponseToClipboard = () => {
    const responseText = JSON.stringify(response.body, null, 2);
    navigator.clipboard.writeText(responseText);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const methodColors = {
    GET: "bg-blue-500",
    POST: "bg-green-500",
    PUT: "bg-amber-500",
    PATCH: "bg-orange-500",
    DELETE: "bg-red-500",
  };

  // Get the status code from the standardized response format
  const statusCode = response.status;
  // Get the response text as JSON string
  const responseText = JSON.stringify(response.body, null, 2);

  return (
    <div className="space-y-8 w-full">
      <div className="border-b pb-4">
        <div className="flex items-center gap-3 mb-2">
          <span 
            className={cn(
              "text-xs font-mono px-2 py-1 rounded text-white uppercase font-bold",
              methodColors[method]
            )}
          >
            {method}
          </span>
          <code className="text-sm font-mono bg-muted p-1.5 rounded-md">{endpoint}</code>
        </div>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="space-y-4">
        <div className="text-sm font-medium flex items-center border-b pb-2">
          <span className="text-primary mr-2">⚡</span> LANGUAGE
        </div>
        <Tabs defaultValue="curl" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="curl" className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span>cURL</span>
            </TabsTrigger>
            <TabsTrigger value="python" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.371 0 5.125 2.611 5.125 2.611v5.318h6.964v.857H3.354S0 8.737 0 15.429c0 6.691 2.931 6.458 2.931 6.458h4.381v-3.108s-.233-3.109 3.062-3.109h5.289s2.969.049 2.969-2.865V4.692S19.287 0 12 0zM8.857 1.851c.693 0 1.25.557 1.25 1.25a1.25 1.25 0 0 1-2.5 0c0-.693.557-1.25 1.25-1.25z" />
                <path fill="currentColor" d="M12 24c6.629 0 6.875-2.611 6.875-2.611v-5.318H11.91v-.857h8.736S24 15.263 24 8.571c0-6.691-2.931-6.458-2.931-6.458h-4.381v3.108s.233 3.109-3.062 3.109H8.338s-2.969-.049-2.969 2.865v8.114S4.713 24 12 24zm3.143-1.851c-.693 0-1.25-.557-1.25-1.25a1.25 1.25 0 0 1 2.5 0c0 .693-.557 1.25-1.25 1.25z" />
              </svg>
              <span>Python</span>
            </TabsTrigger>
            <TabsTrigger value="node" className="flex items-center gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm-1.584 17.375a.396.396 0 0 1-.215-.071l-.688-.409c-.103-.058-.052-.078-.019-.09.137-.048.165-.058.312-.143.015-.009.035-.006.05.004l.528.314a.067.067 0 0 0 .064 0l2.058-1.188a.068.068 0 0 0 .032-.058v-2.375c0-.024-.013-.046-.033-.057l-2.057-1.187a.067.067 0 0 0-.064 0l-2.057 1.187a.067.067 0 0 0-.033.057v2.375c0 .023.013.045.031.056l.563.326c.307.154.495-.028.495-.21v-2.344c0-.033.027-.06.06-.06h.261c.033 0 .06.027.06.06v2.344c0 .41-.223.647-.612.647-.12 0-.214 0-.476-.13l-.54-.31a.425.425 0 0 1-.205-.364v-2.375c0-.15.08-.29.205-.365l2.056-1.186a.423.423 0 0 1 .41 0l2.056 1.186a.422.422 0 0 1 .206.365v2.375a.425.425 0 0 1-.206.365l-2.056 1.185a.406.406 0 0 1-.205.073z" />
                <path fill="currentColor" d="M11.063 14.478c-.9 0-1.088-.414-1.088-.76 0-.033.027-.061.06-.061h.266c.03 0 .055.022.06.051.04.276.16.415.702.415.432 0 .615-.098.615-.326 0-.131-.052-.229-.724-.295-.562-.055-.909-.179-.909-.628 0-.414.349-.66.933-.66.657 0 .981.228.1022.717.002.017-.005.033-.018.046s-.03.02-.047.02h-.268a.062.062 0 0 1-.058-.047c-.064-.285-.221-.377-.611-.377-.45 0-.503.157-.503.275 0 .143.062.185.702.264.63.079.932.19.932.657-.001.448-.373.713-1.022.713z" />
              </svg>
              <span>Node.js</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="curl" className="relative mt-4">
            <Card className="bg-gray-900 text-gray-200 p-0 overflow-hidden rounded-md border-2 border-gray-800">
              <div className="p-4 font-mono text-sm whitespace-pre overflow-x-auto max-w-full">
                {examples.curl}
              </div>
              <button
                  onClick={() => copyToClipboard(examples.curl, "curl")}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                  aria-label="Copy code"
              >
                {copiedCode === "curl" ? (
                    <Check className="h-4 w-4 text-green-500"/>
                ) : (
                    <Copy className="h-4 w-4 text-gray-400"/>
                )}
              </button>
            </Card>
          </TabsContent>

          <TabsContent value="python" className="relative mt-4">
            <Card className="bg-gray-900 text-gray-200 p-0 overflow-hidden rounded-md border-2 border-gray-800">
              <div className="p-4 font-mono text-sm whitespace-pre overflow-x-auto">
                {examples.python}
              </div>
              <button
                onClick={() => copyToClipboard(examples.python, "python")}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Copy code"
              >
                {copiedCode === "python" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </Card>
          </TabsContent>

          <TabsContent value="node" className="relative mt-4">
            <Card className="bg-gray-900 text-gray-200 p-0 overflow-hidden rounded-md border-2 border-gray-800">
              <div className="p-4 font-mono text-sm whitespace-pre overflow-x-auto">
                {examples.node}
              </div>
              <button
                onClick={() => copyToClipboard(examples.node, "node")}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
                aria-label="Copy code"
              >
                {copiedCode === "node" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-4 mt-10">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="text-sm font-medium flex items-center">
            <span className="text-green-500 mr-2">✓</span> RESPONSE
          </div>
          <div className="text-xs font-mono px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            {statusCode}
          </div>
        </div>
        <Card className="relative bg-gray-900 text-gray-200 p-0 overflow-hidden rounded-md border-2 border-gray-800">
          <div className="p-4 font-mono text-sm whitespace-pre overflow-x-auto">
            {responseText}
          </div>
          <button
            onClick={copyResponseToClipboard}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="Copy response"
          >
            {copiedResponse ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default ApiExamples;
