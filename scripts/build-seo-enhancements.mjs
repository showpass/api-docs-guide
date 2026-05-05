#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../src/docs-app/data');
const DIST_DIR = path.join(__dirname, '../dist');

// ---------------------------------------------------------------------------
// Parse seoData.ts as text to extract routes + per-route title/description
// ---------------------------------------------------------------------------
function loadSeoDataMap() {
  try {
    const seoDataPath = path.join(DATA_DIR, 'seoData.ts');
    const src = fs.readFileSync(seoDataPath, 'utf8');

    const routes = [];
    const seoByRoute = {};

    // Match blocks like:  "/some/route": { title: "...", description: "...", keywords: "..." }
    const blockRegex = /["'](\/.+?)["']\s*:\s*\{([^}]+)\}/g;
    let blockMatch;

    while ((blockMatch = blockRegex.exec(src)) !== null) {
      const route = blockMatch[1];
      const body = blockMatch[2];

      routes.push(route);

      const titleMatch = body.match(/title\s*:\s*["'`]([^"'`]+)["'`]/);
      const descMatch = body.match(/description\s*:\s*["'`]([^"'`]+)["'`]/);
      const kwMatch = body.match(/keywords\s*:\s*["'`]([^"'`]+)["'`]/);

      seoByRoute[route] = {
        title: titleMatch ? titleMatch[1] : 'Showpass Developer Documentation',
        description: descMatch ? descMatch[1] : '',
        keywords: kwMatch ? kwMatch[1] : '',
      };
    }

    console.log(`Found ${routes.length} routes in seoData.ts`);
    return { routes, seoByRoute };
  } catch (error) {
    console.error('Error loading SEO data:', error);
    return {
      routes: ['/', '/api/01-public-api-introduction'],
      seoByRoute: {},
    };
  }
}

// ---------------------------------------------------------------------------
// Map a route like "/api/01-public-api-introduction" to its markdown file
// ---------------------------------------------------------------------------
function resolveMarkdownPath(route) {
  // route starts with "/" + section + "/" + slug
  // markdown lives at DATA_DIR + route + ".md"
  const mdFile = path.join(DATA_DIR, `${route}.md`);
  return fs.existsSync(mdFile) ? mdFile : null;
}

// ---------------------------------------------------------------------------
// Build a minimal pre-rendered HTML body for the root div
// This is what crawlers / AI agents will see before React mounts.
// ---------------------------------------------------------------------------
function buildPrerenderedContent(markdownContent, seoData) {
  const html = marked.parse(markdownContent);
  return `<div id="ssg-prerender" style="font-family:sans-serif;max-width:860px;margin:0 auto;padding:2rem 1rem">
  <nav style="margin-bottom:1.5rem"><a href="/" style="color:#4f46e5;text-decoration:none">← Showpass Developer Docs</a></nav>
  <article>${html}</article>
</div>`;
}

// ---------------------------------------------------------------------------
// Patch the SPA shell HTML for a specific route
// ---------------------------------------------------------------------------
function buildPageHtml(baseHtml, seoData, prerenderedContent) {
  let html = baseHtml;

  // Update <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(seoData.title)}</title>`
  );

  // Update canonical <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${escapeHtml(seoData.description)}"`
  );

  // Update OG/Twitter title+description
  html = html.replace(
    /<meta property="og:title" content="[^"]*"/,
    `<meta property="og:title" content="${escapeHtml(seoData.title)}"`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"/,
    `<meta property="og:description" content="${escapeHtml(seoData.description)}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${escapeHtml(seoData.title)}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${escapeHtml(seoData.description)}"`
  );

  // Inject pre-rendered content into <div id="root">
  // React will replace this on mount – crawlers see it immediately.
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${prerenderedContent}</div>`
  );

  return html;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------------------
// Create individual HTML files for every doc route
// ---------------------------------------------------------------------------
async function createStaticPages(routes, seoByRoute) {
  const indexHtmlPath = path.join(DIST_DIR, 'index.html');

  if (!fs.existsSync(indexHtmlPath)) {
    console.log('index.html not found in dist. Run vite build first.');
    return;
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  let pagesCreated = 0;
  let pagesPrerendered = 0;

  for (const route of routes) {
    if (route === '/') continue;

    const seoData = seoByRoute[route] ?? {
      title: 'Showpass Developer Documentation',
      description: '',
      keywords: '',
    };

    // Try to find and render the markdown content
    const mdPath = resolveMarkdownPath(route);
    let pageHtml;

    if (mdPath) {
      const markdownContent = fs.readFileSync(mdPath, 'utf8');
      const prerendered = buildPrerenderedContent(markdownContent, seoData);
      pageHtml = buildPageHtml(baseHtml, seoData, prerendered);
      pagesPrerendered++;
    } else {
      // Non-doc routes (e.g. /widget-playground) – just update meta
      pageHtml = buildPageHtml(baseHtml, seoData, '');
    }

    const routePath = route.substring(1);
    const dirPath = path.join(DIST_DIR, routePath);
    fs.mkdirSync(dirPath, { recursive: true });
    fs.writeFileSync(path.join(dirPath, 'index.html'), pageHtml);
    pagesCreated++;
  }

  console.log(
    `✅ Static pages created: ${pagesCreated} total, ${pagesPrerendered} with pre-rendered content`
  );
}

// ---------------------------------------------------------------------------
// Generate sitemap
// ---------------------------------------------------------------------------
async function generateEnhancedSitemap(routes) {
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  const now = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const route of routes) {
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
  }

  sitemap += `
  <url>
    <loc>https://dev.showpass.com/widget-playground</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  sitemap += `\n</urlset>`;

  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Sitemap generated with ${routes.length + 1} URLs`);
}

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
function generateRobotsTxt() {
  const robotsPath = path.join(__dirname, '../public/robots.txt');
  const content = `User-agent: *
Allow: /

Sitemap: https://dev.showpass.com/sitemap.xml

Crawl-delay: 1

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /`;

  fs.writeFileSync(robotsPath, content);
  console.log('✅ robots.txt updated');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('🚀 Building SEO enhancements...');

try {
  const { routes, seoByRoute } = loadSeoDataMap();
  await generateEnhancedSitemap(routes);
  generateRobotsTxt();
  await createStaticPages(routes, seoByRoute);
  console.log('✅ SEO enhancements completed successfully!');
} catch (error) {
  console.error('❌ Error building SEO enhancements:', error);
  process.exit(1);
}
