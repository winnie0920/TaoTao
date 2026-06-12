import { defineStore } from "pinia";

import type { Country, Categories, Tags } from "@/types";
import { apiGetCountries, apiGetCategories, apiGetTags } from "@/api/home";
export const useHomeStore = defineStore("home", {
  state: () => ({
    countries: [] as Country[],
    cateGories: [] as Categories[],
    tags: [] as Tags[],
  }),

  getters: {
    countryName: (state) => (key: string) =>
      state.countries.find((c) => c.key === key)?.name ?? "",
  },

  actions: {
    async initCountries() {
      try {
        const res = await apiGetCountries();
        this.countries = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async initCategories() {
      try {
        const res = await apiGetCategories();
        this.cateGories = res.data;
      } catch (e) {
        console.error(e);
      }
    },
    async initTags() {
      try {
        const res = await apiGetTags();
        this.tags = res.data;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
