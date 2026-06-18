<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import { useAlertStore } from "@/stores/alertStore";
import { apiPostImg } from "@/api/image.ts";
import { apiPostArticle } from "@/api/Article.ts";
import { isRequired, minLength, validate } from "@/utils/validators";
import { usePostTags } from "@/composables/usePostTags";
import type { Field, UploadImage } from "@/types";

const homeStore = useHomeStore();
const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

// 編輯彈窗
const initialForm = {
  title: "",
  content: "",
  countryId: 0 as number,
  categoryId: 0 as number,
  images: [] as UploadImage[],
  imageUrls: [] as string[],
  tags: [] as number[],
};
const form = ref(structuredClone(initialForm));

const rules = {
  title: [isRequired("標題必填")],
  content: [isRequired("內容必填"), minLength(10, "內容至少10字")],
  countryId: [isRequired("請選國家")],
  categoryId: [isRequired("請選分類")],
};

const schema = computed<Field[]>(() => [
  {
    type: "input",
    name: "title",
    label: "標題",
    placeholder: "輸入標題",
    col: 2,
  },
  {
    type: "select",
    name: "countryId",
    label: "國家",
    col: 1,
    options: homeStore.countries,
  },
  {
    type: "select",
    name: "categoryId",
    label: "分類",
    col: 1,
    options: homeStore.cateGories,
  },
  { type: "textarea", name: "content", label: "內容", col: 2 },
]);

const { selectedTags, toggleTag, removeTag } = usePostTags(form);

const next = () => {
  const errors = validate(form.value, rules);
  if (errors) {
    alertStore.pushMsg("error", Object.values(errors).join("\n"));
    return;
  }
  modalStore.changeStep("review");
};

const back = () => {
  modalStore.changeStep("form");
  modalStore.changeTitle("新增貼文");
};

const submit = async () => {
  try {
    if (form.value.images.length > 0) {
      const res = await apiPostImg(await getFormData(form.value.images));
      form.value.imageUrls = res.data;
    }
    const { images, ...submitForm } = form.value;
    const res = await apiPostArticle(submitForm);
    if (res.code == 200) alertStore.pushMsg("success", res.msg);
  } catch (e) {
    console.error(e);
  }
};

const getFormData = async (images: UploadImage[]) => {
  const formData = new FormData();
  images.forEach((img) => formData.append("files", img.file));
  return formData;
};

const step = computed(() => {
  if (modalStore.step === "review") return { text: "發佈", action: submit };
  if (modalStore.step === "form") return { text: "下一步", action: next };
  return null;
});

const handleClose = () => {
  form.value.images.forEach((img) => {
    if (img.preview) URL.revokeObjectURL(img.preview);
  });
  form.value = structuredClone(initialForm);
  modalStore.close();
};
</script>

<template>
  <ModelPopup
    v-show="modalStore.mode == 'create'"
    @close="modalStore.close"
    :title="modalStore.title"
    width="w-[480px]"
  >
    <!-- 表單欄位 -->
    <FormStep
      v-if="modalStore.step === 'form'"
      :form="form"
      :schema="schema"
      :selectedTags="selectedTags"
      @update:form="form = $event"
      @open-tags="
        (modalStore.changeStep('tag'), modalStore.changeTitle('新增標籤'))
      "
      @remove-tag="removeTag"
    />

    <!-- 選擇Tag -->
    <PostTagStep
      v-if="modalStore.step === 'tag'"
      :allTags="homeStore.tags"
      :form="form"
      @toggle="toggleTag"
    />
    <UploadImg v-if="modalStore.step === 'review'" v-model="form.images" />

    <template #footer>
      <div class="flex w-full items-center justify-between">
        <button
          v-if="modalStore.step !== 'tag'"
          class="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 active:scale-95 transition"
          @click="handleClose()"
        >
          取消
        </button>
        <div class="flex items-center gap-2 ml-auto">
          <button
            v-if="modalStore.step !== 'form'"
            class="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 active:scale-95 transition"
            @click="back"
          >
            {{ modalStore.step === "tag" ? "確認" : "上一步" }}
          </button>
          <button
            v-if="step"
            class="px-4 py-2 text-sm font-semibold rounded-md bg-zinc-900 text-white active:scale-95 transition"
            @click="step.action"
          >
            {{ step.text }}
          </button>
        </div>
      </div>
    </template>
  </ModelPopup>
</template>
