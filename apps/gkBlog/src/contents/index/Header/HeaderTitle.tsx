import clsx from "clsx";
import {
  m,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

// 动画配置 - 提取为独立配置便于维护
const animation = {
  hide: { x: -32, opacity: 0 },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.6,
    },
  },
  emoji: {
    hidden: { opacity: 0, y: 16, rotate: 30 },
    visible: { opacity: 1, y: 0, rotate: 0 },
  },
};

const HeaderTitle = () => {
  // 动画控制器 - 为每个动画元素创建独立控制器，避免相互影响
  const emojiControls = useAnimationControls();
  const titleControls = useAnimationControls();
  const subtitleControls = useAnimationControls();

  // 跟踪动画是否已触发
  const animationTriggered = useRef(false);

  // 获取滚动位置用于触发动画
  const { scrollY } = useScroll();

  // 图片加载完成后触发emoji动画
  const handleImageLoad = async () => {
    try {
      console.log("图片加载完成，开始emoji动画");
      await emojiControls.start({
        ...animation.emoji.visible,
        transition: {
          type: "spring",
          delay: 0.35,
          bounce: 0.7,
          duration: 0.7,
        },
      });
      console.log("emoji动画完成");
    } catch (error) {
      console.error("emoji动画执行失败:", error);
    }
  };

  // 触发所有标题动画
  const triggerTitleAnimations = async () => {
    if (animationTriggered.current) return;
    animationTriggered.current = true;

    try {
      console.log("开始标题动画序列");

      // 标题动画 - 0.2秒延迟
      await titleControls.start({
        ...animation.show,
        transition: { ...animation.show.transition, delay: 0.2 },
      });
      console.log("主标题动画完成");

      // 副标题动画 - 0.3秒延迟
      await subtitleControls.start({
        ...animation.show,
        transition: { ...animation.show.transition, delay: 0.3 },
      });
      console.log("副标题动画完成");
    } catch (error) {
      console.error("标题动画执行失败:", error);
      // 失败时重试一次
      setTimeout(() => {
        titleControls.start(animation.show);
        subtitleControls.start(animation.show);
      }, 1000);
    }
  };

  // 自动触发动画的逻辑
  useEffect(() => {
    // 方法1: 组件挂载后立即触发
    const timer = setTimeout(() => {
      console.log("组件挂载后触发动画");
      triggerTitleAnimations();
    }, 100);

    // 方法2: 监听滚动事件 - 当元素进入视图时触发
    const unsubscribeScroll = useMotionValueEvent(scrollY, "change", (y) => {
      // 当页面滚动到一定位置（50px）时触发
      if (y < 50) {
        triggerTitleAnimations();
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribeScroll();
    };
  }, [scrollY]);

  // 手动触发动画的方法（用于调试和备用）
  const handleManualTrigger = () => {
    console.log("手动触发动画");
    triggerTitleAnimations();
    emojiControls.start(animation.emoji.visible);
  };

  return (
    <div
      className="relative"
      onClick={handleManualTrigger} // 点击区域任意位置都可触发动画
      style={{ minHeight: "200px" }} // 确保有足够的点击区域
    >
      {/* 调试信息 - 生产环境可移除 */}
      <div className="fixed top-4 right-4 bg-black/70 text-white px-3 py-1 text-sm rounded-md z-50">
        动画状态: {animationTriggered.current ? "已触发" : "未触发"}
      </div>

      <m.div
        className={clsx(
          "mb-1 flex items-center gap-1 text-2xl text-slate-600",
          "md:mb-0 md:gap-2 md:text-4xl",
          "dark:text-slate-400"
        )}
        initial={animation.hide}
        animate={titleControls}
      >
        嗨!
        <m.div
          initial={animation.emoji.hidden}
          animate={emojiControls}
          transition={{
            type: "spring",
            bounce: 0.7,
            duration: 0.7,
          }}
          style={{ transformOrigin: "right center" }}
        >
          <Image
            className={clsx("w-7 md:w-10")}
            alt="Love-you Gesture"
            src="/assets/emojis/love-you-gesture.png"
            width={48}
            height={48}
            onLoad={handleImageLoad}
            onError={(e) => console.error("图片加载失败:", e)}
            priority
          />
        </m.div>
      </m.div>

      <span className={clsx("text-slate-700", "dark:text-slate-300")}>
        <m.span
          className={clsx(
            "mb-4 block text-[2.5rem] font-[1000] leading-none",
            "md:mb-6 md:text-7xl"
          )}
          initial={animation.hide}
          animate={titleControls}
        >
          I&apos;m{" "}
          <strong className={clsx("text-accent-600", "dark:text-accent-500")}>
            Liye
          </strong>{" "}
          张,{" "}
        </m.span>

        <m.h1
          className={clsx(
            "block text-base text-slate-600",
            "md:text-xl",
            "dark:text-slate-300"
          )}
          initial={animation.hide}
          animate={subtitleControls}
        >
          <span className={clsx("lowercase")}>以</span>{" "}
          <strong
            className={clsx(
              "font-bold text-lg text-slate-700",
              "dark:text-slate-300"
            )}
          >
            积极阳光的心态
          </strong>{" "}
          <span>加上</span>{" "}
          <strong
            className={clsx(
              "font-bold text-lg text-slate-700",
              "dark:text-slate-300"
            )}
          >
            持续学习与自我迭代的行动力
          </strong>{" "}
          <span className={clsx("block")}>是成长和成功的先决条件！</span>
        </m.h1>
      </span>

      {/* 手动触发按钮 - 生产环境可隐藏 */}
      <button
        className="mt-4 px-4 py-2 bg-accent-600 text-white rounded-md text-sm hover:bg-accent-700 transition-colors"
        onClick={handleManualTrigger}
      >
        手动触发动画 (调试用)
      </button>
    </div>
  );
};

export default HeaderTitle;
