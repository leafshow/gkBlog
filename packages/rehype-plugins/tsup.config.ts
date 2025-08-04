// packages/rehype-plugins/tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"], // 假设源码入口为 src/index.ts（根据实际目录调整）
  outDir: "dist", // 输出到 dist 目录
  format: ["esm"], // 仅生成 ESM 格式（对应 .mjs）
  target: "esnext", // 匹配 Node 22.x 支持的语法
  sourcemap: false,
  clean: true, // 构建前清空 dist 目录
  dts: true, // 生成类型声明文件（对应 types 字段的 dist/index.d.ts）
});
