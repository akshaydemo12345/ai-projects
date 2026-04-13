import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/auth': { target: 'http://localhost:5000', changeOrigin: true },
      '/user': { target: 'http://localhost:5000', changeOrigin: true },
      '/projects': { target: 'http://localhost:5000', changeOrigin: true },
      '/pages': { target: 'http://localhost:5000', changeOrigin: true },
      '/ai': { target: 'http://localhost:5000', changeOrigin: true },
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/leads': { target: 'http://localhost:5000', changeOrigin: true },
      '/plugin': { target: 'http://localhost:5000', changeOrigin: true },
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  optimizeDeps: {
    include: ["grapesjs", "grapesjs-preset-webpage", "grapesjs-blocks-basic"],
  },
  build: {
    commonjsOptions: {
      include: [/grapesjs/, /node_modules/],
    },
  },
}));
