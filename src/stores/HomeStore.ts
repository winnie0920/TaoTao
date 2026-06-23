import { defineStore } from "pinia";
import type {
  Country,
  Categories,
  Tags,
  Article,
  ArticlePage,
  Comment,
  ArticleFilter,
} from "@/types";
import { apiGetCountries, apiGetCategories, apiGetTags } from "@/api/home";
import {
  apiGetArticle,
  apiGetComment,
  apiGetFavoriteArticle,
} from "@/api/Article";

export const useHomeStore = defineStore("home", {
  state: () => ({
    countries: [] as Country[],
    cateGories: [] as Categories[],
    tags: [] as Tags[],

    articles: [] as Article[],
    selectedArticle: null as Article | null,
    comments: [] as Comment[],

    lastId: null as number | null,
    hasMore: true,
    loading: false,
    refreshing: false, // 重新搜尋專用
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
    // 取得文章
    async initArticles(
      reset = false,
      filter: ArticleFilter = {},
    ): Promise<void> {
      await this.fetchArticles(apiGetArticle, reset, {
        keyword: filter.keyword ?? null,
        categoryId: filter.categoryId ?? null,
        countryId: filter.countryId ?? null,
      });
    },

    // 取得收藏文章
    async initFavoriteArticles(
      reset = false,
      filter: ArticleFilter = {},
    ): Promise<void> {
      await this.fetchArticles(apiGetFavoriteArticle, reset, {
        keyword: filter.keyword ?? null,
        categoryId: filter.categoryId ?? null,
        countryId: filter.countryId ?? null,
      });
    },

    // 取得留言
    async initComment(articleId: number) {
      try {
        const { data } = await apiGetComment(articleId);
        this.comments = data;
        console.log(data);
      } catch (e) {
        console.error(e);
      }
    },

    // 清空文章狀態
    resetState(): void {
      this.articles = [];
      this.lastId = null;
      this.hasMore = true;
      this.refreshing = true;
    },

    async fetchArticles(
      apiFunc: (params: any) => Promise<any>,
      reset: boolean,
      params: any,
    ): Promise<void> {
      if (this.loading) return;
      if (reset) {
        this.resetState();
      } else {
        this.loading = true;
      }
      try {
        const res = await apiFunc({
          ...params,
          size: 10,
          lastId: reset ? null : this.lastId,
        });
        const data: ArticlePage = res.data;
        this.articles = reset ? data.list : [...this.articles, ...data.list];
        this.lastId = data.lastId;
        this.hasMore = data.hasMore;
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
        this.refreshing = false;
      }
    },
  },
});
