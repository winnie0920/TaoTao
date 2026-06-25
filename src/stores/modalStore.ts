import { defineStore } from "pinia";

type ModalMode = "articleCreate" | "articleView" | "edit" | "userEdit" | null;
type FormStep = "form" | "tag" | "review" | null; // 切換彈窗頁面

export const useModalStore = defineStore("modal", {
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
      window.history.pushState({ modalOpen: true }, "");
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
      if (window.history.state?.modalOpen) {
        window.history.back();
      }
    },
  },
});
