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

interface MarkdownContentProps {
  content: string;
}

// Helper function to create ID-safe slugs from headings
const slugify = (text: string): string => {
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
        return (
          <code
            className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-sm"
            {...props}
          >
            {children}
          </code>
        );
      }

      return (
        <CodeBlock
          code={String(children).replace(/\n$/, "")}
          language={match[1]}
        />
      );
    },
    // Custom components for markdown elements
    h1: ({ node, children, ...props }) => {
      const text = children ? children.toString() : "";
      const id = slugify(text);
      return (
        <h1
          id={id}
          className="text-3xl font-bold mt-8 mb-4 text-slate-900 scroll-mt-24"
          {...props}
        >
          {children}
        </h1>
      );
    },
    h2: ({ node, children, ...props }) => {
      const text = children ? children.toString() : "";
      const id = slugify(text);
      return (
        <h2
          id={id}
          className="text-2xl font-bold mt-8 mb-3 text-slate-900 scroll-mt-24"
          {...props}
        >
          {children}
        </h2>
      );
    },
    h3: ({ node, children, ...props }) => {
      const text = children ? children.toString() : "";
      const id = slugify(text);
      return (
        <h3
          id={id}
          className="text-xl font-bold mt-6 mb-3 text-slate-900 scroll-mt-24"
          {...props}
        >
          {children}
        </h3>
      );
    },
    h4: ({ node, children, ...props }) => {
      const text = children ? children.toString() : "";
      const id = slugify(text);
      return (
        <h4
          id={id}
          className="text-lg font-bold mt-6 mb-2 text-slate-900 scroll-mt-24"
          {...props}
        >
          {children}
        </h4>
      );
    },
    a: ({ node, ...props }) => (
      <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc pl-6 my-4" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal pl-6 my-4" {...props} />
    ),
    p: ({ node, children, ...props }) => {
      return (
        <p className="my-4 text-slate-700" {...props}>
          {children}
        </p>
      );
    },
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
          )
            return child.props.children;
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
                    <a
                      href={part}
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
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
    <div className="prose prose-slate max-w-none">
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
