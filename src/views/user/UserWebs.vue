<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHomeStore } from "@/stores/HomeStore";

import SearchBar from "@/components/SearchBar.vue";
import ScrollerBar from "@/components/ScrollerBar.vue";

const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();

const country = computed<string>({
  get: () => (route.query.country as string) ?? "",
  set: (val) => {
    router.replace({
      query: {
        ...route.query,
        country: val || null,
      },
    });
  },
});
const keyword = computed({
  get: () => (route.query.search as string) ?? "",
  set: (val: string) => {
    router.replace({
      query: {
        ...route.query,
        search: val || null,
      },
    });
  },
});
const countryName = computed(() => homeStore.countryName(country.value) ?? "");

onMounted(() => {
  homeStore.initCountries();
});
</script>

<template>
  <div class="mt-5 space-y-5">
    <template v-if="!country && !keyword">
      <div class="flex items-center gap-2">
        <SvgIcon icon-name="Common-Globe" class="w-5 h-5" />
        <h2 class="text-xl font-semibold">海外好禮報報</h2>
      </div>
      <SearchBar @search="keyword = $event" />
      <ScrollerBar v-model="country" :countries="homeStore.countries" />
    </template>

    <template v-else>
      <h3 class="text-lg font-semibold">
        <span v-if="countryName">國家：{{ countryName }}</span>
        <span v-if="keyword">搜尋：{{ keyword }}</span>
      </h3>

      <div class="space-y-3">
        <div class="p-3 rounded-md">文章列表（之後接 API）</div>
      </div>
    </template>
  </div>
</template>
