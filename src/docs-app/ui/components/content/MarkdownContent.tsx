import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import type { Components } from "react-markdown";
import type { Root, Element as MdElement, Text as MdText } from "hast"; // Import HAST types
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table.tsx";
import { cn } from "@/shared/lib/utils.ts";
import { Separator } from "@/shared/components/separator.tsx";

interface MarkdownContentProps {
  content: string;
}

/**
 * Extracts plain text from React children (handles nested elements like code tags)
 */
const extractTextFromChildren = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join('');
  }
  if (React.isValidElement(children) && children.props.children) {
    return extractTextFromChildren(children.props.children);
  }
  return '';
};

/**
 * Generates a URL-safe ID from heading text for anchor links
 */
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Define components mapping for ReactMarkdown
  const components: Components = {
    pre: (props) => {
      const { node, children, ...rest } = props;
      const preNode = node as MdElement; // Assert node as HAST Element

      if (
        preNode &&
        preNode.children &&
        preNode.children.length > 0 &&
        preNode.children[0].type === "element" &&
        (preNode.children[0] as MdElement).tagName === "code" &&
        (preNode.children[0] as MdElement).properties &&
        Array.isArray(
          (preNode.children[0] as MdElement).properties?.className
        ) &&
        (
          (preNode.children[0] as MdElement).properties?.className as string[]
        ).some((cn) => typeof cn === "string" && cn.startsWith("language-"))
      ) {
        return <>{children}</>;
      }
      return (
        <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4" {...rest}>
          {children}
        </pre>
      );
    },
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");

      if (!match) {
        // Inline code
        return (
          <code
            className={cn(
              "px-1.5 py-0.5 rounded font-mono text-sm", // Base styles
              "bg-slate-100 text-slate-800", // Light mode styles
              "dark:bg-[hsl(var(--prose-code-bg))] dark:text-[hsl(var(--prose-code-fg))]" // Dark mode styles
            )}
            {...props}
          >
            {children}
          </code>
        );
      }

      // Code block (will be rendered by CodeBlock component)
      return (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          language={match[1]}
        />
      );
    },
    // Custom components for markdown elements
    h1: ({ node, children, ...props }) => {
      const text = extractTextFromChildren(children);
      const id = generateHeadingId(text);
      return (
        <>
          <h1
            id={id}
            className="text-3xl font-bold mt-12 mb-2 scroll-mt-24 text-foreground leading-tight"
            {...props}
          >
            {children}
          </h1>
          <Separator className="mb-2 opacity-60" />
        </>
      );
    },
    h2: ({ node, children, ...props }) => {
      const text = extractTextFromChildren(children);
      const id = generateHeadingId(text);
      return (
        <h2
          id={id}
          className="text-2xl font-semibold mt-6 mb-4 scroll-mt-24 text-foreground leading-snug"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      const text = extractTextFromChildren(children);
      const id = generateHeadingId(text);
      return (
        <h3
          id={id}
          className="text-xl font-semibold mt-8 mb-3 scroll-mt-24 text-foreground leading-snug"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      const text = extractTextFromChildren(children);
      const id = generateHeadingId(text);
      return (
        <h4
          id={id}
          className="text-lg font-medium mt-6 mb-2 scroll-mt-24 text-foreground"
          {...props}
        >
          {children}
        </h4>
      );
    },
    a: ({ node, ...props }) => (
      <a 
        className="text-primary underline decoration-primary/30 hover:decoration-primary transition-colors font-medium" 
        {...props} 
      />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 my-6 space-y-2" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 my-6 space-y-2" {...props} />
    ),
    li: ({ node, children, ...props }) => (
      <li className="text-foreground/90 leading-relaxed" {...props}>
        {children}
      </li>
    ),
    p: ({ node, children, ...props }) => {
      return (
        <p className="my-6 text-foreground/90 leading-relaxed text-[15px]" {...props}>
          {children}
        </p>
      );
    },
    blockquote: ({ node, children, ...props }) => (
      <blockquote 
        className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground bg-muted/30 py-3 rounded-r-lg [&>p]:my-2" 
        {...props}
      >
        {children}
      </blockquote>
    ),
    strong: ({ node, children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    // Enhanced table components
    table: ({ node, ...props }) => (
      <div className="my-6 rounded-md border overflow-hidden">
        <Table {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <TableHeader {...props} />,
    tbody: ({ node, ...props }) => <TableBody {...props} />,
    tr: ({ node, ...props }) => <TableRow {...props} />,
    th: ({ node, ...props }) => <TableHead {...props} />,
    td: (props) => {
      const { node, children, ...rest } = props;
      const childArray = React.Children.toArray(children);
      const childText = childArray
        .map((child) => {
          if (typeof child === "string") return child;
          if (
            React.isValidElement(child) &&
            child.props &&
            typeof child.props.children === "string"
          ) {
            return child.props.children;
          }
          return "";
        })
        .join("");

      if (childText.includes("http")) {
        return (
          <TableCell {...rest}>
            {childText.split(" ").map((part, i) => {
              if (part.startsWith("http")) {
                return (
                  <React.Fragment key={i}>
                    {i > 0 && " "}
                    <a href={part} className="underline break-all">
                      {part}
                    </a>
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={i}>
                  {i > 0 && " "}
                  {part}
                </React.Fragment>
              );
            })}
          </TableCell>
        );
      }
      return <TableCell {...rest}>{children}</TableCell>;
    },
  };

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
