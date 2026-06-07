<script setup lang="ts">
export interface Country {
  key: string;
  name: string;
  icon: string;
}

const props = defineProps<{
  countries: Country[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const selectCountry = (key: string) => {
  emit("update:modelValue", key);
};
</script>

<template>
  <div class="overflow-x-auto no-scrollbar">
    <div class="flex gap-6 w-max px-2">
      <button
        v-for="c in countries"
        :key="c.key"
        @click="selectCountry(c.key)"
        class="flex flex-col items-center shrink-0 transition"
        :class="modelValue === c.key ? 'text-black scale-110' : 'text-gray-400'"
      >
        <SvgIcon :icon-name="c.icon" class="w-8 h-8" />
        <p class="text-xs mt-1">{{ c.name }}</p>
      </button>
    </div>
  </div>
</template>
