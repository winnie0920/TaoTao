import APITaos from "@/utils/request";
import { URL_COUNTRIES, URL_CATEGORIES } from "@/utils/constants.js";

// 取得國家列表
export const apiCountries = async () => {
  try {
    const res = await APITaos.getParams("", URL_COUNTRIES);
    return res.data;
  } catch (e) {
    console.error("ERR! apiCountries", e);
    return Promise.reject(e);
  }
};

// 取得分類列表
export const apiCategories = async () => {
  try {
    const res = await APITaos.getParams("", URL_CATEGORIES);
    return res.data;
  } catch (e) {
    console.error("ERR! apiCountries", e);
    return Promise.reject(e);
  }
};
