import { fileURLToPath, URL } from "node:url";
import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import { HeadlessUiResolver } from "unplugin-vue-components/resolvers";

const pathSrc = path.resolve(__dirname, "src");

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/TaoTao/" : "./",
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(pathSrc, "assets/icons")],
      symbolId: "icon-[dir]-[name]",
    }),
    tailwindcss(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: "src/auto-imports.d.ts",
    }),
    Components({
      dirs: ["src/components"],
      dts: "src/components.d.ts",
      resolvers: [HeadlessUiResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
