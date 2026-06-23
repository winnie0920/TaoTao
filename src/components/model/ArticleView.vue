<script setup lang="ts">
import type { LikeStatus, favoriteStatus } from "@/types";
import { useHomeStore } from "@/stores/HomeStore";
import { useModalStoreStore } from "@/stores/modalStore";
import {
  apiPostArticleLike,
  apiPostFavoriteLike,
  apiPostComment,
  apiDeleteComment,
  apiPostCommentLike,
} from "@/api/Article";
import { useAlertStore } from "@/stores/alertStore";

// 預覽彈窗
const homeStore = useHomeStore();
const modalStore = useModalStoreStore();
const alertStore = useAlertStore();

const commentContent = ref<string>("");
const openMenuId = ref<number | null>(null);
const isLike = ref(false);
const isFavorite = ref(false);
const isSubmit = ref(false);
const isDelete = ref(false);

// 請求更新按讚、收藏
const executeStatusUpdate = async <T,>(
  apiCall: () => Promise<{ data: T }>,
  onSuccess: (data: T) => void,
  loadingRef: Ref<boolean>,
) => {
  if (loadingRef.value) return;
  loadingRef.value = true;
  try {
    const response = await apiCall();
    onSuccess(response.data);
  } catch (e: any) {
    const serverMsg = e.response?.data?.msg || e.message || "操作失敗";
    console.error(serverMsg);
  } finally {
    loadingRef.value = false;
  }
};

// 新增、取消按讚
const toggleLike = () =>
  executeStatusUpdate(
    () => apiPostArticleLike(homeStore.selectedArticle!.id),
    (status: LikeStatus) => Object.assign(homeStore.selectedArticle!, status),
    isLike,
  );

// 新增、取消收藏
const toggleFavorite = () =>
  executeStatusUpdate(
    () => apiPostFavoriteLike(homeStore.selectedArticle!.id),
    (status: favoriteStatus) =>
      Object.assign(homeStore.selectedArticle!, status),
    isFavorite,
  );

// 送出留言
const submitComment = async () => {
  if (!commentContent.value.trim() || !homeStore.selectedArticle) return;
  const articleId = homeStore.selectedArticle.id;
  await executeStatusUpdate(
    () =>
      apiPostComment({
        articleId: articleId,
        content: commentContent.value,
      }),
    (data: number) => {
      homeStore.selectedArticle!.commentCount = data;
      homeStore.initComment(articleId);
      commentContent.value = "";
    },
    isSubmit,
  );
};

// 刪除留言
const removeComment = async (commentId: number) => {
  await executeStatusUpdate(
    () => apiDeleteComment(commentId),
    (data: number) => {
      homeStore.selectedArticle!.commentCount = data;
      homeStore.initComment(homeStore.selectedArticle!.id);
      openMenuId.value = null;
      alertStore.pushMsg("success", "刪除成功");
    },
    isDelete,
  );
};

// 新增、取消留言讚
const toggleCommentLike = async (comment: any) => {
  try {
    // 呼叫後端 API，回傳最新的按讚總數
    const res = await apiPostCommentLike(comment.id);
    comment.totalLikes = res.data;
    comment.liked = !comment.liked;
  } catch (error) {
    console.error("按讚失敗", error);
  }
};

// 開關小窗
const toggleMenu = (id: number) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

// 關閉小窗
const closeMenu = (e: MouseEvent) => {
  if (!openMenuId.value) return;
  const path = e.composedPath?.() as EventTarget[];
  const clickedInside = path?.some((el) => {
    return (el as HTMLElement)?.dataset?.menu === "true";
  });
  if (!clickedInside) {
    openMenuId.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenu);
});

// 取得留言
watch(
  () => modalStore.mode,
  (newMode) => {
    if (newMode === "view" && homeStore.selectedArticle) {
      homeStore.initComment(homeStore.selectedArticle.id);
    }
  },
);
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
                v-for="tag in homeStore.selectedArticle?.tags?.slice(0, 3)"
                :key="tag.id"
                class="text-[11px] bg-sky-50 text-sky-600 px-2 py-0.5 rounded-full"
              >
                #{{ tag.name }}
              </span>
              <span
                v-if="(homeStore.selectedArticle?.tags?.length || 0) > 3"
                class="text-[11px] text-zinc-400"
              >
                ...
              </span>
            </div>

            <div class="flex gap-4 text-sm text-zinc-600">
              <button
                @click="toggleLike"
                class="flex items-center gap-1 transition active:scale-90 cursor-pointer"
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

              <div class="flex items-center gap-1">
                <SvgIcon
                  icon-name="Common-Msg"
                  class="w-5 h-5 transition text-zinc-500"
                />
                <span>{{ homeStore.selectedArticle?.commentCount ?? 0 }}</span>
              </div>

              <button
                class="flex items-center gap-1 transition active:scale-90 cursor-pointer"
                @click="toggleFavorite"
              >
                <SvgIcon
                  icon-name="Common-Collection"
                  class="w-5 h-5 transition"
                  :class="
                    homeStore.selectedArticle?.favorited
                      ? 'text-yellow-500'
                      : 'text-zinc-500'
                  "
                />
                <span>{{ homeStore.selectedArticle?.favoriteCount ?? 0 }}</span>
              </button>
            </div>

            <!-- 留言區 -->
            <div
              v-for="comment in homeStore.comments"
              :key="comment.id"
              class="flex gap-3"
            >
              <div class="w-8 h-8 rounded-full bg-zinc-200 shrink-0"></div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <div class="text-xs font-bold text-zinc-900">
                    {{ comment.username }}
                  </div>

                  <div class="relative">
                    <button
                      v-if="comment.canDelete"
                      @click="toggleMenu(comment.id)"
                      class="px-2 text-zinc-500"
                      data-menu="true"
                    >
                      ⋯
                    </button>
                    <Transition name="fade">
                      <div
                        v-if="openMenuId === comment.id"
                        class="absolute right-0 top-6 bg-zinc-600 border border-zinc-200 rounded-lg shadow-md z-50 min-w-30 overflow-hidden"
                        data-menu="true"
                      >
                        <button
                          class="flex items-center justify-between w-full px-4 py-2 text-white font-medium hover:bg-zinc-500 active:bg-zinc-500"
                          @click="removeComment(comment.id)"
                        >
                          <span>刪除</span>
                          <div class="flex items-center gap-2">
                            <SvgIcon icon-name="Common-Trash" class="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </Transition>
                  </div>
                </div>

                <div class="text-sm text-zinc-700 whitespace-pre-line mt-0.5">
                  {{ comment.content }}
                </div>
                <div class="mt-2 flex items-center gap-1">
                  <button
                    @click="toggleCommentLike(comment)"
                    class="flex items-center gap-1 transition active:scale-90"
                  >
                    <SvgIcon
                      icon-name="Common-Heart"
                      class="w-4 h-4 transition"
                      :class="comment.liked ? 'text-red-500' : 'text-zinc-400'"
                    />
                    <span class="text-[10px] text-zinc-500">
                      {{ comment.totalLikes }}
                    </span>
                  </button>
                </div>
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
          v-model="commentContent"
          @keyup.enter.prevent="submitComment"
          class="flex-1 border rounded-md border-zinc-300 bg-white text-zinc-900 placeholder-zinc-400 transition-all duration-200 ease-in-out focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 focus:outline-none px-4 py-2 text-sm"
          placeholder="請輸入留言..."
        />
        <button
          @click="submitComment"
          class="px-4 py-2 text-sm font-semibold rounded-md bg-zinc-900 text-white active:scale-95 transition"
        >
          發送
        </button>
      </div>
    </template>
  </ModelPopup>
</template>
