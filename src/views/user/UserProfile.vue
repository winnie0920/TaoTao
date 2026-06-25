<script setup lang="ts">
import { useModalStore } from "@/stores/modalStore";
import { useHomeStore } from "@/stores/homeStore";
import { useUserStore } from "@/stores/userStore";
const modalStore = useModalStore();
const homeStore = useHomeStore();
const userStore = useUserStore();

onMounted(async () => {
  await homeStore.initUserArticles(true);
  await userStore.initUserDashboard();
});
</script>

<template>
  <div class="max-w-xl mx-auto bg-white min-h-screen pt-10">
    <!-- 個人資訊區 -->
    <section class="px-6 pb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            {{ userStore.user?.nickname }}
          </h1>
          <p :class="userStore.user?.intro ? 'text-gray-600' : 'text-gray-400'">
            {{ userStore.user?.intro || "請寫些自我簡介在這裡吧" }}
          </p>
        </div>
        <img
          :src="
            userStore.user?.imageUrl ||
            homeStore.getImageUrl('Blank.jpg', 'images')
          "
          class="w-20 h-20 rounded-full border border-gray-200"
        />
      </div>

      <!-- 統計數據 -->
      <div class="flex gap-8 mt-6">
        <div class="text-center">
          <span class="block font-bold text-lg">{{
            userStore.user?.postCount
          }}</span>
          <span class="text-sm text-gray-500">發文</span>
        </div>
        <div class="text-center">
          <span class="block font-bold text-lg">{{
            userStore.user?.favoriteCount
          }}</span>
          <span class="text-sm text-gray-500">收藏</span>
        </div>
      </div>

      <!-- 編輯按鈕 -->
      <button
        @click="modalStore.openModal('userEdit', null, '編輯個人資料')"
        class="w-full mt-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
      >
        編輯個人資料
      </button>
    </section>

    <!-- 內容列表區  -->
    <div class="border-t border-gray-100 mt-4">
      <div class="flex justify-around py-3 border-b border-gray-200">
        <span class="font-bold border-b-2 border-black pb-2 mb-5"
          >我的貼文</span
        >
      </div>

      <!-- 貼文清單 -->
      <ArticleGrid displayMode="single" />
    </div>
  </div>
</template>
