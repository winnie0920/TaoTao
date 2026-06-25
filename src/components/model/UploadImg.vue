<script setup lang="ts">
import { computed } from "vue";
import { useAlertStore } from "@/stores/alertStore";
import { useDragScroll } from "@/composables/useDragScroll";
import type { UploadImage } from "@/types";

interface Props {
  modelValue: UploadImage[];
  content?: string;
  class?: string;
  isAvatar?: boolean; // 頭貼模式開關
  limit?: number; // 限制張數
}

const props = withDefaults(defineProps<Props>(), {
  class: "w-full",
  isAvatar: false,
  limit: 99,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: UploadImage[]): void;
}>();

const alertStore = useAlertStore();
const { container, startDrag, onDrag, stopDrag } = useDragScroll();

const images = computed({
  get: () => props.modelValue,
  set: (val: UploadImage[]) => emit("update:modelValue", val),
});

const changeImg = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (!files?.length) return;

  if (images.value.length + files.length > props.limit) {
    alertStore.pushMsg("error", `最多只能上傳 ${props.limit} 張圖片`);
    return;
  }

  const types = ["image/jpeg", "image/jpg", "image/png"];
  for (const file of Array.from(files)) {
    if (!types.includes(file.type)) {
      alertStore.pushMsg("error", "只能上傳 JPG、JPEG、PNG");
      continue;
    }
    images.value.push({ file, preview: URL.createObjectURL(file) });
  }
  target.value = "";
};

const removeImage = (index: number): void => {
  images.value.splice(index, 1);
};
</script>

<template>
  <input
    id="uploadImg"
    class="hidden"
    type="file"
    multiple
    accept=".jpg,.jpeg,.png"
    @change="changeImg"
  />

  <div :class="['overflow-hidden', props.class]">
    <div v-if="images.length === 0" class="h-full">
      <div
        :class="[
          'w-full border border-zinc-200 bg-zinc-50 transition cursor-pointer hover:bg-zinc-100',
          isAvatar
            ? 'rounded-full h-full '
            : 'rounded-lg border-2 border-dashed h-60',
        ]"
      >
        <label
          for="uploadImg"
          class="w-full h-full flex flex-col items-center justify-center gap-1 sm:gap-2 text-zinc-500"
        >
          <SvgIcon
            icon-name="Common-Camera"
            class="size-8 sm:size-12 transition-all duration-300"
          />

          <p class="text-xs sm:text-sm text-center px-2 truncate max-w-full">
            {{ props.content || "點擊上傳圖片" }}
          </p>
        </label>
      </div>
    </div>

    <div
      v-else
      ref="container"
      class="flex gap-4 pb-2 overflow-x-auto cursor-grab select-none no-scrollbar"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
    >
      <div
        v-for="(img, index) in images"
        :key="img.preview"
        :class="[
          'relative shrink-0  bg-zinc-50 group',
          isAvatar
            ? 'w-full h-full rounded-full aspect-square'
            : 'w-60 h-60 rounded-lg',
        ]"
      >
        <img
          :src="img.preview"
          class="w-full h-full object-cover"
          draggable="false"
        />
        <div
          :class="[
            'absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition cursor-pointer',
            isAvatar ? 'rounded-full' : 'rounded-lg',
          ]"
          @click="removeImage(index)"
        >
          移除
        </div>
      </div>

      <label
        class="flex flex-col items-center"
        v-if="images.length < props.limit"
        for="uploadImg"
        :class="[
          'shrink-0 justify-center border-2 border-dashed border-zinc-300 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 cursor-pointer',
          isAvatar ? 'w-full h-full rounded-full' : 'w-60 h-60 rounded-lg',
        ]"
      >
        <SvgIcon icon-name="Common-Camera" class="size-8 mb-2" />
        <p class="text-xs sm:text-sm text-center px-2 truncate max-w-full">
          {{ props.content || "點擊上傳圖片" }}
        </p>
      </label>
    </div>
  </div>
</template>
