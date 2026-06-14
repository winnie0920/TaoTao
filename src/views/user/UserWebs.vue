<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import { useAlertStore } from "@/stores/alertStore";
import { apiPostImg } from "@/api/image.ts";
import { apiPostArticle } from "@/api/home.ts";
import { isRequired, minLength, validate } from "@/utils/validators";
import { usePostTags } from "@/composables/usePostTags";
import type { Field, UploadImage } from "@/types";

const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();
const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

// 初始from
const initialForm = {
  title: "",
  content: "",
  countryId: 0 as number,
  categoryId: 0 as number,
  images: [] as UploadImage[],
  imageUrls: [] as string[],
  tags: [] as number[],
};
// 複製一份來填寫內容
const form = ref(structuredClone(initialForm));

// 下一步
const next = () => {
  const errors = validate(form.value, rules);
  if (errors) {
    const msg = Object.values(errors).join("\n");
    alertStore.pushMsg("error", msg);
    return;
  }
  modalStore.changeStep("review");
};

// 上一步
const back = () => {
  if (modalStore.step == "review" || "tag") {
    modalStore.changeStep("form");
    modalStore.changeTitle("新增貼文");
  }
};

// 步驟
const step = computed(() => {
  if (modalStore.step === "review") {
    return {
      text: "發佈",
      action: submit,
    };
  }
  if (modalStore.step === "form") {
    return {
      text: "下一步",
      action: next,
    };
  }
});
// 欄位設定
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
  {
    type: "textarea",
    name: "content",
    label: "內容",
    col: 2,
  },
]);

// 設定驗證
const rules = {
  title: [isRequired("標題必填")],
  content: [isRequired("內容必填"), minLength(10, "內容至少10字")],
  countryId: [isRequired("請選國家")],
  categoryId: [isRequired("請選分類")],
};

const { selectedTags, toggleTag, removeTag } = usePostTags(form);

// 同步 URL 的 country query
const country = computed<string>({
  get: () => (route.query.country as string) ?? "",
  set: (val) => {
    router.replace({
      query: {
        ...route.query,
        country: val || null,
      },
    });
  },
});
// 同步 URL 的 search query
const keyword = computed({
  get: () => (route.query.search as string) ?? "",
  set: (val) => {
    router.replace({
      query: {
        ...route.query,
        search: val || null,
      },
    });
  },
});

const submit = async () => {
  try {
    if (form.value.images.length > 0) {
      const ImageRes = await uploadImages(form.value.images);
      form.value.imageUrls = ImageRes.data;
    }
    const { images, ...submitForm } = form.value;
    const res = await apiPostArticle(submitForm);
    if (res.code == 200) {
      alertStore.pushMsg("success", res.msg);
    }
  } catch (e) {
    console.error(e);
  }
};

// 新增圖片
const uploadImages = async (images: UploadImage[]) => {
  try {
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", img.file);
    });
    const res = await apiPostImg(formData);
    return res;
  } catch (e) {
    console.error(e);
  }
};

// 清空表單欄位
const resetForm = () => {
  form.value = {
    ...initialForm,
    tags: [],
  };
};
// 關閉表單
const handleClose = () => {
  resetForm();
  modalStore.close();
};

onMounted(() => {
  homeStore.initCountries();
  homeStore.initCategories();
  homeStore.initTags();
});
</script>

<template>
  <div class="mt-5 space-y-5">
    <!-- 主頁 -->
    <template v-if="!country && !keyword">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">海外好禮報報</h2>
        <button
          class="hidden lg:flex items-center gap-1 text-sm rounded-md border border-zinc-300 bg-white px-3 py-1 text-zinc-900 transition-all duration-200 ease-in-out hover:bg-zinc-100 active:bg-zinc-200"
          @click="modalStore.openModal('create', null, '新增貼文')"
        >
          + 新增貼文
        </button>
      </div>
      <SearchBar @search="keyword = $event" />
      <ScrollerBar v-model="country" :items="homeStore.countries" />
    </template>
    <!-- 列表 -->
    <template v-else>
      <h3 class="text-lg font-semibold">
        <span v-if="homeStore.countryName(country) ?? ''">
          國家：{{ homeStore.countryName(country) ?? "" }}
        </span>
        <span v-if="keyword"> 搜尋：{{ keyword }} </span>
      </h3>

      <div>文章列表（API）</div>
    </template>
    <ModelPopup
      v-show="modalStore.mode == 'create'"
      @close="modalStore.close"
      :title="modalStore.title"
      width="w-[480px]"
    >
      <!-- 表單欄位 -->
      <UserWebFormStep
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

    <!-- 卡片頁面 -->
    <ArticleGrid />
  </div>
</template>
