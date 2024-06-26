import { createRouter, createWebHashHistory } from "vue-router";
import KanduuApp from "../pages/KanduuApp.vue";
import Category from "../pages/Category.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: KanduuApp,
  },
  {
    path: "/category/:categoryId", // FYI this is not being used right now
    name: "category",
    component: Category,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
