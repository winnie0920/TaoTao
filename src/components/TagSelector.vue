<script setup lang="ts">
import { ref, computed } from "vue";

type Tag = {
  id: number;
  name: string;
};

const props = defineProps<{
  modelValue: number[];
  options: Tag[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const page = ref<"view" | "select">("view");

/* 已選 tag */
const selectedTags = computed(() =>
  props.options.filter((t) => props.modelValue.includes(t.id)),
);

/* 切換選取 */
const toggle = (id: number) => {
  const next = [...props.modelValue];

  const idx = next.indexOf(id);

  if (idx > -1) {
    next.splice(idx, 1);
  } else {
    next.push(id);
  }

  emit("update:modelValue", next);
};

/* 刪除 tag */
const remove = (id: number) => {
  emit(
    "update:modelValue",
    props.modelValue.filter((t) => t !== id),
  );
};

/* 返回 */
const closeSelect = () => {
  page.value = "view";
};
</script>

<template>
  <div class="border rounded-lg p-3">
    <!-- ================= VIEW ================= -->
    <div v-if="page === 'view'">
      <div class="flex justify-between mb-2">
        <span class="font-medium">標籤</span>

        <button class="text-blue-500" @click="page = 'select'">
          + 新增標籤
        </button>
      </div>

      <div class="flex flex-wrap gap-2 min-h-10">
        <div
          v-for="tag in selectedTags"
          :key="tag.id"
          class="bg-zinc-100 px-3 py-1 rounded-full flex items-center gap-2"
        >
          {{ tag.name }}

          <button @click="remove(tag.id)">✕</button>
        </div>
      </div>
    </div>

    <!-- ================= SELECT ================= -->
    <div v-else class="space-y-3">
      <div class="flex justify-between items-center border-b pb-2">
        <button @click="closeSelect">← 返回</button>

        <span class="font-semibold"> 選擇標籤 </span>

        <button @click="closeSelect">完成</button>
      </div>

      <div
        v-for="tag in options"
        :key="tag.id"
        class="flex justify-between items-center p-3 border-b cursor-pointer transition-all duration-150 hover:bg-zinc-50 active:bg-zinc-100"
        @click="toggle(tag.id)"
      >
        <span class="text-zinc-800">
          {{ tag.name }}
        </span>

        <input
          type="checkbox"
          :checked="modelValue.includes(tag.id)"
          readonly
          class="accent-zinc-800"
        />
      </div>
    </div>
  </div>
</template>
