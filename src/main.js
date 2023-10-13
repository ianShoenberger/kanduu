import { createApp } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);

app.use(createPinia()).use(router);
app.mount("#app");
