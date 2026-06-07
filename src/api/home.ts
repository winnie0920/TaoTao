import APITaos from "@/utils/request";
import { URL_COUNTRIES } from "@/utils/constants.js";

// 國家
export const apiCountries = async () => {
  try {
    const res = await APITaos.getParams("", URL_COUNTRIES);
    return res.data;
  } catch (e) {
    console.error("ERR! apiCountries", e);
    return Promise.reject(e);
  }
};
