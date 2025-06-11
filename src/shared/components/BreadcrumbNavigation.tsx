import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const sectionLabels: Record<string, string> = {
  api: 'API Reference',
  sdk: 'JavaScript SDK',
  wordpress: 'WordPress Plugin',
  webhooks: 'Webhooks',
  'google-tag-manager': 'Google Tag Manager',
  'widget-playground': 'Widget Playground'
};

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return null; // Don't show breadcrumbs on homepage
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ];

  // Build breadcrumb items from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    
    if (index === 0) {
      // First segment is usually the section - don't make it a link
      const sectionLabel = sectionLabels[segment] || segment;
      breadcrumbItems.push({
        label: sectionLabel,
        href: undefined // Section headers are not clickable
      });
    } else {
      // For subsequent segments, try to create a readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/^\d+\s*/, ''); // Remove leading numbers like "01 "
      
      breadcrumbItems.push({
        label: label || segment,
        href: undefined // Only the final page should not be a link (handled below)
      });
    }
  });

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={index} style={{ display: 'contents' }}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink asChild>
                  <Link to={item.href} className="flex items-center gap-1">
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="flex items-center gap-1">
                  {index === 0 && <Home className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbItems.length - 1 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation; 