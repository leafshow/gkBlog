import { ServerResponse } from "http"; // 导入 ServerResponse 类型
import { GetServerSideProps } from "next";

import generateRSSFeed from "@/lib/rss";

function RSSPage() {
  return null; // 该页面不需要渲染任何内容
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // 生成 RSS Feed
  const rss = generateRSSFeed();

  // 设置响应头为 XML 格式
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");

  // 使用 res.write() 和 res.end() 来发送 RSS 内容
  (res as ServerResponse).write(rss); // 写入响应内容
  (res as ServerResponse).end(); // 结束响应流

  return { props: {} }; // 不需要传递任何数据到页面
};

export default RSSPage;
