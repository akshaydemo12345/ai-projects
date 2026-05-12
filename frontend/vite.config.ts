import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  const backendUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        // Centralized proxy configuration - all routes use the same backend URL
        '/auth': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/user': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/projects': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/pages': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/ai': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/api': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/leads': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
        '/plugin': { target: backendUrl, changeOrigin: true, timeout: 300000, proxyTimeout: 300000 },
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
  };
});
