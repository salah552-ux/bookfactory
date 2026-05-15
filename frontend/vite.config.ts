import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
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
