<script setup lang="ts">
import type { ArticleImage } from "@/types";

const props = defineProps<{
  images?: ArticleImage[];
}>();

// 頁數
const currentImgIndex = ref(0);

const articleImages = computed<string[]>(() => {
  if (Array.isArray(props.images) && props.images.length > 0) {
    return props.images.map((img) => img.imageUrl);
  }
  return [];
});

// 往前
const prevImage = (e: Event) => {
  e.stopPropagation();
  if (currentImgIndex.value > 0) currentImgIndex.value--;
};

// 往後
const nextImage = (e: Event) => {
  e.stopPropagation();
  if (currentImgIndex.value < articleImages.value.length - 1)
    currentImgIndex.value++;
};

// 重置頁數
const resetIndex = () => {
  currentImgIndex.value = 0;
};

defineExpose({ resetIndex });
</script>

<template>
  <div
    class="w-full lg:w-[55%] bg-black flex items-center justify-center relative group min-h-75 lg:h-full"
  >
    <template v-if="articleImages.length > 0">
      <img
        :src="articleImages[currentImgIndex]"
        alt="文章圖片"
        class="w-full h-full object-contain transition-all duration-300"
      />

      <button
        v-if="currentImgIndex > 0"
        @click="prevImage"
        class="absolute left-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 select-none z-10"
      >
        ◀
      </button>

      <button
        v-if="currentImgIndex < articleImages.length - 1"
        @click="nextImage"
        class="absolute right-4 bg-black/50 hover:bg-black/70 text-white w-9 h-9 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 select-none z-10"
      >
        ▶
      </button>

      <div
        v-if="articleImages.length > 1"
        class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm z-10"
      >
        <span
          v-for="(img, idx) in articleImages"
          :key="idx"
          @click="currentImgIndex = idx"
          class="w-2 h-2 rounded-full cursor-pointer transition-all"
          :class="
            currentImgIndex === idx ? 'bg-white scale-125' : 'bg-white/50'
          "
        ></span>
      </div>
    </template>

    <div v-else class="text-zinc-500">暫無圖片</div>
  </div>
</template>
