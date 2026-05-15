import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";

const STANDALONE = process.env.VITE_STANDALONE === "true";

export default defineConfig({
  plugins: [
    react(),
    // Bundle every JS/CSS/asset into one HTML file when STANDALONE is on so
    // the demo can be opened by double-clicking the file (no server needed).
    ...(STANDALONE ? [viteSingleFile()] : []),
  ],
  // Base path for hosted builds (e.g. /bookfactory/ on GitHub Pages).
  // Set via VITE_BASE at build time. Empty for local dev.
  base: process.env.VITE_BASE || "/",
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: STANDALONE
    ? {
        // Single-file build: rollup inlines everything, so manualChunks
        // is incompatible. Bump the warning limit since the whole bundle
        // is one HTML file.
        cssCodeSplit: false,
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 5000,
      }
    : {
        // Split big vendor deps into their own chunks so the initial bundle
        // stays under ~200 KB gzipped and Recharts/Monaco only load on demand.
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes("node_modules")) {
                if (id.includes("monaco-editor")) return "monaco";
                if (id.includes("recharts") || id.includes("d3-")) return "charts";
                if (id.includes("react")) return "react";
              }
              return undefined;
            },
          },
        },
        chunkSizeWarningLimit: 700,
      },
  server: {
    // Default port; override on the command line with `--port` or the
    // FRONTEND_PORT env var (start-ui.sh handles both).
    port: Number(process.env.VITE_PORT ?? 5180),
    proxy: {
      "/ws": {
        target: `ws://127.0.0.1:${process.env.VITE_BACKEND_PORT ?? 8787}`,
        ws: true,
        changeOrigin: true,
      },
      "/api": {
        target: `http://127.0.0.1:${process.env.VITE_BACKEND_PORT ?? 8787}`,
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api/, ""),
      },
    },
  },
});
