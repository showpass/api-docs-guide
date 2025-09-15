# 📘 Showpass API Docs Guide

A lightweight, static documentation app built with **Vite + React + TypeScript**, designed to serve Showpass API/SDK documentation using a markdown-driven content loading.

🔗 **Live Demo:** [dev.showpass.com](https://dev.showpass.com/)

---

## 🚀 Quick Start

```sh
git clone https://github.com/showpass/api-docs-guide.git
cd api-docs-guide
npm install
npm run dev
```

---

## 🧠 How It Works

### 1. **Content Loading (Application Layer)**
- The `ContentManager` is the main interface for loading docs.
- It uses `DocsLoader`, a static markdown loader that imports `.md` files at build time via a custom Vite plugin.
- It also parses `##` headings to extract a table of contents.

### 2. **React Hook (UI Layer)**
- `useContent()` fetches markdown content + auto-extracts headings for TOC.
- Manages `isLoading`, `error`, and `tableOfContents` state.

### 3. **UI Composition**
- `DynamicDocPage` serves as the main container, routing to appropriate content types.
- `ContentPage` renders markdown via `react-markdown` with custom syntax highlighting.
- `DocLayout` orchestrates the three-panel layout: navigation sidebar, main content, and table of contents.
- `Navigation` component provides collapsible sections with active state indicators.
- `TableOfContents` auto-generates from markdown headings with smooth scroll behavior.
- `ApiExamples` renders multi-language code snippets with copy functionality.

---

## 🗂 Folder Structure

```
docs-app/
├── application/         # Business logic layer (ContentManager)
├── infrastructure/      # DocsLoader, vite-plugin-md-import
├── ui/                  # React components, layout, and content rendering
├── data/                # Markdown content files (.md)
```

---

## 🌍 Deployment

Deployed automatically to **GitHub Pages** using `gh-pages`.

---

## 💡 Highlights

- 📚 Markdown as source of truth
- ⚛️ React + Vite for blazing-fast UI
- 📜 Custom TOC & syntax highlighting
- 📦️ Built-in API Example block (multi-language)
- 🧼 Modular design & UI separation

---

## 🛠 Technologies

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [gh-pages](https://github.com/tschaub/gh-pages)

---

👥 Maintained by Showpass Dev Team
