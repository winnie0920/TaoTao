<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title: string;
}>();

defineSlots<{
  default?: () => any;
  footer?: () => any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "submit"): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
  emit("update:modelValue", false);
};
</script>

<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-1">
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block"
        @click="close"
      ></div>

      <!-- 電腦版 -->
      <div class="hidden lg:flex items-center justify-center h-full">
        <div
          class="relative w-120 bg-white rounded-md border border-zinc-200 flex flex-col shadow-sm"
        >
          <!-- header -->
          <div
            class="flex items-center justify-between px-5 py-4 border-b border-zinc-200"
          >
            <div class="text-base font-semibold text-zinc-900">
              {{ title }}
            </div>

            <button
              class="text-zinc-400 hover:text-zinc-600 transition"
              @click="close"
            >
              ✕
            </button>
          </div>

          <!-- content -->
          <div class="flex-1 px-5 py-4">
            <slot />
          </div>

          <!-- footer -->
          <div
            class="flex justify-end gap-2 px-5 py-4 border-t border-zinc-200 bg-white"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
      <!-- 手機板 -->
      <div class="lg:hidden flex flex-col h-full bg-white">
        <!-- header -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-zinc-200"
        >
          <div class="text-base font-semibold text-zinc-900">
            {{ title }}
          </div>
        </div>
        <!-- content -->
        <div class="flex-1 overflow-y-auto px-4 py-4">
          <slot />
        </div>
        <!-- footer -->
        <div class="border-t border-zinc-200 px-4 py-3 flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>
