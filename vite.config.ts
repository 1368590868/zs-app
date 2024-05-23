import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

import { resolve, join } from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { VantResolver, VantImports } from "@vant/auto-import-resolver";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    AutoImport({
      imports: [VantImports],
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
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
    },
  },
});
