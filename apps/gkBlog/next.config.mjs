import bundleAnalyzer from "@next/bundle-analyzer";
import nextMDX from "@next/mdx";

// 导入具体的 remark 和 rehype 插件（根据安装的插件调整）
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // 直接使用具体插件（替换原有的 plugins 引用）
    remarkPlugins: [remarkGfm, remarkFrontmatter], // 根据需求添加
    rehypePlugins: [rehypeHighlight, rehypeSlug, rehypeAutolinkHeadings], // 根据需求添加
    providerImportSource: "@mdx-js/react",
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
