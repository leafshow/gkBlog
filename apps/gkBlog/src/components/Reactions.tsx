import { ContentType, ShareType } from "@prisma/client"; // 从Prisma导入ShareType
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

// 移除自定义的ShareType定义，直接使用Prisma生成的类型

// 反应详情的类型接口
interface ReactionsDetail {
  THINKING: number;
  CLAPPING: number;
  AMAZED: number;
}

interface CounterProps {
  count: number;
}

function Counter({ count }: CounterProps) {
  // 保持不变...
}

type ReactionCounterProps = PropsWithChildren<CounterProps>;

function ReactionCounter({ count, children = null }: ReactionCounterProps) {
  // 保持不变...
}

export type ReactionsProps = {
  contentType: ContentType;
  contentTitle: string;
  withCountView?: boolean;
};

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

  const { isLoading, data, addShare, addReaction } = useInsight({
    slug,
    contentType,
    contentTitle,
    countView: withCountView,
  });

  // 保持数据处理部分不变...

  // 使用Prisma的ShareType作为参数类型
  const handleAddShare = (type: ShareType) => {
    if (typeof addShare === "function") {
      addShare({ type }); // 现在与Prisma枚举类型完全匹配
    } else {
      console.warn("无法添加分享：函数未定义");
    }
  };

  return (
    <m.div
    // ...保持不变
    >
      {/* ...其他内容保持不变 */}
      <div className={clsx("flex items-start gap-2")}>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <InsightButton views={views} shares={shares} reactions={reactions} />
        </div>
        <div className={clsx("flex flex-col items-center gap-2")}>
          <ShareButton
            // 确保传递给按钮的类型符合Prisma的ShareType
            onItemClick={(type: ShareType) => handleAddShare(type)}
          />
          <ReactionCounter count={shares} />
        </div>
      </div>
    </m.div>
  );
};

export default Reactions;
