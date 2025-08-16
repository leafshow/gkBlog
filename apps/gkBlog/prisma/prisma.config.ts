// prisma.config.ts
import { defineConfig } from "prisma";

export default defineConfig({
  schema: "./prisma/schema.prisma", // 迁移原有的 schema 配置
});
