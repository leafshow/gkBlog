import { ContentType } from "@prisma/client";
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

// 定义反应详情的类型接口，确保类型安全
interface ReactionsDetail {
  THINKING: number;
  CLAPPING: number;
  AMAZED: number;
}

interface CounterProps {
  count: number;
}

const Counter = ({ count }: CounterProps) => {
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
          "dark:text-slate-300"
        )}
      >
        0
      </span>
    </span>
  ) : (
    <m.span
      className={clsx(
        "flex flex-col font-mono text-sm font-bold text-slate-600",
        "dark:text-slate-300"
      )}
      animate={controls}
    >
      <span className={clsx("flex h-5 items-center")}>&nbsp;</span>
      <span className={clsx("flex h-5 items-center")}>{count}</span>
      <span className={clsx("flex h-5 items-center")}>{count - 1}</span>
    </m.span>
  );
};

type ReactionCounterProps = PropsWithChildren<CounterProps>;

const ReactionCounter = ({ count, children = null }: ReactionCounterProps) => (
  <div
    className={clsx(
      "relative flex h-6 items-center gap-1 overflow-hidden rounded-full bg-slate-200 py-1 px-2",
      "dark:bg-[#1d263a]"
    )}
  >
    {children}
    <Counter count={count} />
  </div>
);

export type ReactionsProps = {
  contentType: ContentType;
  contentTitle: string;
  withCountView?: boolean;
};

// 定义默认的反应数据，确保永远有安全的初始值
const defaultReactionsDetail: ReactionsDetail = {
  THINKING: 0,
  CLAPPING: 0,
  AMAZED: 0,
};

const Reactions = ({
  contentType,
  contentTitle,
  withCountView = true,
}: ReactionsProps) => {
  const { pathname } = useRouter();
  const slug = pathname.split("/").reverse()[0];
  const { currentSection } = useScrollSpy();

  // 获取数据
  const { isLoading, data, addShare, addReaction } = useInsight({
    slug,
    contentType,
    contentTitle,
    countView: withCountView,
  });

  // 增强空值检查，提供完整的默认值
  const meta = data?.meta || {
    views: 0,
    shares: 0,
    reactions: 0,
    reactionsDetail: defaultReactionsDetail,
  };

  const metaUser = data?.metaUser || {
    reactionsDetail: defaultReactionsDetail,
  };

  // 从元数据中提取反应数据，确保每个属性都有默认值
  const {
    views = 0,
    shares = 0,
    reactions = 0,
    reactionsDetail = defaultReactionsDetail,
  } = meta;

  // 从用户元数据中提取反应数据
  const { reactionsDetail: userReactionsDetail = defaultReactionsDetail } =
    metaUser;

  // 解构反应数据，确保安全访问
  const { THINKING = 0, CLAPPING = 0, AMAZED = 0 } = reactionsDetail;

  const {
    THINKING: userThinking = 0,
    CLAPPING: userClapping = 0,
    AMAZED: userAmazed = 0,
  } = userReactionsDetail;

  // 计算剩余可反应次数
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
    if (typeof addShare === "function") {
      addShare({ type });
    } else {
      console.warn("无法添加分享：函数未定义");
    }
  };

  return (
    <m.div
      className={clsx(
        "border-divider-light pointer-events-auto relative flex items-center justify-between rounded-xl border p-4 ",
        "dark:border-divider-dark"
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
          "dark:bg-slate-900/80"
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
            onClick={() => handleAddReaction("CLAPPING")}
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
            onClick={() => handleAddReaction("AMAZED")}
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
            onClick={() => handleAddReaction("THINKING")}
          />
          <ReactionCounter count={THINKING} />
        </div>
      </div>
      <div className={clsx("flex items-start gap-2")}>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <InsightButton views={views} shares={shares} reactions={reactions} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <ShareButton onItemClick={(type) => handleAddShare(type)} />
          <ReactionCounter count={shares} />
        </div>
      </div>
    </m.div>
  );
};

export default Reactions;
