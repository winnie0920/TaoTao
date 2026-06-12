import APITaos from "@/utils/request";
import {
  URL_COUNTRIES,
  URL_CATEGORIES,
  URL_ARTICLE,
  URL_TAGS,
} from "@/utils/constants.js";

// 取得國家列表
export const apiGetCountries = async () => {
  try {
    const res = await APITaos.getParams("", URL_COUNTRIES);
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetCountries", e);
    return Promise.reject(e);
  }
};

// 取得分類列表
export const apiGetCategories = async () => {
  try {
    const res = await APITaos.getParams("", URL_CATEGORIES);
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetCategories", e);
    return Promise.reject(e);
  }
};

// 取得標籤列表
export const apiGetTags = async () => {
  try {
    const res = await APITaos.getParams("", URL_TAGS);
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetTags", e);
    return Promise.reject(e);
  }
};

// 新增文章列表
export const apiPostArticle = async (data: any) => {
  try {
    const res = await APITaos.postBody("", URL_ARTICLE, data);
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostArticle", e);
    return Promise.reject(e);
  }
};
