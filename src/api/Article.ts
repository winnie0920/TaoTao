import APITaos from "@/utils/request";
import {
  URL_ARTICLE,
  URL_LIKE,
  URL_FAVORITE,
  URL_COMMENT,
} from "@/utils/constants.js";

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

// 新增文章按讚、取消按讚
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

// 新增文章按讚、取消按讚
export const apiPostFavoriteLike = async (articleId: number) => {
  try {
    const res = await APITaos.postParams(URL_ARTICLE, URL_FAVORITE, {
      articleId: articleId,
    });
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostFavoriteLike", e);
    return Promise.reject(e);
  }
};

// 取得留言
export const apiGetComment = async (articleId: number) => {
  try {
    const res = await APITaos.getParams(URL_ARTICLE, URL_COMMENT, {
      articleId,
    });
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostArticle", e);
    return Promise.reject(e);
  }
};

// 新增留言
export const apiPostComment = async (data: any) => {
  try {
    const res = await APITaos.postBody(URL_ARTICLE, URL_COMMENT, data);
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostComment", e);
    return Promise.reject(e);
  }
};

// 刪除留言
export const apiDeleteComment = async (id: number) => {
  try {
    const res = await APITaos.delete(URL_ARTICLE, `${URL_COMMENT}/${id}`, null);
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostComment", e);
    return Promise.reject(e);
  }
};

export const apiPostCommentLike = async (id: number) => {
  try {
    const res = await APITaos.postParams(
      URL_ARTICLE + "/" + URL_COMMENT,
      URL_LIKE,
      { id },
    );
    return res.data;
  } catch (e) {
    console.error("ERR! apiPostCommentLike", e);
    return Promise.reject(e);
  }
};
