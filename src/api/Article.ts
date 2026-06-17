import APITaos from "@/utils/request";
import { URL_ARTICLE, URL_LIKE } from "@/utils/constants.js";

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

//取得文章列表
export const apiGetArticle = async (param: any) => {
  try {
    const res = await APITaos.getParams("", URL_ARTICLE, param);
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostArticle", e);
    return Promise.reject(e);
  }
};

//新增文章按讚、取消按讚
export const apiPostArticleLike = async (articleId: number) => {
  try {
    const res = await APITaos.postParams(URL_ARTICLE, URL_LIKE, {
      articleId: articleId,
    });
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostArticle", e);
    return Promise.reject(e);
  }
};
