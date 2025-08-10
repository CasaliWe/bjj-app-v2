import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", 
      includeAssets: ["favicon.png", "robots.txt", "icons/*.png"],
      workbox: {
        // Configurações do Workbox
        clientsClaim: true,
        skipWaiting: true
      },
      manifest: {
        name: "BJJ ACADEMY",
        short_name: "BJJ ACADEMY",
        description: "Plataforma completa para gerenciar seu progresso no Jiu-Jitsu",
        theme_color: "#0f1419",
        background_color: "#0f1419",
        display: "standalone",
        icons: [
          {
            src: "favicon.png",
            sizes: "300x300",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        start_url: "/app",
        orientation: "portrait"
      }
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
