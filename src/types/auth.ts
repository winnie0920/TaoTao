export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstname: String;
  lastname: String;
  nickname: String;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface SaveTokenResponse {
  access_token: string;
  expired_date: string | number | Date;
  refresh_token: string;
  expired_dateR: string | number | Date;
}

export interface ArticleFilter {
  keyword?: string;
  categoryId?: number;
  countryId?: number;
}
