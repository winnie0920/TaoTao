<script setup lang="ts">
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import { apiPostArticleLike } from "@/api/Article";
import ArticleCarousel from "@/components/user/ArticleCarousel.vue";

const homeStore = useHomeStore();
const modalStore = useModalStoreStore();

const selectedArticleId = ref<number | null>(null); // 當前選取文章 id
const selectedArticle = ref<any>(null);
const comments = ref<any[]>([]);
const isLiking = ref(false);
const carouselRef = ref<InstanceType<typeof ArticleCarousel> | null>(null);

const openModal = async (item: any) => {
  selectedArticleId.value = item.id;

  selectedArticle.value =
    homeStore.articles.find((a) => a.id === item.id) || item;

  nextTick(() => {
    carouselRef.value?.resetIndex();
  });
  modalStore.openModal("view", item, item.title);
  try {
    // const res = await apiGetComments(item.id);
    // comments.value = res.data;
  } catch {}
};

const toggleLike = async () => {
  if (!selectedArticle.value) return;
  if (isLiking.value) return;
  isLiking.value = true;

  try {
    const res = await apiPostArticleLike(selectedArticle.value.id);
    const id = homeStore.articles.findIndex(
      (a) => a.id === selectedArticle.value?.id,
    );

    if (res.msg === "點讚成功") {
      selectedArticle.value.liked = true;
      selectedArticle.value.likeCount += 1;
    } else if (res.msg === "取消點讚成功") {
      selectedArticle.value.liked = false;
      selectedArticle.value.likeCount -= 1;
    }

    if (id !== -1) {
      homeStore.articles[id]!.liked = selectedArticle.value.liked;
      homeStore.articles[id]!.likeCount = selectedArticle.value.likeCount;
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLiking.value = false;
  }
};
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
    <ArticleCard
      v-for="item in homeStore.articles"
      :key="item.id"
      :article="item"
      @click="openModal(item)"
    />

    <ScrollLoader
      :loading="homeStore.loading"
      :hasMore="homeStore.hasMore"
      @loadMore="homeStore.initArticles(false)"
    />
    <ModelPopup
      v-show="modalStore.mode === 'view' && selectedArticle"
      @close="modalStore.close"
    >
      <template #default>
        <div
          class="pl-0 lg:pl-6 w-full h-auto lg:h-[85vh] lg:max-w-5xl bg-white lg:rounded-2xl flex flex-col lg:flex-row lg:overflow-hidden overflow-y-auto"
        >
          <!-- 圖片 -->
          <ArticleCarousel ref="carouselRef" :images="selectedArticle.images" />

          <!-- 右側內容 -->
          <div class="w-full lg:w-[45%] flex flex-col min-h-0">
            <div
              class="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 pb-20 lg:pb-6"
            >
              <!-- 作者 -->
              <div class="flex items-center gap-2">
                <div class="text-sm font-medium">
                  @{{ selectedArticle?.userName?.split("@")[0] }}
                </div>
              </div>

              <!-- 標題 -->
              <h1 class="text-lg font-semibold">
                {{ selectedArticle?.title }}
              </h1>

              <!-- 內文 -->
              <p class="text-zinc-700 whitespace-pre-line">
                {{ selectedArticle?.content }}
              </p>

              <!-- 國家、分類、標籤 -->
              <div class="flex flex-wrap gap-2">
                <span
                  class="text-[11px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  <SvgIcon
                    :icon-name="selectedArticle?.countryIcon"
                    class="w-3 h-3"
                  />
                  {{ selectedArticle?.countryName }}
                </span>
                <span
                  class="text-[11px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1"
                >
                  <SvgIcon
                    :icon-name="selectedArticle?.countryIcon"
                    class="w-3 h-3"
                  />
                  {{ selectedArticle?.categoryName }}
                </span>
                <span
                  v-for="tag in selectedArticle?.tags"
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
                      selectedArticle?.liked ? 'text-red-500' : 'text-zinc-500'
                    "
                  />

                  <span>
                    {{ selectedArticle?.likeCount ?? 0 }}
                  </span>
                </button>

                <button>💬 {{ selectedArticle?.commentCount ?? 0 }}</button>

                <button>⭐ {{ selectedArticle?.favoriteCount ?? 0 }}</button>
              </div>

              <!-- 留言區（先保留） -->
              <div class="pt-4 border-t">
                <div class="text-sm font-semibold mb-3">
                  留言 {{ selectedArticle?.commentCount ?? 0 }}
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
