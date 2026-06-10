<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ModelPopup from "@/components/ModelPopup.vue";
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import { useAlertStore } from "@/stores/alertStore";

import { isRequired, minLength, validate } from "@/utils/validators";
import { usePostTags } from "@/types/usePostTags";
import type { Field } from "@/types";

const route = useRoute();
const router = useRouter();
const homeStore = useHomeStore();
const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

const page = ref<"form" | "tag" | "review">("form");

// 下一步
const next = () => {
  console.log(form.value);
  const errors = validate(form.value, rules);
  if (errors) {
    const msg = Object.values(errors).join("\n");
    alertStore.pushMsg("error", msg);
    return;
  }
  page.value = "review";
};

// 上一步
const back = () => {
  if (page.value === "review") {
    page.value = "form";
  } else if (page.value === "tag") {
    page.value = "form";
  }
};

// 步驟
const step = computed(() => {
  if (page.value === "review") {
    return {
      text: "發佈",
      action: submit,
    };
  }

  if (page.value === "form") {
    return {
      text: "下一步",
      action: next,
    };
  }
});
const schema = computed<Field[]>(() => [
  {
    type: "input",
    name: "title",
    label: "標題",
    placeholder: "輸入標題",
    col: 2,
  },
  {
    type: "textarea",
    name: "content",
    label: "內容",
    col: 2,
  },
  {
    type: "select",
    name: "country",
    label: "國家",
    col: 1,
    options: homeStore.countries,
  },
  {
    type: "select",
    name: "category",
    label: "分類",
    col: 1,
    options: [],
  },
]);

const rules = {
  title: [isRequired("標題必填")],
  content: [isRequired("內容必填"), minLength(10, "內容至少10字")],
  country: [isRequired("請選國家")],
  category: [isRequired("請選分類")],
};

// 初始from
const initialForm = {
  title: "",
  content: "",
  country: "",
  category: "",
  tags: [] as number[],
};
// 複製一份來填寫內容
const form = ref(structuredClone(initialForm));

const { allTags, selectedTags, toggleTag, removeTag } = usePostTags(form);

const isLoading = ref(false);

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
  set: (val: string) => {
    router.replace({
      query: {
        ...route.query,
        search: val || null,
      },
    });
  },
});

const submit = () => {
  console.log(form.value);
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
  page.value = "form";
  resetForm();
  modalStore.isOpen = false;
};

onMounted(() => {
  homeStore.initCountries();
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
          @click="modalStore.openCreate()"
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
      v-model="modalStore.isOpen"
      :title="
        page === 'form' ? '新增貼文' : page === 'tag' ? '選擇標籤' : '選擇照片'
      "
      :loading="isLoading"
      @submit="submit"
      @close="handleClose"
    >
      <!-- 表單欄位 -->
      <UserWebFormStep
        v-if="page === 'form'"
        :form="form"
        :schema="schema"
        :selectedTags="selectedTags"
        @update:form="form = $event"
        @open-tags="page = 'tag'"
        @remove-tag="removeTag"
      />

      <!-- 選擇Tag -->
      <PostTagStep
        v-else-if="page === 'tag'"
        :allTags="allTags"
        :form="form"
        @toggle="toggleTag"
      />

      <template #footer>
        <div class="flex w-full items-center justify-between">
          <button
            class="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 active:scale-95 transition"
            @click="handleClose()"
          >
            取消
          </button>
          <div class="flex items-center gap-2">
            <button
              v-if="page !== 'form'"
              class="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700"
              @click="back"
            >
              上一步
            </button>
            <button
              v-if="step"
              class="px-4 py-2 text-sm font-semibold rounded-md bg-zinc-900 text-white"
              @click="step.action"
            >
              {{ step.text }}
            </button>
          </div>
        </div>
      </template>
    </ModelPopup>
  </div>
</template>
