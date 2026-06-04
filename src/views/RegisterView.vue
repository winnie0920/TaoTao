<script setup lang="ts">
import router from "@/router";
import type { RegisterForm } from "@/types/auth";
import { useAlertStore } from "@/stores/alertStore";
import { apiRegister } from "@/api/login.js";
import {
  isRequired,
  isEmail,
  minLength,
  isPhone,
  validate,
} from "@/utils/validators";
const alertStore = useAlertStore();

const registerRules = {
  firstname: [isRequired("請輸入姓氏")],
  lastname: [isRequired("請輸入名字")],
  email: [isRequired("請輸入電子郵件"), isEmail("電子郵件格式不正確")],
  password: [isRequired("請輸入密碼"), minLength(6, "密碼至少 6 碼")],
  phone: [isRequired("請輸入電話"), isPhone("手機需為 09 開頭 10 碼")],
};

const registerForm = reactive<RegisterForm>({
  email: "",
  password: "",
  firstname: "",
  lastname: "",
  phone: "",
  role: "USER",
});

const goRegister = async () => {
  const errors = validate(registerForm, registerRules);
  if (errors) {
    const msg = Object.values(errors).join("\n");

    alertStore.pushMsg("error", msg);
    return;
  }
  try {
    const res = await apiRegister({ ...registerForm });
    if (!res) return;
    if (res.code == 200) {
      alertStore.pushMsg("success", res.msg);
    }
    router.push({ name: "Login" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div
    class="h-screen flex items-center flex-1 flex-col justify-center bg-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-lg">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=zinc&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-zinc-900"
      >
        TaoTao
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
      <form class="grid grid-cols-1 gap-6" @submit.prevent="goRegister">
        <div class="grid grid-cols-12 gap-6">
          <!-- 姓氏（內部分欄） -->
          <div class="col-span-4">
            <label class="block text-sm/6 font-medium text-zinc-900"
              >姓氏</label
            >
            <input
              class="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
              v-model="registerForm.firstname"
              type="firstname"
              name="firstname"
              autocomplete="current-firstname"
              placeholder="請輸入姓氏"
            />
          </div>
          <!-- 名字（內部分欄） -->
          <div class="col-span-8">
            <label class="block text-sm/6 font-medium text-zinc-900"
              >名字</label
            >
            <input
              class="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
              v-model="registerForm.lastname"
              type="lastname"
              name="lastname"
              autocomplete="current-lastname"
              placeholder="請輸入名字"
            />
          </div>
        </div>

        <!-- 電子郵件 -->
        <div class="grid grid-cols-1">
          <div>
            <label class="block text-sm/6 font-medium text-zinc-900"
              >電子郵件</label
            >
            <input
              class="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
              v-model="registerForm.email"
              type="email"
              name="email"
              autocomplete="current-email"
              placeholder="請輸入電子郵件"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <!-- 密碼 -->
          <div>
            <label class="block text-sm/6 font-medium text-zinc-900"
              >密碼</label
            >
            <input
              class="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
              v-model="registerForm.password"
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder="請輸入密碼"
            />
          </div>

          <!-- 電話 -->
          <div>
            <label class="block text-sm/6 font-medium text-zinc-900"
              >電話</label
            >
            <input
              type="phone"
              name="phone"
              autocomplete="current-phone"
              placeholder="請輸入電話"
              class="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
              v-model="registerForm.phone"
            />
          </div>
        </div>
        <!-- 按鈕 -->
        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-dark-gray px-3 py-1.5 text-sm/6 font-semibold transition-all text-white shadow-xs hover:bg-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
          >
            註冊
          </button>
        </div>
      </form>
      <p class="mt-10 text-center text-sm/6 text-zinc-500">
        已經有電子郵件了嗎?
        <router-link
          to="/login"
          class="font-semibold text-zinc-600 hover:text-zinc-500 transition-all"
        >
          登入
        </router-link>
      </p>
    </div>
  </div>
</template>
