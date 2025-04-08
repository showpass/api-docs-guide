# 📘 Showpass API Docs Guide

A lightweight, static documentation app built with **Vite + React + TypeScript**, designed to serve Showpass API/SDK documentation using a markdown-driven content loading.

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
- `ContentPage` renders markdown via `react-markdown` with custom components.
- `DocLayout` manages layout: navigation sidebar (left), content center, and table of contents (right).
- Parameter tables in markdown are parsed and rendered using `<ParameterTable>`.

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
- 🧩 Parameter tables with semantic parsing
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
