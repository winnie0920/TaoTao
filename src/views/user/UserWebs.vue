<script setup lang="ts">
import { useHomeStore } from "@/stores/homeStore";
import { useModalStore } from "@/stores/modalStore";
import { computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();
const modalStore = useModalStore();

// 直接計算 countryId，網址變，它就變
const countryId = computed(() => {
  const val = route.query.countryId;
  // 必須回傳一個 number 或 undefined
  return typeof val === "string" ? parseInt(val, 10) : undefined;
});
// 簡單的路由切換
const updateQuery = (key: string, val: any) => {
  router.push({
    path: "/search",
    query: { ...route.query, [key]: val || undefined },
  });
};
onMounted(() => {
  homeStore.initCountries();
  homeStore.initCategories();
  homeStore.initTags();
  homeStore.initArticles(true);
});
</script>
<template>
  <div class="mt-5 space-y-5">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">海外好禮報報</h2>
      <button
        class="hidden lg:flex items-center gap-1 text-sm rounded-md border border-zinc-300 bg-white px-3 py-1 text-zinc-900 transition-all duration-200 ease-in-out hover:bg-zinc-100 active:bg-zinc-200"
        @click="modalStore.openModal('articleCreate', null, '新增貼文')"
      >
        + 新增貼文
      </button>
    </div>
    <SearchBar @search="(val) => updateQuery('search', val)" />
    <ScrollerBar
      :model-value="countryId ?? 0"
      @update:model-value="(v) => updateQuery('countryId', v)"
      :items="homeStore.countries"
    />
    <ArticleGrid />
  </div>
</template>
