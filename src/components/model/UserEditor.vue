<script setup lang="ts">
import { useHomeStore } from "@/stores/homeStore";
import { useModalStore } from "@/stores/modalStore";
import { useAlertStore } from "@/stores/alertStore";
import { useUserStore } from "@/stores/userStore";

import { apiPostImg } from "@/api/image.ts";
import { apiUpdateUserDashboard } from "@/api/User.ts";
import { isImageUploaded, isRequired, validate } from "@/utils/validators";
import type { Field, UploadImage } from "@/types";

const homeStore = useHomeStore();
const modalStore = useModalStore();
const alertStore = useAlertStore();
const userStore = useUserStore();

// 編輯彈窗
const initialForm = {
  nickname: "",
  intro: "",
  images: [] as UploadImage[],
  imageUrl: "",
};
const form = ref(structuredClone(initialForm));

const rules = {
  nickname: [isRequired("暱稱必填")],
  images: [isImageUploaded("請上傳一張頭貼")],
};

const schema = computed<Field[]>(() => [
  {
    type: "input",
    name: "nickname",
    label: "暱稱",
    placeholder: "請輸入暱稱",
    col: 2,
  },
  {
    type: "textarea",
    name: "intro",
    label: "自我簡介",
    placeholder: "請輸入自我簡介",
    col: 2,
  },
]);

const submit = async () => {
  const errors = validate(form.value, rules);
  if (errors) {
    alertStore.pushMsg("error", Object.values(errors).join("\n"));
    return;
  }
  try {
    const hasNewFile = form.value.images.some(
      (img) => img.file instanceof File,
    );
    if (hasNewFile) {
      const res = await apiPostImg(await getFormData(form.value.images));
      form.value.imageUrl = res.data[0];
    }
    const { images, ...submitForm } = form.value;
    const res = await apiUpdateUserDashboard(submitForm);
    if (res.code == 200) {
      alertStore.pushMsg("success", res.msg);
      handleClose();
      homeStore.initUserArticles(true);
      userStore.initUserDashboard();
    }
  } catch (e) {
    console.error(e);
  }
};

const getFormData = async (images: UploadImage[]) => {
  const formData = new FormData();
  images.forEach((img) => formData.append("files", img.file));
  return formData;
};

const handleClose = () => {
  form.value.images.forEach((img) => {
    if (img.preview) URL.revokeObjectURL(img.preview);
  });
  form.value = structuredClone(initialForm);
  modalStore.close();
};

watch(
  () => modalStore.mode,
  async (mode) => {
    if (mode === "userEdit" && userStore.user) {
      const user = userStore.user;
      form.value.nickname = user.nickname;
      form.value.intro = user.intro;
      if (user.imageUrl?.length > 0) {
        form.value.imageUrl = user.imageUrl;
        form.value.images = [
          {
            file: null as any,
            preview: user.imageUrl,
          },
        ];
      }
    }
  },
  { immediate: true },
);
</script>
<template>
  <ModelPopup
    v-show="modalStore.mode == 'userEdit'"
    @close="handleClose()"
    :title="modalStore.title"
    width="w-[480px]"
  >
    <div class="flex justify-center mb-6">
      <UploadImg
        content="請上傳頭貼"
        v-model="form.images"
        :isAvatar="true"
        :limit="1"
        class="w-48 h-48 md:w-64 md:h-64 aspect-square rounded-full"
      />
    </div>
    <!-- 表單欄位 -->
    <FormRenderer v-model="form" :schema="schema" />

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <button
          class="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 active:scale-95 transition"
          @click="handleClose()"
        >
          取消
        </button>
        <button
          class="px-4 py-2 text-sm font-semibold rounded-md bg-zinc-900 text-white active:scale-95 transition"
          @click="submit"
        >
          確認
        </button>
      </div>
    </template>
  </ModelPopup>
</template>
