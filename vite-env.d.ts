// src/typings/vite-env.d.ts
/// <reference types="vite/client" />

declare module "virtual:svg-icons-register" {
  const content: string;
  export default content;
}

declare module "virtual:*" {
  const content: string;
  export default content;
}
