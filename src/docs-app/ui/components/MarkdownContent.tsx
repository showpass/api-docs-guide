
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "./CodeBlock";
import ParameterTable from "./ParameterTable";
import { remarkParameterTable } from "../utils/parameterTablePlugin";
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
      // Check if this paragraph contains a parameter table
      const childStr = String(children);
      if (childStr.includes('<!-- PARAMETER_TABLE_START -->') && childStr.includes('<!-- PARAMETER_TABLE_END -->')) {
        const data = parseParameterTable(childStr);
        return <ParameterTable data={data} />;
      }
      return <p className="my-4 text-slate-700" {...props}>{children}</p>;
    },
    table: ({ node, ...props }) => <table className="w-full text-sm border-collapse mt-0" {...props} />
  };

  // Import parseParameterTable directly in the component
  const parseParameterTable = (content: string): any[] => {
    // Find content between PARAMETER_TABLE_START and PARAMETER_TABLE_END
    const tableRegex = /<!-- PARAMETER_TABLE_START -->([\s\S]*?)<!-- PARAMETER_TABLE_END -->/g;
    const tableMatches = [...content.matchAll(tableRegex)];
    
    if (!tableMatches || tableMatches.length === 0) return [];
    
    // Get the first table content and split into lines
    const tableContent = tableMatches[0][1].trim();
    const lines = tableContent.split('\n').filter(line => line.trim() !== '');
    
    // Remove header and separator lines (first two lines)
    const dataLines = lines.slice(2);
    
    // Parse each line into a parameter row
    return dataLines.map(line => {
      const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
      
      if (cells.length >= 4) {
        return {
          parameter: cells[0],
          type: cells[1],
          status: cells[2],
          description: cells[3]
        };
      }
      
      // Fallback for malformed rows or tab-separated content
      if (line.includes('\t')) {
        const tabCells = line.split('\t').map(cell => cell.trim());
        return {
          parameter: tabCells[0] || '',
          type: tabCells[1] || '',
          status: tabCells[2] || '',
          description: tabCells[3] || ''
        };
      }
      
      // Final fallback
      return {
        parameter: '',
        type: '',
        status: '',
        description: 'Malformed table row'
      };
    });
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
