import { defineStore } from "pinia";

type ModalMode = "create" | "view" | "edit" | null;
type FormStep = "form" | "tag" | "review" | null; // 切換彈窗頁面

export const useModalStoreStore = defineStore("modal", {
  state: () => ({
    isOpen: false as boolean,
    mode: null as ModalMode,
    step: "form" as FormStep,
    title: "" as string,
  }),
  actions: {
    openModal(mode: ModalMode, payload?: any, title?: string) {
      this.mode = mode;
      this.step = "form";
      this.title = title ?? "";
      this.isOpen = true;
    },
    changeStep(step: FormStep) {
      this.step = step;
    },
    changeTitle(title: string) {
      this.title = title;
    },
    resetStep() {
      this.step = "form";
    },
    close() {
      this.isOpen = false;
      this.mode = null;
      this.step = "form";
      this.title = "";
    },
  },
});
