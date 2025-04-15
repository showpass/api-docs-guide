
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/docs-app/ui/components/content/CodeBlock.tsx";
import type { Components } from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

// Helper function to create ID-safe slugs from headings
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Define components mapping for ReactMarkdown
  const components: Components = {
    code: ({ node, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      
      // Handle inline code
      if (!match) {
        return (
          <code className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-sm" {...props}>
            {children}
          </code>
        );
      }
      
      // Handle code blocks
      return (
        <CodeBlock
          code={String(children).replace(/\n$/, '')}
          language={match[1]}
        />
      );
    },
    // Custom components for markdown elements
    h1: ({ node, children, ...props }) => {
      const text = children.toString();
      const id = slugify(text);
      return <h1 id={id} className="text-3xl font-bold mt-8 mb-4 text-slate-900 scroll-mt-24" {...props}>{children}</h1>;
    },
    h2: ({ node, children, ...props }) => {
      const text = children.toString();
      const id = slugify(text);
      return <h2 id={id} className="text-2xl font-bold mt-8 mb-3 text-slate-900 scroll-mt-24" {...props}>{children}</h2>;
    },
    h3: ({ node, children, ...props }) => {
      const text = children.toString();
      const id = slugify(text);
      return <h3 id={id} className="text-xl font-bold mt-6 mb-3 text-slate-900 scroll-mt-24" {...props}>{children}</h3>;
    },
    h4: ({ node, children, ...props }) => {
      const text = children.toString();
      const id = slugify(text);
      return <h4 id={id} className="text-lg font-bold mt-6 mb-2 text-slate-900 scroll-mt-24" {...props}>{children}</h4>;
    },
    a: ({ node, ...props }) => <a className="text-slate-700 hover:text-slate-900 underline" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 my-4" {...props} />,
    ol: ({ node, ...props }) => <ol className="list-decimal pl-6 my-4" {...props} />,
    p: ({ node, children, ...props }) => {
      return <p className="my-4 text-slate-700" {...props}>{children}</p>;
    },
    table: ({ node, ...props }) => <table className="w-full text-sm border-collapse mt-0" {...props} />
  };

  return (
    <div className="prose prose-slate max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
