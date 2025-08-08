import { useEffect, useRef, useState } from "react";

// 导出 Comment 接口
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

// 函数返回类型接口
export interface UseTwikooReturn {
  twikooLoaded: boolean;
  recentComments: Comment[];
  error: string | null;
  fetchRecentComments: (pageSize?: number) => Promise<Comment[]>;
  initTwikoo: (el: string) => void;
  isLoadingScript: boolean;
}

declare global {
  interface Window {
    twikoo?: {
      init: (config: TwikooConfig) => void;
      getRecentComments: (config: TwikooConfig) => Promise<Comment[]>;
    };
  }
}

// 多CDN源配置（优先国内稳定源）
const TWIKOO_SOURCES = [
  "public/assets/js/twikoo.min.js", // 相对路径根据实际存放位置调整
  "https://unpkg.com/twikoo@1.6.39/dist/twikoo.min.js", // unpkg备用
  "https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.min.js", // 国外备用CDN
];

function useTwikoo(options?: { envId?: string }): UseTwikooReturn {
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [twikooLoaded, setTwikooLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingScript, setIsLoadingScript] = useState(false);
  const scriptLoadedRef = useRef(false);
  const currentSourceIndex = useRef(0); // 跟踪当前尝试的源索引

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

  // 加载 twikoo 脚本（多源轮询+重试）
  useEffect(() => {
    if (scriptLoadedRef.current || !envId) return;

    scriptLoadedRef.current = true;
    setIsLoadingScript(true);

    const maxRetries = 3; // 整体重试轮次（每轮尝试所有源）
    let retryRound = 0;
    let script: HTMLScriptElement;

    // 加载单个源
    const loadFromSource = (sourceIndex: number) => {
      // 清除之前的脚本
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }

      // 边界检查
      if (sourceIndex >= TWIKOO_SOURCES.length) {
        retryRound++;
        if (retryRound < maxRetries) {
          const delay = 1000 * Math.pow(2, retryRound - 1); // 指数退避
          console.warn(
            `所有CDN源尝试失败，将在 ${delay}ms 后进行第 ${retryRound + 1} 轮重试`
          );
          setTimeout(() => loadFromSource(0), delay);
        } else {
          const errorMsg = `Twikoo脚本加载失败，已达到最大重试轮次（${maxRetries}轮）`;
          setError(errorMsg);
          setIsLoadingScript(false);
          console.error(errorMsg);
        }
        return;
      }

      const currentSource = TWIKOO_SOURCES[sourceIndex];
      console.log(`尝试从CDN加载: ${currentSource}`);

      script = document.createElement("script");
      script.src = currentSource;
      script.async = true;
      script.crossOrigin = "anonymous";

      script.onload = () => {
        console.log(`CDN加载成功: ${currentSource}`);
        setIsLoadingScript(false);
        setTwikooLoaded(true);
        setError(null);
      };

      script.onerror = () => {
        console.warn(
          `CDN加载失败: ${currentSource}（${sourceIndex + 1}/${TWIKOO_SOURCES.length}）`
        );
        // 尝试下一个源
        loadFromSource(sourceIndex + 1);
      };

      // 超时处理（10秒无响应视为失败）
      const timeoutTimer = setTimeout(() => {
        console.warn(`CDN加载超时: ${currentSource}`);
        // 修复：传入空事件对象
        script.onerror?.(new Event("error"));
      }, 10000);

      // 清理超时计时器
      script.onload = () => {
        clearTimeout(timeoutTimer);
        setIsLoadingScript(false);
        setTwikooLoaded(true);
        setError(null);
      };

      document.body.appendChild(script);
    };

    // 开始加载（从第一个源开始）
    loadFromSource(0);

    // 组件卸载时清理
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

  // 获取最新评论
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
    isLoadingScript,
  };
}

export default useTwikoo;
