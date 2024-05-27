import { createSSRApp } from "vue";
import { VueQueryPlugin, vueQueryPluginOptions } from "plugins/queryPlugins";
import App from "./App.vue";
import Vant from "vant";
import "vant/lib/index.css";
import { setupStore } from "store/index";

export function createApp() {
  const app = createSSRApp(App);
  setupStore(app);
  app.use(VueQueryPlugin, vueQueryPluginOptions, Vant);
  return {
    app,
  };
}
