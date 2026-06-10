<script setup lang="ts">
import { apiLogout } from "@/api/login";
import JWT from "@/utils/cookies.js";
import router from "@/router";
import { useAlertStore } from "@/stores/alertStore";
import { useModalStoreStore } from "@/stores/modalStore";

const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

type MenuItem = {
  name: string;
  to: string;
  icon?: string;
};
const Menu: MenuItem[] = [
  { name: "首頁", to: "/webs", icon: "Common-Home" },
  { name: "收藏", to: "/favorite", icon: "Common-Heart" },
  { name: "我的", to: "/profile", icon: "Common-User" },
];

// 登出
const goLogout = async () => {
  const res = await apiLogout();
  JWT.removeAllToken();
  alertStore.pushMsg("success", res.msg);
  router.push({ name: "Login" });
};
</script>

<template>
  <div class="min-h-dvh flex flex-col overflow-x-hidden">
    <!-- 電腦版 HEADER -->
    <header class="hidden lg:flex bg-white">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between p-4 px-8 w-full"
      >
        <div class="flex items-center gap-2">
          <SvgIcon icon-name="LOGO" class="h-8 w-8" />
          <p class="font-semibold">TaoTao</p>
        </div>

        <div class="flex gap-10">
          <router-link
            v-for="item in Menu"
            :key="item.name"
            :to="item.to"
            class="font-semibold transition duration-150 hover:text-black hover:scale-105"
            :class="{
              'text-black font-bold': $route.path === item.to,
              'text-gray-500 hover:text-black': $route.path !== item.to,
            }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <button
          @click="goLogout"
          class="font-semibold transition duration-150 hover:text-black hover:scale-105 hover:cursor-pointer"
        >
          登出
        </button>
      </nav>
    </header>

    <!-- 手機板 HEADER -->
    <header class="lg:hidden bg-white pt-[env(safe-area-inset-top)]">
      <nav class="flex items-center justify-between px-6 py-3">
        <button @click="modalStore.openCreate()">
          <SvgIcon icon-name="Common-Plus" class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-2">
          <SvgIcon icon-name="LOGO" class="h-6 w-6" />
          <p class="font-semibold">TaoTao</p>
        </div>

        <button
          @click="goLogout"
          class="font-semibold transition duration-150 active:scale-95 active:opacity-70 hover:opacity-80 hover:cursor-pointer"
        >
          登出
        </button>
      </nav>
    </header>
    <main class="flex-1 overflow-y-auto overscroll-contain">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <div
            :key="route.fullPath"
            class="max-w-294 mx-auto px-4 w-full h-full"
          >
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <!-- FOOTER -->
    <footer class="lg:hidden bg-white flex shrink-0">
      <router-link
        v-for="item in Menu"
        :key="item.name"
        :to="item.to"
        class="flex-1 flex flex-col items-center py-2 font-semibold transition duration-150 hover:text-black"
        :class="$route.path === item.to ? 'text-black' : 'text-gray-500'"
      >
        <SvgIcon :icon-name="item.icon!" class="h-6 w-6" />
        <p class="text-xs font-semibold">{{ item.name }}</p>
      </router-link>
    </footer>
  </div>
</template>

<style></style>
