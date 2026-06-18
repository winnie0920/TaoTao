import { defineStore } from "pinia";
import type { Country, Categories, Tags, Article, ArticlePage } from "@/types";
import { apiGetCountries, apiGetCategories, apiGetTags } from "@/api/home";
import { apiGetArticle } from "@/api/Article";

export const useHomeStore = defineStore("home", {
  state: () => ({
    countries: [] as Country[],
    cateGories: [] as Categories[],
    tags: [] as Tags[],

    articles: [] as Article[],
    selectedArticle: null as Article | null,

    lastId: null as number | null,
    hasMore: true,
    loading: false,
  }),

  getters: {
    countryName: (state) => (id: number) =>
      state.countries.find((c) => c.id === id)?.name ?? "",
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

    async initArticles(
      reset = false,
      filter: {
        keyword?: string;
        categoryId?: number;
        countryId?: number;
      } = {},
    ) {
      this.loading = true;
      try {
        const params = {
          size: 10,
          lastId: reset ? null : this.lastId,
          keyword: filter.keyword || null,
          categoryId: filter.categoryId || null,
          countryId: filter.countryId || null,
        };

        // 這裡直接把物件傳給 API
        const res = await apiGetArticle(params);
        const data: ArticlePage = res.data;

        if (reset) {
          this.articles = data.list;
        } else {
          this.articles.push(...data.list);
        }

        this.lastId = data.lastId;
        this.hasMore = data.hasMore;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async refreshArticles() {
      this.lastId = null;
      this.hasMore = true;
      await this.initArticles(true);
    },
  },
});
