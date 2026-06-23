<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";

const homeStore = useHomeStore();
onMounted(() => {
  homeStore.initCountries();
  homeStore.initCategories();
  homeStore.initTags();
  homeStore.initFavoriteArticles(true);
});
</script>

<template>
  <div class="mt-5 space-y-5">
    <h2 class="text-xl font-semibold">我的收藏</h2>
    <ArticleGrid />
  </div>
</template>
