<script setup lang="ts">
import type { Field } from "@/types";

defineProps<{
  form: any; // 接收外層表單資料（所有 input / select 的資料來源）
  schema: Field[]; // 動態表單結構（決定要渲染哪些欄位）
  selectedTags: any[]; // 已選擇的 tag 清單（顯示用，不直接改）
}>();

const emit = defineEmits<{
  (e: "update:form", val: any): void; // 將表單更新往上傳遞
  (e: "open-tags"): void; // 通知父層打開 tag 選擇頁
  (e: "remove-tag", id: number): void; // 通知父層移除某個 tag
}>();
</script>
<template>
  <div class="space-y-5">
    <FormRenderer
      :modelValue="form"
      @update:modelValue="(val) => emit('update:form', val)"
      :schema="schema"
    />
    <!-- TAG -->
    <TagSection
      :selectedTags="selectedTags"
      @open="emit('open-tags')"
      @remove="emit('remove-tag', $event)"
    />
  </div>
</template>
