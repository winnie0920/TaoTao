<script setup lang="ts">
interface Props {
  iconName: string;
  iconStyle?: Record<string, string>;
}

const props = withDefaults(defineProps<Props>(), {
  iconStyle: () => ({
    fill: "currentColor",
  }),
});

const iconName = computed<string>(() => {
  return `#icon-${props.iconName}`;
});
</script>

<template>
  <svg :style="iconStyle" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
