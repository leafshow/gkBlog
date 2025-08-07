import { useEffect, useRef } from "react";

import useTwikoo from "@/hooks/useTwikoo";

const TwikooComments = () => {
  const { twikooLoaded, initTwikoo } = useTwikoo();
  const commentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 确保元素已挂载到DOM且Twikoo已加载完成
    if (twikooLoaded && commentContainerRef.current) {
      // 检查元素是否存在
      const element = document.getElementById("tcomment");
      if (element) {
        initTwikoo("#tcomment");
      } else {
        console.warn("tcomment元素仍未找到，尝试延迟初始化");
        // 延迟重试，确保DOM完全加载
        const timer = setTimeout(() => {
          const delayedElement = document.getElementById("tcomment");
          if (delayedElement) {
            initTwikoo("#tcomment");
          } else {
            console.error("无法找到tcomment元素，Twikoo初始化失败");
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [twikooLoaded, initTwikoo]);

  // 使用form标签包裹，解决密码字段不在表单中的问题
  return (
    <form className="twikoo-form" onSubmit={(e) => e.preventDefault()}>
      <div
        id="tcomment"
        ref={commentContainerRef}
        className="twikoo-container"
      />
    </form>
  );
};

export default TwikooComments;
