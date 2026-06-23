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
    <LoadingSpinner v-if="loading" :size="4" color-class="text-gray-400" />
  </div>
</template>
