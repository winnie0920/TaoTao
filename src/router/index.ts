import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
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
          component: () => import("@/views/user/UserWebs.vue"),
        },
        {
          path: "favorite",
          name: "UserFavorite",
          component: () => import("@/views/user/UserFavorite.vue"),
        },
        {
          path: "profile",
          name: "UserProfile",
          component: () => import("@/views/user/UserProfile.vue"),
        },
      ],
    },
  ],
});

export default router;
