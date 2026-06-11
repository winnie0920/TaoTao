import type { Rule } from "@/types";
//驗證條件
export const isRequired =
  (msg: string) =>
  (v: unknown): true | string => {
    if (typeof v === "string") {
      return v.trim().length > 0 || msg;
    }
    if (typeof v === "number") {
      return v !== null && v !== undefined ? true : msg;
    }
    if (Array.isArray(v)) {
      return v.length > 0 || msg;
    }
    return !!v || msg;
  };

export const isEmail = (msg: string) => (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || msg;

export const minLength = (len: number, msg: string) => (v: string) =>
  v.length >= len || msg || `至少 ${len} 碼`;

export const isPhone = (msg: string) => (v: string) =>
  /^09\d{8}$/.test(v.replace(/[\s()-]/g, "")) ||
  /^0[2-8]\d{7,8}$/.test(v.replace(/[\s()-]/g, "")) ||
  msg;

// 驗證程式碼

export const validate = (
  form: Record<string, any>,
  rules: Record<string, Rule[]>,
) => {
  const errors: Record<string, string> = {};

  for (const key in rules) {
    if (!rules[key]) continue;
    for (const rule of rules[key]) {
      const result = rule(form[key]);
      if (result !== true) {
        errors[key] = result;
        break;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
};
