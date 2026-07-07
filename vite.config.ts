import { defineConfig } from "vite";

// 抖音小游戏最终以纯静态资源分发，这里使用相对路径 base 便于打包分发
export default defineConfig({
  base: "./",
  server: {
    host: true,
    port: 5173,
  },
  build: {
    target: "es2020",
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
