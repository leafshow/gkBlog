import bundleAnalyzer from "@next/bundle-analyzer";
import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

// 基础配置：支持的文件扩展名、严格模式、图片不优化
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"], // 支持 MDX 和 TS/JS
  reactStrictMode: true, // 启用 React 严格模式（检测潜在问题）
  images: { unoptimized: true }, // 禁用图片优化（适合静态部署）
};

// 包装MDX配置：处理 Markdown/MDX 文件，支持语法高亮、自动链接等
const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkFrontmatter],
    rehypePlugins: [rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings],
    providerImportSource: "@mdx-js/react",
  },
});

// 包装Bundle分析器
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 合并所有配置
const configWithCors = {
  ...withBundleAnalyzer(withMDX(nextConfig)),
  allowedDevOrigins: [
    "http://172.29.236.158",
    "http://172.29.236.158:3000",
    "http://localhost:3000",
    "172.29.236.158",
    "172.29.236.158:3000",
  ],
};

export default configWithCors;
