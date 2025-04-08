
import React from 'react';

interface TableOfContentsProps {
  items: {
    title: string;
    href: string;
  }[];
  activeItem?: string;
}

const TableOfContents = ({ items, activeItem }: TableOfContentsProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={`block text-sm ${
            activeItem === item.href
              ? "text-primary font-medium"
              : "text-muted-foreground hover:text-primary"
          } py-1 transition-colors`}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};

export default TableOfContents;
