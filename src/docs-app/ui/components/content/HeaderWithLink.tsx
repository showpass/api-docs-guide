import React, { useState } from "react";
import { Link, Check } from "lucide-react";
import { cn } from "@/shared/lib/utils.ts";

interface HeaderWithLinkProps {
  id: string;
  level: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
}

const HeaderWithLink: React.FC<HeaderWithLinkProps> = ({
  id,
  level,
  children,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const baseClasses = "group relative";
  const levelClasses = {
    1: "text-3xl font-bold mt-12 mb-2 scroll-mt-24 text-foreground leading-tight",
    2: "text-2xl font-semibold mt-6 mb-4 scroll-mt-24 text-foreground leading-snug",
    3: "text-xl font-semibold mt-8 mb-3 scroll-mt-24 text-foreground leading-snug",
    4: "text-lg font-medium mt-6 mb-2 scroll-mt-24 text-foreground",
  };

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={cn(baseClasses, levelClasses[level], className)}>
      <span className="flex items-center gap-2">
        {children}
        <button
          onClick={handleCopyLink}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-muted"
          title="Copy link to this section"
          aria-label="Copy link to this section"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Link className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          )}
        </button>
      </span>
    </Tag>
  );
};

export default HeaderWithLink;
