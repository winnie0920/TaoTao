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
      <label
        v-for="tag in allTags"
        :key="tag.id"
        class="flex items-center justify-between px-4 py-3 border-b border-zinc-100 cursor-pointer transition-colors duration-150 hover:bg-zinc-50 active:bg-zinc-100"
        @click="emit('toggle', tag.id)"
      >
        <span class="text-sm text-zinc-900">
          {{ tag.name }}
        </span>

        <div
          class="w-4 h-4 border border-zinc-400 rounded flex items-center justify-center transition-all duration-200"
          :class="
            form.tags.includes(tag.id) ? 'bg-zinc-600 border-zinc-600' : ''
          "
        >
          <svg
            class="w-3 h-3 text-white transition-all duration-200"
            :class="
              form.tags.includes(tag.id)
                ? 'scale-100 opacity-100'
                : 'scale-0 opacity-0'
            "
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.2 7.2a1 1 0 01-1.4 0L3.3 9.1a1 1 0 011.4-1.4l3.1 3.1 6.5-6.5a1 1 0 011.4 0z"
            />
          </svg>
        </div>
      </label>
    </div>
  </div>
</template>
