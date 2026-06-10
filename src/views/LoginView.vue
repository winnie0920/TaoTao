<script setup lang="ts">
import router from "@/router";
import type { LoginForm } from "@/types";
import { useAlertStore } from "@/stores/alertStore";
import { apiAuthenticate } from "@/api/login.js";
import { isRequired, isEmail, minLength, validate } from "@/utils/validators";

const alertStore = useAlertStore();
const loginForm = reactive<LoginForm>({
  email: "",
  password: "",
});

const registerRules = {
  email: [isRequired("請輸入電子郵件"), isEmail("電子郵件格式不正確")],
  password: [isRequired("請輸入密碼"), minLength(6, "密碼至少 6 碼")],
};

const goLogin = async () => {
  const errors = validate(loginForm, registerRules);
  if (errors) {
    const msg = Object.values(errors).join("\n");
    alertStore.pushMsg("error", msg);
    return;
  }
  try {
    const res = await apiAuthenticate({ ...loginForm });
    if (!res) return;
    if (res.code == 200) {
      alertStore.pushMsg("success", res.msg);
    }
    router.push({ name: "UserWebs" });
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div
    class="h-screen flex items-center flex-1 flex-col justify-center bg-white"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
      <SvgIcon icon-name="LOGO" class="h-8 w-8" />

      <h2
        class="mt-4 text-center text-2xl font-bold tracking-tight text-zinc-900"
      >
        TaoTao
      </h2>
    </div>

    <div class="mt-10 mx-auto w-full max-w-sm px-6">
      <form class="space-y-6" @submit.prevent>
        <div>
          <label for="email" class="block text-sm/6 font-medium text-zinc-900"
            >電子郵件</label
          >
          <div class="mt-2">
            <input
              name="email"
              autocomplete="email"
              placeholder="請輸入電子郵件"
              v-model.trim="loginForm.email"
              class="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label
              for="password"
              class="block text-sm/6 font-medium text-zinc-900"
              >密碼</label
            >
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-zinc-600 hover:text-zinc-500 transition-all"
                >忘記密碼?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              v-model.trim="loginForm.password"
              autocomplete="current-password"
              placeholder="請輸入密碼"
              class="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-dark-gray px-3 py-1.5 text-sm/6 font-semibold transition-all text-white shadow-xs hover:bg-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-600"
            @click="goLogin"
          >
            登入
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-zinc-500">
        還沒有電子郵件嗎?
        <router-link
          to="/register"
          class="font-semibold text-zinc-600 hover:text-zinc-500 transition-all"
        >
          註冊
        </router-link>
      </p>
    </div>
  </div>
</template>
