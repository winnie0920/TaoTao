<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
  hasMore: boolean;
}>();

const emit = defineEmits<{
  (e: "loadMore"): void;
}>();

const root = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    if (entry.isIntersecting && props.hasMore && !props.loading) {
      emit("loadMore");
    }
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="root" class="col-span-full flex justify-center py-6">
    <svg
      v-if="loading"
      class="animate-spin h-5 w-5 text-gray-400"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        class="opacity-25"
      />
      <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  </div>
</template>
