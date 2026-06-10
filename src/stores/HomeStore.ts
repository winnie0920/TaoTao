import { defineStore } from "pinia";

import type { Country, Categories } from "@/types";
import { apiCountries, apiCategories } from "@/api/home";
export const useHomeStore = defineStore("home", {
  state: () => ({
    countries: [] as Country[],
    cateGories: [] as Categories[],
  }),

  getters: {
    countryName: (state) => (key: string) =>
      state.countries.find((c) => c.key === key)?.name ?? "",
  },

  actions: {
    async initCountries() {
      try {
        const res = await apiCountries();
        this.countries = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async initCategories() {
      try {
        const res = await apiCategories();
        this.cateGories = res.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
