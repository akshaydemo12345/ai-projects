import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Get backend URL from environment variable or default to localhost:6000
  const backendUrl = env.VITE_API_BASE_URL || 'http://localhost:5000';

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        // Centralized proxy configuration - all routes use the same backend URL
        '/auth': { target: backendUrl, changeOrigin: true },
        '/user': { target: backendUrl, changeOrigin: true },
        '/projects': { target: backendUrl, changeOrigin: true },
        '/pages': { target: backendUrl, changeOrigin: true },
        '/ai': { target: backendUrl, changeOrigin: true },
        '/api': { target: backendUrl, changeOrigin: true },
        '/leads': { target: backendUrl, changeOrigin: true },
        '/plugin': { target: backendUrl, changeOrigin: true },
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
