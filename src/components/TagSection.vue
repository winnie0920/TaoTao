<script setup lang="ts">
defineProps<{
  selectedTags: any[];
}>();

const emit = defineEmits<{
  (e: "open"): void;
  (e: "remove", id: number): void;
}>();
</script>

<template>
  <div>
    <div class="flex justify-between mb-2">
      <span class="block text-sm/6 font-medium text-zinc-900"> 標籤 </span>

      <button
        class="hidden lg:flex items-center gap-1 text-sm rounded-md border border-zinc-300 bg-white px-3 py-1 text-zinc-900 transition-all duration-200 ease-in-out hover:bg-zinc-100 active:bg-zinc-200"
        @click="emit('open')"
      >
        + 新增標籤
      </button>
    </div>

    <div
      class="border border-zinc-300 rounded-md bg-white p-3 transition-all duration-200 ease-in-out focus-within:ring-4 focus-within:ring-zinc-100"
    >
      <div class="flex flex-wrap gap-2">
        <div
          v-for="tag in selectedTags"
          :key="tag.id"
          class="bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
        >
          {{ tag.name }}

          <button
            class="text-zinc-500 hover:text-zinc-900 transition-colors"
            @click="emit('remove', tag.id)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
