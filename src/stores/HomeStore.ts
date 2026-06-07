import { defineStore } from "pinia";

import type { Country } from "@/types";
import { apiCountries } from "@/api/home";
export const useHomeStore = defineStore("home", {
  state: () => ({
    countries: [] as Country[],
    selected: "" as string,
    loading: false,
    loaded: false,
  }),

  getters: {
    countryName: (state) => (key: string) =>
      state.countries.find((c) => c.key === key)?.name ?? "",
  },

  actions: {
    async initCountries() {
      if (this.loaded) return;
      this.loading = true;
      try {
        const res = await apiCountries();
        this.countries = res.data;
        this.loaded = true;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    setSelect(key: string) {
      this.selected = key;
    },
  },
});
