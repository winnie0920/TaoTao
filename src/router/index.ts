import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: { name: "Login" },
      children: [
        {
          path: "login",
          name: "Login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "register",
          name: "Register",
          component: () => import("@/views/RegisterView.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("@/layout/user/UserLayout.vue"),
      children: [
        {
          path: "webs",
          name: "UserWebs",
          meta: { icon: "Side-Bookmark", title: "海外好禮" },
          component: () => import("@/views/user/UserWebs.vue"),
        },
      ],
    },
  ],
});

export default router;
