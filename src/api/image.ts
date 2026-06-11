import APITaos from "@/utils/request";
import { URL_UPLOAD } from "@/utils/constants.js";

export const apiPostImg = async (body: any) => {
  try {
    const res = await APITaos.postForm("", URL_UPLOAD, body);
    return res.data;
  } catch (e) {
    console.error("ERR! apiAuthenticate", e);
    return Promise.reject(e);
  }
};

export const apiDelImg = async (imageUrl: string) => {
  try {
    const res = await APITaos.postParams("", "delete", { imageUrl });
    return res.data;
  } catch (e) {
    console.error("ERR! apiAuthenticate", e);
    return Promise.reject(e);
  }
};
