#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO data mapping
const seoDataMap = {
  "/": {
    title: "Showpass Developer Documentation - API, SDK & Integration Guide",
    description: "Complete developer documentation for Showpass API, JavaScript SDK, WordPress Plugin, Webhooks, and Google Tag Manager integration. Build seamless event ticketing solutions.",
    keywords: "showpass api, event ticketing api, javascript sdk, wordpress plugin, webhooks, google tag manager, developer documentation, event management"
  },
  "/api/01-public-api-introduction": {
    title: "Showpass Public API Introduction - Developer Documentation",
    description: "Learn how to use the Showpass Public API to access event data programmatically. Get started with authentication, endpoints, and best practices.",
    keywords: "showpass public api, rest api, event data api, api documentation, api authentication, event management api"
  },
  // Add more as needed...
};

// Generate meta tags for each page
function generateMetaTags(seoData) {
  return `
    <meta name="description" content="${seoData.description}">
    <meta name="keywords" content="${seoData.keywords}">
    <meta property="og:title" content="${seoData.title}">
    <meta property="og:description" content="${seoData.description}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Showpass Developer Documentation">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData.title}">
    <meta name="twitter:description" content="${seoData.description}">
    <meta name="twitter:site" content="@showpassevents">
  `;
}

// Create individual HTML files for better SEO (for static hosting)
function createStaticPages() {
  const distDir = path.join(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('index.html not found in dist directory. Run build first.');
    return;
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Create individual pages for each route
  Object.entries(seoDataMap).forEach(([route, seoData]) => {
    if (route === '/') return; // Skip homepage
    
    const routePath = route.substring(1); // Remove leading slash
    const dirPath = path.join(distDir, routePath);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });
    
    // Customize HTML for this route
    let customHtml = indexHtml
      .replace(/<title>.*?<\/title>/, `<title>${seoData.title}</title>`)
      .replace(/<meta name="description".*?>/, `<meta name="description" content="${seoData.description}">`)
      .replace(/<meta property="og:title".*?>/, `<meta property="og:title" content="${seoData.title}">`)
      .replace(/<meta property="og:description".*?>/, `<meta property="og:description" content="${seoData.description}">`);
    
    // Write the customized HTML
    fs.writeFileSync(path.join(dirPath, 'index.html'), customHtml);
  });

  console.log('✅ Static pages created for better SEO');
}

// Generate a comprehensive sitemap with lastmod dates
function generateEnhancedSitemap() {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  Object.keys(seoDataMap).forEach(route => {
    const url = `https://dev.showpass.com${route}`;
    const priority = route === '/' ? '1.0' : '0.8';
    const changefreq = route === '/' ? 'weekly' : 'monthly';
    
    sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap);
  console.log('✅ Enhanced sitemap generated');
}

// Create a robots.txt with proper directives
function generateRobotsTxt() {
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  const robotsContent = `User-agent: *
Allow: /

# Sitemap location
Sitemap: https://dev.showpass.com/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;

  fs.writeFileSync(robotsPath, robotsContent);
  console.log('✅ Robots.txt updated');
}

// Main execution
console.log('🚀 Building SEO enhancements...');

try {
  generateEnhancedSitemap();
  generateRobotsTxt();
  createStaticPages();
  console.log('✅ SEO enhancements completed successfully!');
} catch (error) {
  console.error('❌ Error building SEO enhancements:', error);
  process.exit(1);
} 