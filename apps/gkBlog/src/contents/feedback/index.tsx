import clsx from "clsx";
import { useEffect, useState } from "react";

import Barrage from "@/components/CommentBarrage";
import TwikooComments from "@/components/TwikooComments";

import useTwikoo from "@/hooks/useTwikoo";

// 优化评论类型定义，标记可选字段
interface CommentType {
  id: string;
  url: string;
  nick: string;
  mailMd5?: string;  // 可选字段
  link?: string;     // 可选字段
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { twikooLoaded } = useTwikoo();

  // 验证评论数据格式
  const isValidComment = (item: unknown): item is CommentType => {
    if (typeof item !== 'object' || item === null) return false;
    const comment = item as CommentType;
    return (
      typeof comment.id === 'string' &&
      typeof comment.nick === 'string' &&
      typeof comment.commentText === 'string' &&
      typeof comment.created === 'number'
    );
  };

  const fetchRecentComments = async () => {
    // 防止重复请求
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 检查环境变量
      const envId = process.env.NEXT_PUBLIC_TWIKOO_ENVID;
      if (!envId) {
        throw new Error("环境变量 NEXT_PUBLIC_TWIKOO_ENVID 未配置");
      }

      // 检查Twikoo是否加载完成
      if (!window.twikoo || typeof window.twikoo.getRecentComments !== 'function') {
        throw new Error("Twikoo 未正确加载，请稍后重试");
      }

      // 调用API获取评论 - 修正类型定义，实际返回的是CommentType数组
      const recentComments: CommentType[] = await window.twikoo.getRecentComments({
        envId,
        urls: [BARRAGE_URL],
        pageSize: PAGE_SIZE,
        includeReply: false,
        el: "",
      });

      // 验证返回数据
      if (Array.isArray(recentComments)) {
        const validComments = recentComments.filter(isValidComment);
        // 按时间排序，最新的在前
        validComments.sort((a, b) => b.created - a.created);
        setComments(validComments);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error("获取评论失败:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "加载评论失败，请稍后再试"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 数据拉取与定时任务
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (twikooLoaded) {
      fetchRecentComments();
      interval = setInterval(fetchRecentComments, FETCH_INTERVAL);
    }

    // 清理函数
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [twikooLoaded]);

  // 手动刷新评论
  const handleRefresh = () => {
    fetchRecentComments();
  };

  return (
    <div className={clsx("content-wrapper")}>
      {/* 弹幕区域 */}
      <div className="relative">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500">加载弹幕中...</div>
        ) : errorMessage ? (
          <div className="text-center py-10 text-red-500">
            {errorMessage}
            <button 
              onClick={handleRefresh}
              className="ml-2 text-blue-500 hover:underline"
            >
              重试
            </button>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">暂无弹幕，快来发表第一条评论吧！</div>
        ) : (
          <Barrage comments={comments} speed={80} density={1} />
        )}
        
        {/* 刷新按钮 */}
        <button
          onClick={handleRefresh}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
          aria-label="刷新弹幕"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1zm1 5a.5.5 0 0 0-1 0v3.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L9 11.793V8z"/>
          </svg>
        </button>
      </div>

      {/* 评论区域 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">发表留言</h2>
        <TwikooComments />
      </div>
    </div>
  );
}

export default MessagesContents;
