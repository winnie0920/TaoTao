<script setup lang="ts">
import { ref } from "vue";
import { useModalStoreStore } from "@/stores/modalStore";
import { useAlertStore } from "@/stores/alertStore";

const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

const articles = [
  {
    id: 1,
    title: "ChatGPT 使用技巧分享，提升日常工作效率的幾個方法",
    author: "hpi_user",
    likes: 1200,
    image: "https://picsum.photos/600/400?random=1",
    avatar: "https://i.pravatar.cc/100?img=1",
    content: "這是一段內容示範文字，可以換行。\n第二行內容。",
    comments: [
      { id: 1, user: "amy", content: "寫得很好！" },
      { id: 2, user: "john", content: "學到了 👍" },
    ],
    isLiked: false,
  },
  {
    id: 2,
    title: "Vue 3 + Pinia 實戰筆記",
    author: "vue_master",
    likes: 856,
    image: "https://picsum.photos/600/400?random=2",
    avatar: "https://i.pravatar.cc/100?img=2",
    content: "Pinia 用法整理...",
    comments: [],
    isLiked: false,
  },
];

const selectedArticle = ref<any>(null);

const openModal = (item: any) => {
  selectedArticle.value = item;
  modalStore.openModal("view", item, item.title);
};

const toggleLike = () => {
  if (!selectedArticle.value) return;
  selectedArticle.value.isLiked = !selectedArticle.value.isLiked;
  selectedArticle.value.likes += selectedArticle.value.isLiked ? 1 : -1;
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    <ArticleCard
      v-for="item in articles"
      :key="item.id"
      v-bind="item"
      @click="openModal(item)"
    />

    <ModelPopup v-show="modalStore.mode == 'view'" @close="modalStore.close">
      <template #default>
        <!-- ❗ 不要 fixed，不要 inset-0 -->
        <div
          class="w-full h-auto lg:h-[85vh] lg:max-w-5xl bg-white lg:rounded-2xl flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto"
        >
          <!-- 📷 圖片 -->
          <div
            class="w-full lg:w-[55%] bg-black flex items-center justify-center"
          >
            <img
              :src="selectedArticle.image"
              class="w-full h-full object-contain"
            />
          </div>

          <!-- 🧾 右側 -->
          <div class="w-full lg:w-[45%] flex flex-col min-h-0">
            <div
              class="flex-1 min-h-0 overflow-y-auto p-6 space-y-4 pb-20 lg:pb-6"
            >
              <!-- 作者 -->
              <div class="flex items-center gap-2">
                <img
                  :src="selectedArticle.avatar"
                  class="w-9 h-9 rounded-full"
                />
                <div class="text-sm font-medium">
                  @{{ selectedArticle.author }}
                </div>
              </div>

              <!-- 標題 -->
              <h1 class="text-lg font-semibold">
                {{ selectedArticle.title }}
              </h1>

              <!-- 內文 -->
              <p class="text-zinc-700 whitespace-pre-line">
                {{ selectedArticle.content }}
              </p>

              <!-- actions -->
              <div class="flex gap-4 text-sm text-zinc-600">
                <button @click="toggleLike">
                  ❤️ {{ selectedArticle.likes }}
                </button>
                <button>💬 {{ selectedArticle.comments.length }}</button>
                <button>⭐ 收藏</button>
              </div>

              <!-- 留言 -->
              <div class="pt-4 border-t">
                <div class="text-sm font-semibold mb-3">
                  留言 {{ selectedArticle.comments.length }}
                </div>

                <div class="space-y-3">
                  <div
                    v-for="c in selectedArticle.comments"
                    :key="c.id"
                    class="text-sm"
                  >
                    <div class="font-medium">@{{ c.user }}</div>
                    <div class="text-zinc-600">{{ c.content }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="w-full bg-white p-3 flex gap-2 shrink-0">
          <input
            class="flex-1 border rounded-full px-4 py-2 text-sm"
            placeholder="說點什麼..."
          />
          <button class="px-4 py-2 bg-black text-white rounded-full text-sm">
            發送
          </button>
        </div>
      </template>
    </ModelPopup>
  </div>
</template>
