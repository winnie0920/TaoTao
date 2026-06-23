<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number; // 預設大小
    colorClass?: string; // 預設顏色
  }>(),
  {
    size: 8,
    colorClass: "text-gray-500",
  },
);
</script>

<template>
  <div class="flex justify-center items-center">
    <svg
      class="animate-spin text-gray-500"
      :class="[`h-${size} w-${size}`, colorClass]"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        fill="none"
      />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
