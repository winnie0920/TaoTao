import APITaos from "@/utils/request";
import { URL_USER, URL_DASHBOARD, URL_UPDATE } from "@/utils/constants.js";

// 取得文章列表
export const apiGetUserArticle = async (param: any) => {
  try {
    const res = await APITaos.getParams("", URL_USER, param);
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetUserArticle", e);
    return Promise.reject(e);
  }
};

// 取得個人資訊
export const apiGetUserDashboard = async () => {
  try {
    const res = await APITaos.getParams(URL_USER, URL_DASHBOARD, "");
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetUserArticle", e);
    return Promise.reject(e);
  }
};

// 更新個人資訊
export const apiUpdateUserDashboard = async (data: any) => {
  try {
    const res = await APITaos.postBody(
      URL_USER,
      URL_DASHBOARD + "/" + URL_UPDATE,
      data,
    );
    return res.data;
  } catch (e) {
    console.error("ERR! apiGetUserArticle", e);
    return Promise.reject(e);
  }
};
