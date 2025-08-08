import { useEffect, useRef, useState } from "react";
import useTwikoo from "@/hooks/useTwikoo";

const TwikooComments = () => {
  const { twikooLoaded, initTwikoo } = useTwikoo();
  const commentContainerRef = useRef<HTMLDivElement>(null);
  const [initializationStatus, setInitializationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 初始化评论组件的函数
  const initializeComments = () => {
    if (initializationStatus === "loading" || initializationStatus === "success") {
      return; // 防止重复初始化
    }

    setInitializationStatus("loading");
    
    // 检查元素是否存在
    if (commentContainerRef.current) {
      try {
        // 传入元素ID选择器而非DOM元素，匹配initTwikoo的参数要求
        initTwikoo("#tcomment");
        setInitializationStatus("success");
        setErrorMessage(null);
      } catch (error) {
        setInitializationStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Twikoo 初始化过程中发生错误"
        );
        console.error("Twikoo 初始化失败:", error);
      }
    } else {
      setInitializationStatus("error");
      setErrorMessage("评论容器元素未找到");
      console.error("评论容器元素未找到");
    }
  };

  // 初始化逻辑
  useEffect(() => {
    let retryTimer: NodeJS.Timeout | null = null;
    
    // 当 Twikoo 加载完成后尝试初始化
    if (twikooLoaded) {
      // 立即尝试初始化
      initializeComments();
      
      // 如果初始化失败，设置重试机制
      if (initializationStatus === "error") {
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 1000; // 1秒后重试
        
        retryTimer = setInterval(() => {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`第 ${retryCount} 次重试初始化 Twikoo`);
            initializeComments();
          } else if (retryTimer) {
            clearInterval(retryTimer);
          }
        }, retryDelay);
      }
    }
    
    return () => {
      if (retryTimer) {
        clearInterval(retryTimer);
      }
    };
  }, [twikooLoaded, initializationStatus]);

  // 手动重试初始化
  const handleRetry = () => {
    setInitializationStatus("idle");
    initializeComments();
  };

  return (
    <form className="twikoo-form" onSubmit={(e) => e.preventDefault()}>
      {/* 评论容器 - 确保ID为"tcomment" */}
      <div
        id="tcomment"
        ref={commentContainerRef}
        className="twikoo-container"
      />

      {/* 初始化状态反馈 */}
      {initializationStatus === "loading" && (
        <div className="text-center py-4 text-gray-500">
          加载评论中...
        </div>
      )}

      {initializationStatus === "error" && (
        <div className="text-center py-4 text-red-500">
          <p>评论加载失败: {errorMessage || "未知错误"}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-2 text-blue-500 hover:underline"
          >
            重试加载
          </button>
        </div>
      )}
    </form>
  );
};

export default TwikooComments;
    