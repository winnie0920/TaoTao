<script setup lang="ts">
import { watch } from "vue";
import { useAlertStore } from "@/stores/alertStore";

const alertStore = useAlertStore();

let countdown: ReturnType<typeof setInterval> | null = null;

const updateCountdown = (): void => {
  if (alertStore.messages.length <= 0) {
    if (countdown) {
      clearInterval(countdown);
      countdown = null;
    }
    return;
  }

  alertStore.messages = alertStore.messages.filter((item) => {
    item.time -= 1;
    return item.time > 0;
  });
};

watch(
  () => alertStore.messages.length,
  (val: number) => {
    if (val > 0 && !countdown) {
      countdown = setInterval(updateCountdown, 1000);
    }

    if (val === 0 && countdown) {
      clearInterval(countdown);
      countdown = null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <transition-group
    tag="div"
    name="move-up"
    class="absolute top-16 left-1/2 flex -translate-x-1/2 flex-col items-center gap-6"
  >
    <div
      v-for="(item, index) in alertStore.messages"
      :key="index"
      :class="item.class"
      class="flex items-center gap-4 rounded-2xl border px-6 py-4 shadow-[0_0_10px_rgba(0,0,0,0.2)] backdrop-blur-md transition-all duration-300"
    >
      <SvgIcon :icon-name="item.icon" class="h-8 w-8 shrink-0" />

      <p class="text-[1.2rem] text-justify whitespace-pre-line">
        {{ item.msg }}
      </p>
    </div>
  </transition-group>
</template>

<style scoped>
.move-up-enter-active,
.move-up-leave-active {
  transition: all 0.35s ease;
}

.move-up-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.move-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.move-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.move-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.move-up-move {
  transition: transform 0.35s ease;
}
</style>
