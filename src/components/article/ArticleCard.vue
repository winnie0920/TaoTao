<script setup lang="ts">
import type { Article } from "@/types";
defineProps<{
  article: Article;
}>();
</script>

<template>
  <article
    class="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm transition-all duration-300 ease-out hover:shadow-lg active:scale-[0.98] active:shadow-md"
  >
    <img
      :src="article.images?.[0]?.imageUrl"
      alt="文章封面"
      class="w-full aspect-16/10 object-cover"
    />

    <div class="p-4">
      <div class="flex gap-2 mb-2">
        <span
          class="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
        >
          <SvgIcon :icon-name="article.countryIcon" class="w-3 h-3" />
          {{ article.countryName }}
        </span>

        <span
          class="text-[11px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"
        >
          <SvgIcon :icon-name="article.categoryIcon" class="w-3 h-3" />
          {{ article.categoryName }}
        </span>
      </div>

      <h2 class="text-lg font-semibold text-zinc-900 line-clamp-2">
        {{ article.title }}
      </h2>

      <div class="flex items-center justify-between mt-4 text-sm text-zinc-500">
        <span> @{{ article.userName?.split("@")[0] }} </span>

        <span class="flex items-center gap-1">
          <SvgIcon
            icon-name="Common-Heart"
            class="w-4 h-4 transition"
            :class="article.liked ? 'text-red-500' : 'text-zinc-400'"
          />
          <span>{{ article.likeCount }}</span>
        </span>
      </div>
    </div>
  </article>
</template>
