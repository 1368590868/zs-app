import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import { join } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  server: {
    // Listening on all local IPs
    host: true,
    port: 3000,
    // Load proxy configuration from .env
    proxy: {
      "/api": {
        target: "http://192.168.8.23:8688",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      components: join(__dirname, "src/components/"),
      utils: join(__dirname, "src/utils/"),
      store: join(__dirname, "src/store/"),
      api: join(__dirname, "src/api/"),
      styles: join(__dirname, "src/styles/"),
      constants: join(__dirname, "src/constants/"),
      hooks: join(__dirname, "src/hooks/"),
      static: join(__dirname, "src/static/"),
      types: join(__dirname, "src/types/"),
      plugins: join(__dirname, "src/plugins/"),
      enum: join(__dirname, "src/enum/"),
    },
  },
});
