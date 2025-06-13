import clsx from "clsx";
import { useEffect, useState } from "react";

import Barrage from "@/components/CommentBarrage";
import TwikooComments from "@/components/TwikooComments";

import useTwikoo from "@/hooks/useTwikoo";

// 定义评论类型（来自 Twikoo 官方文档）
interface CommentType {
  id: string;
  url: string;
  nick: string;
  mailMd5: string;
  link: string;
  comment: string;
  commentText: string;
  created: number;
  avatar: string;
  relativeTime: string;
}

const PAGE_SIZE = 50;
const FETCH_INTERVAL = 5 * 60 * 1000;
const BARRAGE_URL = "/feedback";

function MessagesContents() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const { twikooLoaded } = useTwikoo();

  const fetchRecentComments = async () => {
    try {
      const envId = process.env.NEXT_PUBLIC_TWIKOO_ENVID;
      if (!envId) {
        throw new Error("环境变量 NEXT_PUBLIC_TWIKOO_ENVID 未配置");
      }

      const recentComments = await window.twikoo.getRecentComments({
        envId,
        urls: [BARRAGE_URL],
        pageSize: PAGE_SIZE,
        includeReply: false,
        el: "",
      });

      if (Array.isArray(recentComments) && recentComments.length > 0) {
        setComments(recentComments);
        setFetchError(false);
      } else {
        setComments([]);
      }
    } catch (error) {
      // console.error("获取评论失败:", error);
      setFetchError(true);
    }
  };

  // 数据拉取与定时任务
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (twikooLoaded) {
      fetchRecentComments();
      interval = setInterval(fetchRecentComments, FETCH_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [twikooLoaded]);

  return (
    <div className={clsx("content-wrapper")}>
      {!fetchError ? (
        <Barrage comments={comments} speed={80} density={1} />
      ) : (
        <div className="text-center text-red-500">加载弹幕失败，请稍后再试</div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">发表留言</h2>
        <TwikooComments />
      </div>
    </div>
  );
}

export default MessagesContents;
