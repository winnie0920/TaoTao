<script setup lang="ts">
import { ref, computed } from "vue";
import type { ArticleImage } from "@/types";

const props = defineProps<{
  images?: ArticleImage[];
}>();

/** images */
const articleImages = computed<string[]>(() => {
  if (Array.isArray(props.images) && props.images.length > 0) {
    return props.images.map((img) => img.imageUrl);
  }
  return [];
});

/** index */
const currentImgIndex = ref(0);

/** drag state */
const isDragging = ref(false);
const startX = ref(0);
const dragOffset = ref(0);

const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true;
  startX.value = e.clientX;
  dragOffset.value = 0;
};

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return;
  dragOffset.value = e.clientX - startX.value;
};

const onPointerUp = () => finishDrag();

/** 吸附邏輯 */
const finishDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;

  const threshold = 80;

  if (dragOffset.value > threshold && currentImgIndex.value > 0) {
    currentImgIndex.value--;
  } else if (
    dragOffset.value < -threshold &&
    currentImgIndex.value < articleImages.value.length - 1
  ) {
    currentImgIndex.value++;
  }

  dragOffset.value = 0;
};

/** 按鈕 */
const prevImage = () => {
  if (currentImgIndex.value > 0) currentImgIndex.value--;
};

const nextImage = () => {
  if (currentImgIndex.value < articleImages.value.length - 1) {
    currentImgIndex.value++;
  }
};

/** reset */
const resetIndex = () => {
  currentImgIndex.value = 0;
};

defineExpose({ resetIndex });
</script>

<template>
  <div
    class="w-full lg:w-[55%] bg-black flex items-center justify-center relative group min-h-75 lg:h-full overflow-hidden"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <template v-if="articleImages.length > 0">
      <div
        class="flex w-full h-full transition-transform duration-300 ease-out"
        :style="{
          transform: `translateX(calc(-${currentImgIndex * 100}% + ${dragOffset}px))`,
          transition: isDragging ? 'none' : 'transform 300ms ease-out',
        }"
      >
        <img
          v-for="(img, idx) in articleImages"
          :key="idx"
          :src="img"
          class="w-full h-full shrink-0 object-contain select-none"
          draggable="false"
        />
      </div>

      <!-- 左按鈕 -->
      <button
        v-if="currentImgIndex > 0"
        @click="prevImage"
        class="absolute left-4 bg-black/50 hover:bg-black/70 w-9 h-9 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
      >
        <SvgIcon icon-name="Common-TriangleL" class="h-6 w-6 text-white" />
      </button>

      <!-- 右按鈕 -->
      <button
        v-if="currentImgIndex < articleImages.length - 1"
        @click="nextImage"
        class="absolute right-4 bg-black/50 hover:bg-black/70 w-9 h-9 rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100 z-10"
      >
        <SvgIcon icon-name="Common-TriangleR" class="h-6 w-6 text-white" />
      </button>

      <!-- dots -->
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
        />
      </div>
    </template>

    <div v-else class="text-zinc-500">暫無圖片</div>
  </div>
</template>
