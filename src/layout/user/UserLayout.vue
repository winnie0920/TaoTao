<script setup lang="ts">
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
</script>

<template>
  <div class="min-h-screen flex flex-col">
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
            class="font-semibold"
            :class="{
              'text-black font-bold': $route.path === item.to,
              'text-gray-500 hover:text-black': $route.path !== item.to,
            }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <div class="font-semibold">登出</div>
      </nav>
    </header>

    <!-- 手機板 HEADER -->
    <header class="lg:hidden bg-white pt-[env(safe-area-inset-top)]">
      <nav class="flex items-center justify-between px-6 py-3">
        <button>
          <SvgIcon icon-name="Common-Plus" class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-2">
          <SvgIcon icon-name="LOGO" class="h-6 w-6" />
          <p class="font-semibold">TaoTao</p>
        </div>

        <button class="font-semibold">登出</button>
      </nav>
    </header>
    <!-- CONTENT -->
    <main class="flex-1 overflow-y-auto">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <div :key="route.fullPath" class="w-full h-full">
            <component :is="Component" />
          </div>
        </transition>
      </router-view>
    </main>
    <!-- FOOTER -->
    <footer class="lg:hidden bg-white flex">
      <router-link
        v-for="item in Menu"
        :key="item.name"
        :to="item.to"
        class="flex-1 flex flex-col items-center py-2"
        :class="$route.path === item.to ? 'text-black' : 'text-gray-500'"
      >
        <SvgIcon :icon-name="item.icon!" class="h-6 w-6" />
        <p class="text-xs font-semibold">{{ item.name }}</p>
      </router-link>
    </footer>
  </div>
</template>

<style></style>
