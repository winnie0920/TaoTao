<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from "vue";

const props = defineProps<{
  selectedTags: any[];
}>();

const emit = defineEmits<{
  (e: "open"): void;
  (e: "remove", id: number): void;
}>();

// 綁定 DOM 元素
const containerRef = ref<HTMLElement | null>(null);
const tagsRowRef = ref<HTMLElement | null>(null);

// 儲存超出範圍被隱藏的標籤數量
const hiddenCount = ref(0);

// 計算哪些標籤該隱藏的核心邏輯
const updateVisibleTags = () => {
  if (!containerRef.value || !tagsRowRef.value) return;

  const container = containerRef.value;
  const tagElements = tagsRowRef.value.children;

  // 取得容器的右邊界 X 座標
  const containerRight = container.getBoundingClientRect().right;
  let count = 0;

  // 遍歷每一個標籤元素
  for (let i = 0; i < tagElements.length; i++) {
    const tag = tagElements[i] as HTMLElement;

    // 跳過 +N 櫃檯本身，不計算它
    if (tag.classList.contains("plus-n-counter")) continue;

    // 先回復顯示，才能測量真實右邊界
    tag.style.display = "flex";
    const tagRight = tag.getBoundingClientRect().right;

    // 如果標籤右邊界超過了容器邊界（預留約 60px 給 +N 按鈕空間）
    if (tagRight > containerRight - 60) {
      tag.style.display = "none"; // 超過就隱藏
      count++;
    }
  }

  hiddenCount.value = count;
};

// 當外部傳入的標籤陣列有增減時，重新計算
watch(
  () => props.selectedTags,
  () => {
    nextTick(() => updateVisibleTags());
  },
  { deep: true },
);

onMounted(() => {
  // 使用 ResizeObserver 監聽容器寬度變化（RWD 縮放時會自動觸發）
  const resizeObserver = new ResizeObserver(() => {
    nextTick(() => updateVisibleTags());
  });

  if (containerRef.value) {
    resizeObserver.observe(containerRef.value);
  }

  nextTick(() => updateVisibleTags());
});
</script>

<template>
  <div>
    <div class="flex justify-between mb-2">
      <span class="block text-sm/6 font-medium text-zinc-900"> 標籤 </span>

      <button
        class="flex items-center gap-1 text-sm rounded-md border border-zinc-300 bg-white px-3 py-1 text-zinc-900 transition-all duration-200 ease-in-out hover:bg-zinc-100 active:bg-zinc-200"
        @click="emit('open')"
      >
        + 新增標籤
      </button>
    </div>

    <div
      ref="containerRef"
      class="border border-zinc-300 rounded-md bg-white p-3 transition-all duration-200 ease-in-out focus-within:ring-4 focus-within:ring-zinc-100 overflow-hidden"
    >
      <div
        ref="tagsRowRef"
        class="flex flex-nowrap gap-2 items-center w-full overflow-hidden"
      >
        <div
          v-for="tag in selectedTags"
          :key="tag.id"
          class="bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm shrink-0 whitespace-nowrap"
        >
          {{ tag.name }}

          <button
            class="text-zinc-500 hover:text-zinc-900 transition-colors"
            @click="emit('remove', tag.id)"
          >
            ✕
          </button>
        </div>

        <div
          v-if="hiddenCount > 0"
          class="plus-n-counter bg-zinc-200 text-zinc-900 px-3 py-1 rounded-full text-sm shrink-0 whitespace-nowrap ml-auto"
        >
          +{{ hiddenCount }}
        </div>
      </div>
    </div>
  </div>
</template>
