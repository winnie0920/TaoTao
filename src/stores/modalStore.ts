import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStoreStore = defineStore("modalStore", () => {
  const isOpen = ref(false);
  const mode = ref<"create" | "edit">("create");

  const openCreate = () => {
    mode.value = "create";
    isOpen.value = true;
  };

  const openEdit = () => {
    mode.value = "edit";
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, mode, openCreate, openEdit, close };
});
