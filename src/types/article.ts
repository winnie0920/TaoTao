// 1. 圖片資訊介面
export interface ArticleImage {
  id: number;
  articleId: number;
  imageUrl: string;
  sortOrder: number;
  isCover: boolean;
}

// 2. 標籤資訊介面
export interface ArticleTag {
  id: number;
  name: string;
}

// 3. 完整文章介面
export interface Article {
  id: number;
  userId: number;
  nickname: string;
  userImage: string;
  title: string;
  content: string;

  images: ArticleImage[];

  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  liked: boolean;
  favorited: boolean;
  createdTime: string;

  // 💡 新增：國家與分類欄位
  countryId: number;
  countryName: string;
  countryIcon: string;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;

  // 💡 標籤列表
  tags: ArticleTag[];
}

export interface LikeStatus {
  id: number;
  likeCount: number;
  liked: boolean;
}

export interface favoriteStatus {
  id: number;
  favoriteCount: number;
  favorited: boolean;
}

export interface Comment {
  id: number;
  articleId: number;
  userId: number;
  canDelete: boolean;
  nickname: string;
  content: string;
  imageUrl: string;
  totalLikes: number;
  liked: boolean;
  createdTime?: string;
}

export interface ArticlePage {
  list: Article[];
  hasMore: boolean;
  lastId: number | null;
}

export interface ArticleImage {
  id: number;
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
}
