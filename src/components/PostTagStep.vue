<script setup lang="ts">
defineProps<{
  allTags: any[];
  form: any;
}>();

const emit = defineEmits<{
  (e: "toggle", id: number): void;
}>();
</script>

<template>
  <div class="flex flex-col h-full bg-white rounded-md overflow-hidden">
    <div class="flex-1 overflow-y-auto scrollbar-thin">
      <div
        v-for="tag in allTags"
        :key="tag.id"
        class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 cursor-pointer transition-colors duration-150 hover:bg-zinc-50 active:bg-zinc-100"
        @click="emit('toggle', tag.id)"
      >
        <span class="text-sm text-zinc-900">
          {{ tag.name }}
        </span>

        <input
          type="checkbox"
          :checked="form.tags.includes(tag.id)"
          readonly
          class="w-4 h-4 accent-zinc-900 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
