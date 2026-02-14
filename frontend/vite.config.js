// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import postcssNesting from "postcss-nesting";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const devProxyTarget =
    process.env.VITE_DEV_PROXY_TARGET ||
    "https://alinafe-o4ec.onrender.com";

  return {
    plugins: [react()],
    // Local-only API proxy. Production (Netlify) must use VITE_API_BASE_URL.
    server: isDev
      ? {
          proxy: {
            "/api": {
              target: devProxyTarget,
              changeOrigin: true,
            },
          },
        }
      : undefined,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      postcss: {
        plugins: [postcssNesting(), tailwindcss(), autoprefixer()],
      },
    },
  };
});
