<script setup lang="ts">
import { useRoute } from "vue-router";
import { useHomeStore } from "@/stores/homeStore";

const route = useRoute();
const homeStore = useHomeStore();

watch(
  () => route.query,
  (newQuery) => {
    homeStore.initArticles(true, {
      keyword: (newQuery.search as string) || "",
      countryId: newQuery.countryId
        ? parseInt(newQuery.countryId as string)
        : undefined,
    });
  },
  { immediate: true },
);
onMounted(() => {
  homeStore.initCountries();
  homeStore.initCategories();
});
</script>

<template>
  <div class="mt-5 space-y-5">
    <h3 class="text-lg font-semibold">
      <span v-if="route.query.countryId"
        >國家：{{ homeStore.countryName(Number(route.query.countryId)) }}</span
      >
      <span v-if="route.query.search"> 搜尋：{{ route.query.search }}</span>
    </h3>
    <!-- 卡片頁面 -->
    <ArticleGrid />
  </div>
</template>
