<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import ArticleCarousel from "@/components/article/ArticleCarousel.vue";

const homeStore = useHomeStore();
const modalStore = useModalStoreStore();
const carouselRef = ref<InstanceType<typeof ArticleCarousel> | null>(null);

const openModal = async (item: any) => {
  homeStore.selectedArticle =
    homeStore.articles.find((a) => a.id === item.id) || item;
  nextTick(() => {
    carouselRef.value?.resetIndex();
  });
  modalStore.openModal("view", item, item.title);
};
</script>

<template>
  <div
    v-if="
      homeStore.refreshing ||
      (homeStore.loading && homeStore.articles.length === 0)
    "
    class="flex justify-center py-20"
  >
    <LoadingSpinner :size="5" color-class="text-gray-400" />
  </div>

  <div
    v-else-if="homeStore.articles.length > 0"
    class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
  >
    <ArticleCard
      v-for="item in homeStore.articles"
      :key="item.id"
      :article="item"
      @click="openModal(item)"
    />

    <ScrollLoader
      :loading="homeStore.loading"
      :hasMore="homeStore.hasMore"
      @loadMore="homeStore.initArticles(false)"
    />
  </div>

  <div
    v-else
    class="flex flex-col items-center justify-center py-20 text-zinc-400"
  >
    <SvgIcon icon-name="Common-Empty" class="w-12 h-12 mb-4 opacity-50" />
    <p>暫無資料</p>
  </div>
</template>
