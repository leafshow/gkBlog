import { useEffect, useRef, useState } from "react";

// 1. 导出 Comment 接口，确保其他文件可显式引用
export interface Comment {
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

interface TwikooConfig {
  envId: string;
  el: string;
  pageSize?: number;
  includeReply?: boolean;
  urls?: string[];
}

// 2. 定义函数返回类型接口，显式关联 Comment
export interface UseTwikooReturn {
  twikooLoaded: boolean;
  recentComments: Comment[];
  error: string | null;
  fetchRecentComments: (pageSize?: number) => Promise<Comment[]>;
  initTwikoo: (el: string) => void;
}

declare global {
  interface Window {
    twikoo?: {
      // 添加可选标记，避免类型检查错误
      init: (config: TwikooConfig) => void;
      getRecentComments: (config: TwikooConfig) => Promise<Comment[]>;
    };
  }
}

// 3. 为函数添加显式返回类型注解
function useTwikoo(options?: { envId?: string }): UseTwikooReturn {
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [twikooLoaded, setTwikooLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scriptLoadedRef = useRef(false);

  const envId = options?.envId || process.env.NEXT_PUBLIC_TWIKOO_ENVID;

  // 验证 envId 配置
  useEffect(() => {
    if (!envId) {
      const errorMsg =
        "Twikoo envId is not configured. Please set NEXT_PUBLIC_TWIKOO_ENVID in your environment variables.";
      setError(errorMsg);
      console.error(errorMsg);
    }
  }, [envId]);

  // 加载 twikoo 脚本
  useEffect(() => {
    if (scriptLoadedRef.current || !envId) {
      return () => {};
    }
    scriptLoadedRef.current = true;

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.min.js";
    script.async = true;

    script.onload = () => {
      setTwikooLoaded(true);
    };

    script.onerror = () => {
      const errorMsg = "Failed to load Twikoo script";
      setError(errorMsg);
      console.error(errorMsg);
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [envId]);

  // 初始化评论区
  const initTwikoo = (el: string) => {
    if (error) {
      console.error("Cannot initialize Twikoo due to previous errors");
      return;
    }

    if (!envId) {
      console.error("Twikoo envId is not configured");
      return;
    }

    // 检查元素是否存在
    const element = document.querySelector<HTMLElement>(el);
    if (!element) {
      console.error(`Element ${el} not found for Twikoo initialization`);
      return;
    }

    if (window.twikoo && twikooLoaded) {
      window.twikoo.init({
        envId,
        el,
      });
    } else {
      console.warn("Twikoo is not loaded yet, cannot initialize");
    }
  };

  // 4. 为异步方法添加显式返回类型
  const fetchRecentComments = async (pageSize = 3): Promise<Comment[]> => {
    if (error) {
      console.error("Cannot fetch comments due to previous errors");
      return [];
    }

    if (!envId) {
      console.error("Twikoo envId is not configured");
      return [];
    }

    if (window.twikoo && twikooLoaded) {
      try {
        const comments = await window.twikoo.getRecentComments({
          envId,
          pageSize,
          includeReply: false,
          el: "",
        });
        setRecentComments(comments);
        return comments;
      } catch (e) {
        const errorMsg = `Failed to fetch recent comments: ${e instanceof Error ? e.message : String(e)}`;
        setError(errorMsg);
        console.error(errorMsg);
      }
    } else {
      console.warn("Twikoo is not loaded yet, cannot fetch comments");
    }
    return [];
  };

  return {
    twikooLoaded,
    recentComments,
    error,
    fetchRecentComments,
    initTwikoo,
  };
}

export default useTwikoo;
