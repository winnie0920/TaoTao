import APITaos from "@/utils/request";
import JWT from "@/utils/cookies.js";
import {
  PER_AUTH,
  URL_AUTHENTICATE,
  URL_LOGOUT,
  URL_REFRESH_TOKEN,
  URL_REGISTER,
} from "@/utils/constants.js";

// 註冊
export const apiRegister = async (data: any) => {
  try {
    const res = await APITaos.postBody(PER_AUTH, URL_REGISTER, data);
    return res.data;
  } catch (e) {
    console.error("ERR! apiRegister", e);
    return Promise.reject(e);
  }
};

// 登入
export const apiAuthenticate = async (data: any) => {
  try {
    const res = await APITaos.postBody(PER_AUTH, URL_AUTHENTICATE, data);
    JWT.saveAllToken(res.data);
    return res.data;
  } catch (e) {
    console.error("ERR! apiAuthenticate", e);
    return Promise.reject(e);
  }
};

export const apiLogout = async () => {
  try {
    const res = await APITaos.postBody(PER_AUTH, URL_LOGOUT);
    return res.data;
  } catch (e) {
    console.error("ERR! apiLogout", e);
    return Promise.reject(e);
  }
};

// token 換發
export const apiRefreshToken = async () => {
  const refreshToken = JWT.getRefreshToken();
  // 沒 refresh token 才直接退出
  if (!refreshToken) return;
  try {
    const res = await APITaos.postRefresh(
      PER_AUTH,
      URL_REFRESH_TOKEN,
      refreshToken,
    );
    JWT.saveAllToken(res.data);
    return res.data;
  } catch (e) {
    console.error("ERR! apiRefreshToken", e);
    JWT.removeAllToken();
    return null;
  }
};
