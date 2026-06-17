<script setup lang="ts">
import { useModalStoreStore } from "@/stores/modalStore";
const modalStore = useModalStoreStore();
const props = defineProps<{
  title?: string;
  width?: string;
}>();
defineSlots<{
  default?: () => any;
  footer?: () => any;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("close");
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="modalStore.mode"
      class="fixed inset-0 overflow-hidden h-full"
      :class="[modalStore.mode === 'view' ? 'z-50' : 'z-10']"
    >
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm hidden lg:block"
        @click="close"
      ></div>

      <!-- 電腦版 -->
      <div class="hidden lg:flex items-center justify-center h-full">
        <div
          class="relative bg-white rounded-md border flex flex-col shadow-sm h-[85vh]"
          :class="width"
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
          <div
            :class="[
              modalStore.mode === 'view'
                ? 'h-[85vh] flex flex-col overflow-hidden'
                : 'flex-1 min-h-0 overflow-y-auto px-5 py-4',
            ]"
          >
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
      <div class="lg:hidden flex flex-col h-dvh bg-white">
        <!-- header -->
        <div
          class="flex items-center justify-between px-4 py-3 border-b border-zinc-200"
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
        <div class="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
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
