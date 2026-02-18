import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.ts",
      registerType: "prompt",
      devOptions: {
        enabled: false,
      },
      manifest: false, // use existing public/site.webmanifest
      injectManifest: {
        injectionPoint: "self.__WB_MANIFEST",
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MiB — accommodate the large JS bundle
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
