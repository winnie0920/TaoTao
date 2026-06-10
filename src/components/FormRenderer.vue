<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import type { Field, Rule } from "@/types";

const props = defineProps<{
  modelValue: Record<string, any>;
  schema: Field[];
  rules?: Record<string, Rule[]>;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", val: Record<string, any>): void;
}>();

// 下拉選單
const openKey = ref<string | null>(null);

// 更新值
const update = (key: string, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
};

// 開關下拉選單
const toggle = (field: Field) => {
  const key = field.name;

  openKey.value = openKey.value === key ? null : key;
};

// 選擇 option
const selectOption = (key: string, value: string) => {
  update(key, value);
  openKey.value = null;
};

// label
const getLabel = (field: Field) => {
  const val = props.modelValue[field.name];
  return field.options?.find((o) => o.key === val)?.name || "請選擇";
};

// 點擊外面關閉彈窗
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (!target.closest(".dropdown-root")) {
    openKey.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div
      v-for="field in schema"
      :key="field.name"
      :class="field.col === 2 ? 'lg:col-span-2' : ''"
    >
      <label class="block text-sm font-medium text-zinc-900 mb-2">
        {{ field.label }}
      </label>

      <!-- INPUT -->
      <input
        v-if="field.type === 'input'"
        :value="modelValue[field.name]"
        @input="update(field.name, ($event.target as HTMLInputElement).value)"
        class="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
      />

      <!-- TEXTAREA -->
      <textarea
        v-else-if="field.type === 'textarea'"
        :value="modelValue[field.name]"
        @input="
          update(field.name, ($event.target as HTMLTextAreaElement).value)
        "
        class="resize-none h-32 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
      />

      <!-- SELECT -->
      <div v-else-if="field.type === 'select'" class="relative dropdown-root">
        <button
          type="button"
          @click="toggle(field)"
          class="w-full flex justify-between items-center rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 transition-all duration-200 hover:bg-zinc-50 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
        >
          <span>{{ getLabel(field) }}</span>
          <span class="text-zinc-400">▼</span>
        </button>

        <Transition name="dropdown">
          <ul
            v-if="openKey === field.name"
            class="absolute left-0 top-full mt-1 w-full max-h-40 overflow-auto rounded-md border border-zinc-200 bg-white shadow-sm z-50"
          >
            <li
              v-for="opt in field.options"
              :key="opt.key"
              @click="selectOption(field.name, opt.key)"
              class="cursor-pointer px-3 py-2 transition-all hover:bg-zinc-50 active:bg-zinc-100"
              :class="{
                'bg-zinc-100 text-zinc-900 font-medium':
                  modelValue[field.name] === opt.key,
              }"
            >
              {{ opt.name }}
            </li>
          </ul>
        </Transition>
      </div>
    </div>
  </div>
</template>
