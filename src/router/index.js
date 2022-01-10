import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Chat",
    component: () => import("../views/Chat.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
