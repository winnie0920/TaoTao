import { defineStore } from "pinia";

import type { Button, ConfirmData, Message } from "@/types";
import { alertConfig } from "@/config/alert";

export const useAlertStore = defineStore("alert", {
  state: (): {
    confirmData: ConfirmData;
    messages: Message[];
  } => {
    return {
      confirmData: {
        title: "",
        content: "",
        buttons: [{ name: "", style: "", cb: null }],
      },
      messages: [],
    };
  },

  getters: {},

  actions: {
    /**
     * 設定確認彈窗
     */
    setConfirm(title: string, content: string, ...buttons: Button[]) {
      this.confirmData = { title, content, buttons };
    },

    /**
     * 清除確認彈窗
     */
    clearConfirm() {
      this.confirmData = {
        title: "",
        content: "",
        buttons: [{ name: "", style: "", cb: null }],
      };
    },

    /**
     * 增加快閃通知
     */
    pushMsg(type: "success" | "error" | "warning" | "info", msg: string) {
      const cfg = alertConfig[type];
      const existed = this.messages.find((item) => msg === item.msg);
      if (!existed) {
        this.messages.push({
          type,
          icon: cfg.icon,
          class: cfg.class,
          msg,
          time: 3,
        });
      }
    },
  },
});
