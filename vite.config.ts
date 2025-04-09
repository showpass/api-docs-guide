import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { markdownImport } from "./src/docs-app/infrastructure/vite-plugin-md-import";

// Use the correct base depending on where we are deploying
const BASE_URL ="/";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: BASE_URL,
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  plugins: [
    react(),
    markdownImport(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
