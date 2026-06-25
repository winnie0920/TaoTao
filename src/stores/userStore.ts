import { defineStore } from "pinia";
import type { User } from "@/types";
import { apiGetUserDashboard } from "@/api/User";

// 確保這三個地方層級正確
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async initUserDashboard() {
      try {
        const { data } = await apiGetUserDashboard();
        this.user = data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
