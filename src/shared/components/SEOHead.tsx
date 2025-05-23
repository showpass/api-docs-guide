import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEOHead = ({ 
  title = "Showpass Developer Documentation", 
  description = "Comprehensive developer documentation for Showpass API, SDK, WordPress Plugin, Webhooks, and Google Tag Manager integration.",
  keywords = "showpass, api, sdk, documentation, webhooks, wordpress, google tag manager, event management, ticket sales",
  ogImage = "https://dbx9avwd2hnkj.cloudfront.net/static/assets/img/showpass-og.jpg",
  canonical
}: SEOHeadProps) => {
  const location = useLocation();
  const currentUrl = `https://dev.showpass.com${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Showpass Developer Documentation', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:site', '@showpassevents');

    // Canonical URL
    updateLinkTag('canonical', canonicalUrl);

    // JSON-LD structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": title,
      "description": description,
      "url": currentUrl,
      "image": ogImage,
      "author": {
        "@type": "Organization",
        "name": "Showpass",
        "url": "https://showpass.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Showpass",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dbx9avwd2hnkj.cloudfront.net/static/assets/img/showpass-logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      }
    };

    // Update or create JSON-LD script
    let jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLdScript);
    }
    jsonLdScript.textContent = JSON.stringify(structuredData);

  }, [title, description, keywords, ogImage, canonicalUrl, currentUrl]);

  return null; // This component doesn't render anything
};

export default SEOHead; 