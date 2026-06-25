const env = import.meta.env as any;
const { VITE_TAOTAO_TOKEN_KEY, VITE_TAOTAO_REFRESH_TOKEN_KEY } = env;
import type { ApiResponse, SaveTokenResponse } from "@/types";
function getToken(): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${VITE_TAOTAO_TOKEN_KEY}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return undefined;
}

function getRefreshToken(): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${VITE_TAOTAO_REFRESH_TOKEN_KEY}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }

  return undefined;
}

function saveToken(token: string, exp: string | number | Date): void {
  const expiredDate = new Date(exp);
  document.cookie = `${VITE_TAOTAO_TOKEN_KEY}=${token}; expires=${expiredDate.toUTCString()}; path=/`;
}

function saveRefreshToken(token: string, exp: string | number | Date): void {
  const expiredDate = new Date(exp);
  document.cookie = `${VITE_TAOTAO_REFRESH_TOKEN_KEY}=${token}; expires=${expiredDate.toUTCString()}; path=/`;
}

function saveAllToken(res: ApiResponse<SaveTokenResponse>): void {
  const { access_token, expired_date, refresh_token, expired_dateR } = res.data;
  saveToken(access_token, expired_date);
  saveRefreshToken(refresh_token, expired_dateR);
}

function removeToken(): void {
  document.cookie = `${VITE_TAOTAO_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function removeRefreshToken(): void {
  document.cookie = `${VITE_TAOTAO_REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function removeAllToken(): void {
  removeToken();
  removeRefreshToken();
}

function setCookie(name: string, value: string, days: number): void {
  const expiredDate = new Date(Date.now() + days * 86400000 + 8 * 3600000);
  document.cookie = `${name}=${value}; expires=${expiredDate.toUTCString()}; path=/;`;
}

function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return value ?? null;
    }
  }

  return null;
}

export default {
  getToken,
  getRefreshToken,
  saveRefreshToken,
  saveToken,
  saveAllToken,
  removeToken,
  removeRefreshToken,
  removeAllToken,
  setCookie,
  getCookie,
};
