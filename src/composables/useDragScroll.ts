import { ref } from "vue";

export function useDragScroll() {
  const container = ref<HTMLElement | null>(null);
  const isDown = ref(false);
  const startX = ref(0);
  const scrollLeft = ref(0);

  const startDrag = (e: MouseEvent): void => {
    if (!container.value) return;

    isDown.value = true;
    container.value.classList.add("cursor-grabbing");

    startX.value = e.pageX - container.value.offsetLeft;
    scrollLeft.value = container.value.scrollLeft;
  };

  const onDrag = (e: MouseEvent): void => {
    if (!isDown.value || !container.value) return;

    e.preventDefault();

    const x = e.pageX - container.value.offsetLeft;
    const walk = (x - startX.value) * 1.2;

    container.value.scrollLeft = scrollLeft.value - walk;
  };

  const stopDrag = (): void => {
    isDown.value = false;
    container.value?.classList.remove("cursor-grabbing");
  };

  return {
    container,
    startDrag,
    onDrag,
    stopDrag,
  };
}
