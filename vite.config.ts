import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    proxy: {
      "/api/nominatim": {
        target: "https://nominatim.openstreetmap.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/nominatim/, ""),
        headers: { "User-Agent": "BORN-App/1.0 (birth-capsule; contact@born.app)" },
      },
      "/api/wiki": {
        target: "https://en.wikipedia.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/wiki/, ""),
      },
      "/api/wikimedia": {
        target: "https://api.wikimedia.org",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/wikimedia/, ""),
      },
      "/api/openmeteo": {
        target: "https://archive-api.open-meteo.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/openmeteo/, ""),
      },
      "/api/geotimezone": {
        target: "https://timeapi.io",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/geotimezone/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
