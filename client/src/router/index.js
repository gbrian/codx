import { createRouter, createWebHistory } from "vue-router";
import { $storex } from "@/store";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/login/:provider",
    name: "Auth",
    component: () => import("../views/SignIn.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("../views/SignUp.vue"),
  },
  {
    path: "/reset",
    name: "ResetPassword",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main.vue"),
  },
  {
    path: "/chat/:chat",
    name: "Chat",
    component: () => import("../views/Main.vue"),
  },
  {
    path: "/channel/:channel",
    name: "Channel",
    component: () => import("../views/Main.vue"),
  },
  {
    path: "/join/@:joinMe",
    name: "JoinMe",
    component: () => import("../views/Main.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});
router.beforeEach(async (to, from, next) => {
  let { fullPath, path, query, params: { joinMe } } = to
  const isLogin = path.startsWith("/login")
  if (path === "/logout") {
    await $storex.user.logout()
    return next('/')
  } else {
    await $storex.user.fetchAccessToken()
  }
  if (!$storex.user.authenticated && !isLogin) {
    if (path !== '/') {
      return next({ path: "/login", query: { next: fullPath } })
    }
  }
  if (joinMe) {
    await $storex.network.joinUser(joinMe)
    return next("/")
  }
  next();
});
export default router;
