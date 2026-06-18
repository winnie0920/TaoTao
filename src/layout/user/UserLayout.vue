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

// 如果彈窗開著，按上一頁時攔截下來，並關閉彈窗
const handlePopState = (event: PopStateEvent) => {
  if (modalStore.isOpen) {
    modalStore.isOpen = false;
    modalStore.mode = null;
    modalStore.step = "form";
  }
};

onMounted(() => {
  window.addEventListener("popstate", handlePopState);
});
onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>

<template>
  <div class="h-dvh flex flex-col overflow-hidden">
    <!-- 電腦版 HEADER -->
    <header class="hidden lg:flex bg-white">
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between p-4 px-8 w-full"
      >
        <router-link
          to="/webs"
          class="flex items-center gap-2 cursor-pointer transition-transform duration-300 ease-out hover:scale-105 active:scale-100"
        >
          <SvgIcon icon-name="LOGO" class="h-8 w-8" />
          <p class="font-semibold text-lg">TaoTao</p>
        </router-link>
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
    <header class="lg:hidden shrink-0 bg-white pt-[env(safe-area-inset-top)]">
      <nav class="flex items-center justify-between px-6 py-3">
        <button @click="modalStore.openModal('create', null, '新增貼文')">
          <SvgIcon icon-name="Common-Plus" class="h-5 w-5" />
        </button>

        <router-link
          to="/webs"
          class="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
        >
          <SvgIcon icon-name="LOGO" class="h-6 w-6" />
          <p class="font-semibold">TaoTao</p>
        </router-link>

        <button
          @click="goLogout"
          class="font-semibold transition duration-150 active:scale-95 active:opacity-70 hover:opacity-80 hover:cursor-pointer"
        >
          登出
        </button>
      </nav>
    </header>
    <main class="flex-1 min-h-0 overflow-hidden">
      <div class="h-full overflow-y-auto no-scrollbar">
        <router-view v-slot="{ Component, route }">
          <transition name="fade" mode="out-in">
            <div :key="route.fullPath" class="max-w-294 mx-auto px-4 w-full">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
    </main>
    <!-- FOOTER -->
    <footer class="lg:hidden shrink-0 bg-white flex">
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

  <!-- 彈窗 -->
  <ArticleEditor />
  <ArticleView />
</template>

<style></style>
