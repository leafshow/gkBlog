import bundleAnalyzer from "@next/bundle-analyzer";
import nextMDX from "@next/mdx";
import rehypePlugins from "rehype-plugins";
import remarkPlugins from "remark-plugins";

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
    remarkPlugins: remarkPlugins.plugins,
    rehypePlugins: rehypePlugins.plugins,
    providerImportSource: "@mdx-js/react",
  },
});

export default withBundleAnalyzer(withMDX(nextConfig));
