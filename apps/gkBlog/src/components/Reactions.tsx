import { ContentType, ShareType } from "@prisma/client";
import clsx from "clsx";
import { m, useAnimationControls } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";

import EmojiReaction from "@/components/EmojiReaction";
import InsightButton from "@/components/InsightButton";
import ShareButton from "@/components/ShareButton";

import useInsight from "@/hooks/useInsight";
import useScrollSpy from "@/hooks/useScrollSpy";

import { MAX_REACTIONS_PER_SESSION } from "@/constants/app";

import type { PropsWithChildren } from "react";

<<<<<<< HEAD
<<<<<<< HEAD
=======
// 定义反应详情的类型接口，确保类型安全
>>>>>>> parent of 7ff69b1 (优化Reactions组件，修复“点赞 / 反应” 功能相关组件)
interface ReactionsDetail {
  THINKING: number;
  CLAPPING: number;
  AMAZED: number;
}

=======
>>>>>>> parent of 16aa789 (优化Reactions组件 修复“点赞 / 反应” 功能相关组件)
interface CounterProps {
  count: number;
}

function Counter({ count }: CounterProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    const startMotion = async () => {
      await controls.start({
        y: [-20, 0],
        transition: {
          duration: 0.18,
        },
      });
    };

    if (count !== 0) {
      startMotion();
    }
  }, [count, controls]);

  return count === 0 ? (
    <span className={clsx("flex flex-col font-mono text-sm")}>
      <span
        className={clsx(
          "flex h-5 items-center font-mono text-sm font-bold text-slate-600",
          "dark:text-slate-300",
        )}
      >
        0
      </span>
    </span>
  ) : (
    <m.span
      className={clsx(
        "flex flex-col font-mono text-sm font-bold text-slate-600",
        "dark:text-slate-300",
      )}
      animate={controls}
    >
      <span className={clsx("flex h-5 items-center")}>&nbsp;</span>
      <span className={clsx("flex h-5 items-center")}>{count}</span>
      <span className={clsx("flex h-5 items-center")}>{count - 1}</span>
    </m.span>
  );
}

type ReactionCounterProps = PropsWithChildren<CounterProps>;

function ReactionCounter({ count, children = null }: ReactionCounterProps) {
  return (
    <div
      className={clsx(
        "relative flex h-6 items-center gap-1 overflow-hidden rounded-full bg-slate-200 py-1 px-2",
        "dark:bg-[#1d263a]",
      )}
    >
      {children}
      <Counter count={count} />
    </div>
  );
}

export type ReactionsProps = {
  contentType: ContentType;
  contentTitle: string;
  withCountView?: boolean;
};

function Reactions({
  contentType,
  contentTitle,
  withCountView = true,
}: ReactionsProps) {
  // currently, there is no way to get the 'slug' via a component property.
  const { pathname } = useRouter();
  const slug = pathname.split("/").reverse()[0];

  // current active section
  const { currentSection } = useScrollSpy();

  // 获取数据，添加空值检查
  const {
    isLoading,
    data,
    addShare,
    addReaction,
  } = useInsight({ slug, contentType, contentTitle, countView: withCountView });

<<<<<<< HEAD
<<<<<<< HEAD
  // 确保从data中正确提取元数据，并提供默认值
=======
  // 增强空值检查，提供完整的默认值
>>>>>>> parent of 7ff69b1 (优化Reactions组件，修复“点赞 / 反应” 功能相关组件)
=======
  // 安全地访问数据，提供默认值
>>>>>>> parent of 16aa789 (优化Reactions组件 修复“点赞 / 反应” 功能相关组件)
  const meta = data?.meta || {
    views: 0,
    shares: 0,
    reactions: 0,
    reactionsDetail: {
      THINKING: 0,
      CLAPPING: 0,
      AMAZED: 0,
    },
  };
<<<<<<< HEAD

  // 显式声明并解构需要的变量
  const {
    views = 0,
    shares = 0,
    reactions = 0,
    reactionsDetail = defaultReactionsDetail,
  } = meta;

  const metaUser = data?.metaUser || {
    reactionsDetail: defaultReactionsDetail,
  };

  const { reactionsDetail: userReactionsDetail = defaultReactionsDetail } =
    metaUser;

  const { THINKING = 0, CLAPPING = 0, AMAZED = 0 } = reactionsDetail;

  const {
    THINKING: userThinking = 0,
    CLAPPING: userClapping = 0,
    AMAZED: userAmazed = 0,
  } = userReactionsDetail;

  const CLAPPING_QUOTA = MAX_REACTIONS_PER_SESSION - userClapping;
  const THINKING_QUOTA = MAX_REACTIONS_PER_SESSION - userThinking;
  const AMAZED_QUOTA = MAX_REACTIONS_PER_SESSION - userAmazed;

  const controls = useAnimationControls();

  useEffect(() => {
    if (!isLoading) {
      controls.start({
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        transition: {
          delay: 0.24,
          duration: 0.18,
        },
      });
    }
  }, [isLoading, controls]);

  const handleAddReaction = (type: keyof ReactionsDetail) => {
    if (typeof addReaction === "function" && currentSection) {
      addReaction({ type, section: currentSection });
    } else {
      console.warn("无法添加反应：函数未定义或缺少章节信息");
    }
  };

  const handleAddShare = (type: ShareType) => {
=======

  const metaUser = data?.metaUser || {
    reactionsDetail: {
      THINKING: 0,
      CLAPPING: 0,
      AMAZED: 0,
    },
  };

  // 解构数据，确保属性存在
  const {
    views = 0,
    shares = 0,
    reactions = 0,
    reactionsDetail: { THINKING = 0, CLAPPING = 0, AMAZED = 0 } = {},
  } = meta;

  const {
    reactionsDetail: { THINKING: userThinking = 0, CLAPPING: userClapping = 0, AMAZED: userAmazed = 0 } = {},
  } = metaUser;

  const CLAPPING_QUOTA = MAX_REACTIONS_PER_SESSION - userClapping;
  const THINKING_QUOTA = MAX_REACTIONS_PER_SESSION - userThinking;
  const AMAZED_QUOTA = MAX_REACTIONS_PER_SESSION - userAmazed;

  const controls = useAnimationControls();

  useEffect(() => {
    if (!isLoading) {
      controls.start({
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        transition: {
          delay: 0.24,
          duration: 0.18,
        },
      });
    }
  }, [isLoading, controls]);

<<<<<<< HEAD
  // 在调用addReaction前检查函数是否存在
  const handleAddReaction = (type: keyof ReactionsDetail) => {
    if (typeof addReaction === "function" && currentSection) {
      addReaction({ type, section: currentSection });
    } else {
      console.warn("无法添加反应：函数未定义或缺少章节信息");
    }
  };

  // 在调用addShare前检查函数是否存在
  const handleAddShare = (type: string) => {
>>>>>>> parent of 7ff69b1 (优化Reactions组件，修复“点赞 / 反应” 功能相关组件)
    if (typeof addShare === "function") {
      addShare({ type });
    } else {
      console.warn("无法添加分享：函数未定义");
    }
  };

=======
>>>>>>> parent of 16aa789 (优化Reactions组件 修复“点赞 / 反应” 功能相关组件)
  return (
    <m.div
      className={clsx(
        "border-divider-light pointer-events-auto relative flex items-center justify-between rounded-xl border p-4 ",
        "dark:border-divider-dark",
      )}
      initial={{
        y: 16,
        opacity: 0,
        pointerEvents: "none",
      }}
      animate={controls}
    >
      <div
        className={clsx(
          "absolute inset-0 rounded-xl bg-white/70 backdrop-blur",
          "dark:bg-slate-900/80",
        )}
      />
      <div className={clsx("flex items-center gap-4")}>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={CLAPPING_QUOTA <= 0}
            title="鼓掌"
            defaultImage="/assets/emojis/clapping-hands.png"
            animatedImage="/assets/emojis/clapping-hands-animated.png"
            disabledImage="/assets/emojis/love-you-gesture.png"
            onClick={() => {
              addReaction({ type: "CLAPPING", section: currentSection });
            }}
          />
          <ReactionCounter count={CLAPPING} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={AMAZED_QUOTA <= 0}
            title="哇"
            defaultImage="/assets/emojis/astonished-face.png"
            animatedImage="/assets/emojis/astonished-face-animated.png"
            disabledImage="/assets/emojis/star-struck.png"
            onClick={() => {
              addReaction({ type: "AMAZED", section: currentSection });
            }}
          />
          <ReactionCounter count={AMAZED} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <EmojiReaction
            disabled={THINKING_QUOTA <= 0}
            title="疑惑"
            defaultImage="/assets/emojis/face-with-monocle.png"
            animatedImage="/assets/emojis/face-with-monocle-animated.png"
            disabledImage="/assets/emojis/nerd-face.png"
            onClick={() => {
              addReaction({ type: "THINKING", section: currentSection });
            }}
          />
          <ReactionCounter count={THINKING} />
        </div>
      </div>
      <div className={clsx("flex items-start gap-2")}>
        <div className={clsx("flex flex-col items-center gap-2")}>
          {/* 现在views、shares和reactions都已正确定义 */}
          <InsightButton views={views} shares={shares} reactions={reactions} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
<<<<<<< HEAD
<<<<<<< HEAD
          <ShareButton
            onItemClick={(type: ShareType) => handleAddShare(type)}
          />
=======
          <ShareButton onItemClick={(type) => handleAddShare(type)} />
>>>>>>> parent of 7ff69b1 (优化Reactions组件，修复“点赞 / 反应” 功能相关组件)
=======
          <ShareButton
            onItemClick={(type) => {
              addShare({ type });
            }}
          />
>>>>>>> parent of 16aa789 (优化Reactions组件 修复“点赞 / 反应” 功能相关组件)
          <ReactionCounter count={shares} />
        </div>
      </div>
    </m.div>
  );
}

export default Reactions;
