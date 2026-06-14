<script setup lang="ts">
defineProps<{
  title: string;
  author: string;
  likes: number | string;
  image: string;
}>();
</script>

<template>
  <article
    class="bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm transition-all duration-300 ease-out hover:shadow-lg active:scale-[0.98] active:shadow-md"
  >
    <img
      :src="image"
      alt="文章封面"
      class="w-full aspect-[16/10] object-cover"
    />

    <div class="p-4">
      <h2 class="text-lg font-semibold text-zinc-900 line-clamp-2">
        {{ title }}
      </h2>

      <div class="flex items-center justify-between mt-4 text-sm text-zinc-500">
        <span>@{{ author }}</span>
        <span>❤️ {{ likes }}</span>
      </div>
    </div>
  </article>
</template>
