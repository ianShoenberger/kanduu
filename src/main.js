import { createApp, ref } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "./router";
import App from "./App.vue";
import { registerSW } from 'virtual:pwa-register'

const showRefreshPrompt = ref(false)
const updateSW = registerSW({
  onNeedRefresh() {
    showRefreshPrompt.value = true
  },
  onOfflineReady() {},
});

const app = createApp(App);
app.use(createPinia()).use(router);
app.provide('showRefreshPrompt', showRefreshPrompt)
app.provide('refreshCallback', updateSW);
app.mount("#app");
