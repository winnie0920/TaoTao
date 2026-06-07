<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "search", value: string): void;
}>();

const input = ref("");
const onEnter = () => {
  emit("search", input.value.trim());
};
</script>

<template>
  <div
    class="flex items-center px-3 h-11 sm:h-12 bg-gray-100 rounded-md transition hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-black/10"
  >
    <SvgIcon
      icon-name="Common-Search"
      class="w-5 h-5 mr-2 text-gray-400 shrink-0"
    />

    <input
      v-model="input"
      type="text"
      placeholder="輸入關鍵字..."
      class="w-full text-sm bg-transparent placeholder:text-gray-400 focus:outline-none"
      @keydown.enter="onEnter"
    />
  </div>
</template>
