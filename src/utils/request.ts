import axios from "axios";
import router from "@/router";
import type {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import JWT from "@/utils/cookies.js";
import {
  PER_AUTH,
  URL_AUTHENTICATE,
  URL_REGISTER,
  URL_LOGOUT,
} from "@/utils/constants.js";
import type { ApiResponse } from "@/types";
import { apiRefreshToken } from "@/api/login.js";
import { useAlertStore } from "@/stores/alertStore";

// 取消請求
let cancelReq = new AbortController();
const routeDispatch = (url?: string, slug?: string, dispatch?: string) => {
  let URI = "";
  if (url) URI = `${url}`;
  if (slug) URI = `${URI}/${slug}`;

  return dispatch ? `${dispatch}/${URI}` : `${URI}`;
};

const axiosConfig = {
  baseURL: import.meta.env.VITE_TAOTAO_API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
    pragma: "no-cache",
    "cache-control": "no-cache",
  },
};

const AxiosTao: AxiosInstance = axios.create(axiosConfig);
const AxiosRefresh: AxiosInstance = axios.create(axiosConfig);
// 不需要攜帶Token的URL
const noNeedTokenUrls = [
  routeDispatch(PER_AUTH, URL_AUTHENTICATE),
  routeDispatch(PER_AUTH, URL_REGISTER),
];

// 請求攔截器
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
AxiosTao.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (noNeedTokenUrls.includes(config.url ?? "")) return config;
    let token: string | null = JWT.getToken() ?? null;
    if (!token) {
      if (!isRefreshing) {
        isRefreshing = true;
        // 建立一個刷新任務
        refreshPromise = apiRefreshToken()
          .then(() => {
            isRefreshing = false;
            return JWT.getToken()!;
          })
          .catch((e) => {
            isRefreshing = false;
            router.push({ name: "Login" });
            throw e;
          });
      }
      token = await refreshPromise;
    }

    config.headers.set("Authorization", `Bearer ${token}`);
    return config;
  },
);

// 響應攔截器
AxiosTao.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const alertStore = useAlertStore();

    const { code, msg } = response.data;

    // 抛出意外錯誤 Http200 -> code!==200
    if (code < 200 || code >= 300) {
      alertStore.pushMsg("error", msg || "操作失敗，請稍後再試！");
      return Promise.reject(response.data);
    }

    return response;
  },
  (error) => {
    const alertStore = useAlertStore();

    const code = error?.response?.data?.code;
    const msg = error?.response?.data?.msg;

    switch (code) {
      case 9004:
        JWT.removeAllToken();
        alertStore.pushMsg("error", "令牌過期，請重新登入！");
        router.push({ name: "Login" });
        break;

      default:
        alertStore.pushMsg("error", msg || "發生未知錯誤");
        break;
    }

    return Promise.reject(error);
  },
);

const APITaos = {
  getParams(url: string, slug?: string, params?: any) {
    return AxiosTao.get(routeDispatch(url, slug), {
      params,
      signal: cancelReq.signal,
    });
  },

  postBody(url: string, slug?: string, data?: any) {
    return AxiosTao.post(routeDispatch(url, slug), data, {
      signal: cancelReq.signal,
    });
  },

  postParams(url: string, slug?: string, params?: any) {
    return AxiosTao.post(routeDispatch(url, slug), null, {
      params,
      signal: cancelReq.signal,
    });
  },

  postForm(url: string, slug?: string, data?: any) {
    return AxiosTao.post(routeDispatch(url, slug), data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      signal: cancelReq.signal,
    });
  },

  patchBody(url: string, slug?: string, data?: any) {
    return AxiosTao.patch(routeDispatch(url, slug), data, {
      signal: cancelReq.signal,
    });
  },

  delete(url: string, slug?: string, params?: any) {
    return AxiosTao.delete(routeDispatch(url, slug), {
      params,
      signal: cancelReq.signal,
    });
  },

  postRefresh(url: string, slug: string, refreshToken: string) {
    return AxiosRefresh.post(routeDispatch(url, slug), null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
  },
};

export default APITaos;
