#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the complete SEO data from the actual source file
async function loadSeoDataMap() {
  try {
    // Read the TypeScript file as text and extract the seoDataMap
    const seoDataPath = path.join(__dirname, '../src/docs-app/data/seoData.ts');
    const seoDataContent = fs.readFileSync(seoDataPath, 'utf8');
    
    // Extract all routes that start with "/" from the seoDataMap
    const routes = [];
    const routeRegex = /["'](\/.+?)["']\s*:/g;
    let match;
    
    while ((match = routeRegex.exec(seoDataContent)) !== null) {
      routes.push(match[1]);
    }
    
    console.log(`Found ${routes.length} routes in seoData.ts`);
    return routes;
  } catch (error) {
    console.error('Error loading SEO data:', error);
    // Fallback to basic routes if import fails
    return [
      "/",
      "/api/01-public-api-introduction"
    ];
  }
}

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
async function createStaticPages() {
  const routes = await loadSeoDataMap();
  const distDir = path.join(__dirname, '../dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.log('index.html not found in dist directory. Run build first.');
    return;
  }

  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

  // Create individual pages for each route
  routes.forEach((route) => {
    if (route === '/') return; // Skip homepage
    
    const routePath = route.substring(1); // Remove leading slash
    const dirPath = path.join(distDir, routePath);
    
    // Create directory if it doesn't exist
    fs.mkdirSync(dirPath, { recursive: true });
    
    // Write the HTML file (basic version without custom meta tags for now)
    fs.writeFileSync(path.join(dirPath, 'index.html'), indexHtml);
  });

  console.log(`✅ Static pages created for ${routes.length} routes`);
}

// Generate a comprehensive sitemap with lastmod dates
async function generateEnhancedSitemap() {
  const routes = await loadSeoDataMap();
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  routes.forEach(route => {
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

  // Add the widget playground page
  sitemap += `
  <url>
    <loc>https://dev.showpass.com/widget-playground</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  sitemap += `
</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Enhanced sitemap generated with ${routes.length + 1} URLs`);
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
  await generateEnhancedSitemap();
  generateRobotsTxt();
  await createStaticPages();
  console.log('✅ SEO enhancements completed successfully!');
} catch (error) {
  console.error('❌ Error building SEO enhancements:', error);
  process.exit(1);
} 