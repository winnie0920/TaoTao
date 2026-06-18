<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import { apiPostArticleLike } from "@/api/Article";
import ArticleCarousel from "@/components/article/ArticleCarousel.vue";

// 預覽彈窗
const homeStore = useHomeStore();
const modalStore = useModalStoreStore();

const comments = ref<any[]>([]);
const isLiking = ref(false);

const toggleLike = async () => {
  if (!homeStore.selectedArticle) return;
  if (isLiking.value) return;
  isLiking.value = true;

  try {
    const res = await apiPostArticleLike(homeStore.selectedArticle.id);
    const id = homeStore.articles.findIndex(
      (a) => a.id === homeStore.selectedArticle?.id,
    );

    if (res.msg === "點讚成功") {
      homeStore.selectedArticle.liked = true;
      homeStore.selectedArticle.likeCount += 1;
    } else if (res.msg === "取消點讚成功") {
      homeStore.selectedArticle.liked = false;
      homeStore.selectedArticle.likeCount -= 1;
    }

    if (id !== -1) {
      homeStore.articles[id]!.liked = homeStore.selectedArticle.liked;
      homeStore.articles[id]!.likeCount = homeStore.selectedArticle.likeCount;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLiking.value = false;
  }
};
</script>

<template>
  <ModelPopup
    v-show="modalStore.mode === 'view' && homeStore.selectedArticle"
    @close="modalStore.close"
  >
    <template #default>
      <div
        class="pl-0 lg:pl-6 w-full h-auto lg:h-[85vh] lg:max-w-5xl bg-white lg:rounded-2xl flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto"
      >
        <!-- 圖片 -->
        <ArticleCarousel
          ref="carouselRef"
          :images="homeStore.selectedArticle?.images"
        />

        <!-- 右側內容 -->
        <div class="w-full lg:w-[45%] flex flex-col min-h-0">
          <div
            class="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-20 lg:pb-6"
          >
            <!-- 作者 -->
            <div class="flex items-center gap-2">
              <div class="text-sm font-medium">
                @{{ homeStore.selectedArticle?.userName?.split("@")[0] }}
              </div>
            </div>

            <!-- 標題 -->
            <h1 class="text-lg font-semibold">
              {{ homeStore.selectedArticle?.title }}
            </h1>

            <!-- 內文 -->
            <p class="text-zinc-700 whitespace-pre-line">
              {{ homeStore.selectedArticle?.content }}
            </p>

            <!-- 國家、分類、標籤 -->
            <div class="flex flex-wrap gap-2">
              <span
                class="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <SvgIcon
                  :icon-name="homeStore.selectedArticle?.countryIcon || ''"
                  class="w-3 h-3"
                />
                {{ homeStore.selectedArticle?.countryName }}
              </span>
              <span
                class="text-[11px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <SvgIcon
                  :icon-name="homeStore.selectedArticle?.categoryIcon || ''"
                  class="w-3 h-3"
                />
                {{ homeStore.selectedArticle?.categoryName }}
              </span>
              <span
                v-for="tag in homeStore.selectedArticle?.tags"
                :key="tag.id"
                class="text-[11px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full"
              >
                #{{ tag.name }}
              </span>
            </div>

            <!-- actions -->
            <div class="flex gap-4 text-sm text-zinc-600">
              <button
                @click="toggleLike"
                class="flex items-center gap-1 transition active:scale-90"
              >
                <SvgIcon
                  icon-name="Common-Heart"
                  class="w-5 h-5 transition"
                  :class="
                    homeStore.selectedArticle?.liked
                      ? 'text-red-500'
                      : 'text-zinc-500'
                  "
                />

                <span>
                  {{ homeStore.selectedArticle?.likeCount ?? 0 }}
                </span>
              </button>

              <button>
                💬 {{ homeStore.selectedArticle?.commentCount ?? 0 }}
              </button>

              <button>
                ⭐ {{ homeStore.selectedArticle?.favoriteCount ?? 0 }}
              </button>
            </div>

            <!-- 留言區（先保留） -->
            <div class="pt-4 border-t">
              <div class="text-sm font-semibold mb-3">
                留言 {{ homeStore.selectedArticle?.commentCount ?? 0 }}
              </div>

              <div class="text-sm text-gray-400">
                尚未接 comment API（之後再補）
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- footer -->
    <template #footer>
      <div class="w-full bg-white p-3 flex gap-2 shrink-0">
        <input
          class="flex-1 border rounded-md border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none px-4 py-2 text-sm"
          placeholder="請輸入留言..."
        />
        <button
          class="px-4 py-2 text-sm font-semibold rounded-md bg-zinc-900 text-white active:scale-95 transition"
        >
          發送
        </button>
      </div>
    </template>
  </ModelPopup>
</template>
