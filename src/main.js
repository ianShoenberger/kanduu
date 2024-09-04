import { createApp } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "./router";
import App from "./App.vue";
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App);

app.use(createPinia()).use(router);
app.mount("#app");

const updateSW = registerSW({
  onNeedRefresh() {
    app._instance.props.showRefreshPrompt = true
  },
  onOfflineReady() {},
});

setTimeout(() => {
  app._instance.props.refreshCallback = updateSW;
}, 100);
