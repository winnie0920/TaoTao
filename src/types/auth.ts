export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  firstname: String;
  lastname: String;
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
  expiredDate: string | number | Date;
  refresh_token: string;
  expiredDateR: string | number | Date;
}
