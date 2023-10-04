import { createRouter, createWebHashHistory } from "vue-router";
import TodoApp from "../pages/TodoApp.vue";
import Category from "../pages/Category.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: TodoApp,
  },
  {
    path: "/category/:categoryId",
    name: "category",
    component: Category,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
