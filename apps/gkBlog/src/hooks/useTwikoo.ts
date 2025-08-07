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
  isLoadingScript: boolean; // 新增：同步状态类型
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
  // 新增：定义isLoadingScript状态
  const [isLoadingScript, setIsLoadingScript] = useState(false); // 关键修复
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
    // 如果已加载或缺少环境ID，直接返回
    if (scriptLoadedRef.current || !envId) {
      return;
    }

    scriptLoadedRef.current = true;
    setIsLoadingScript(true); // 新增：标记脚本开始加载

    const maxRetries = 3; // 最大重试次数
    let retries = 0;
    let script: HTMLScriptElement;

    // 提取加载逻辑为独立函数，便于重试
    const loadScript = () => {
      // 清除之前可能存在的脚本
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }

      script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.min.js";
      script.async = true;
      script.crossOrigin = "anonymous"; // 允许跨域资源共享，增强兼容性

      script.onload = () => {
        setIsLoadingScript(false);
        setTwikooLoaded(true);
        setError(null); // 清除可能存在的错误状态
      };

      script.onerror = () => {
        retries++;
        if (retries < maxRetries) {
          // 指数退避策略：1s, 2s, 4s...
          const delay = 1000 * Math.pow(2, retries - 1);
          console.warn(
            `Twikoo脚本加载失败，将在 ${delay}ms 后重试（${retries}/${maxRetries}）`
          );
          setTimeout(loadScript, delay);
        } else {
          const errorMsg = `Twikoo脚本加载失败，已达到最大重试次数（${maxRetries}次）`;
          setError(errorMsg);
          setIsLoadingScript(false);
          console.error(errorMsg);
        }
      };

      document.body.appendChild(script);
    };

    // 开始加载脚本
    loadScript();

    // 清理函数：组件卸载时移除脚本
    return () => {
      setIsLoadingScript(false);
      if (script && script.parentNode) {
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
    isLoadingScript, // 新增：返回加载状态
  };
}

export default useTwikoo;
