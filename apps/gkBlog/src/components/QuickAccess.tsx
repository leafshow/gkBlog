import { Dialog } from "@headlessui/react";
import clsx from "clsx";
import { m } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

import ActionCenter from "@/components/ActionCenter";
import Activity from "@/components/Activity";
import { XIcon } from "@/components/Icons";
import NewPosts from "@/components/NewPosts";
import TipShortcuts from "@/components/TipShortcuts";

import useGlobal from "@/hooks/useGlobal";
import useTwikoo from "@/hooks/useTwikoo";

const animation = {
  hide: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
};

function QuickAccess() {
  const closeButtonRef = useRef(null);
  const { isQuickAccessOpen, setQuickAccessOpen } = useGlobal();

  const { recentComments, fetchRecentComments, twikooLoaded } = useTwikoo();

  useEffect(() => {
    if (twikooLoaded) {
      fetchRecentComments(10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twikooLoaded]);

  return isQuickAccessOpen ? (
    <Dialog
      static
      initialFocus={closeButtonRef}
      open={isQuickAccessOpen}
      onClose={() => setQuickAccessOpen(false)}
      className={clsx("relative z-[1001]")}
    >
      {/* 背景遮罩层 */}
      <m.div
        variants={animation}
        initial="hide"
        animate="show"
        className={clsx(
          "fixed inset-0 bg-slate-200/[.8]",
          "dark:bg-slate-900/[.9]"
        )}
        aria-hidden={!isQuickAccessOpen}
      />

      {/* 居中弹出窗口 */}
      <div className="fixed inset-0 flex items-center justify-center p-0 sm:p-4">
        <Dialog.Panel
          className={clsx(
            "relative h-full w-full overflow-y-auto bg-slate-100 p-4 sm:p-6 pt-10 sm:pt-6 rounded-lg shadow-2xl",
            "sm:max-h-[80vh] sm:max-w-4xl md:max-w-7xl md:rounded-xl",
            "flex flex-col dark:bg-slate-800"
          )}
        >
          {/* 关闭按钮 */}
          <div className="absolute right-4 top-5 md:top-4 md:right-4">
            <button
              ref={closeButtonRef}
              type="button"
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full bg-slate-300/50 text-slate-800",
                "hover:bg-slate-300/70 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              )}
              aria-label="关闭快速访问"
              onClick={() => setQuickAccessOpen(false)}
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="flex h-full">
            {/* 左侧区域 - 快捷方式 + 最近评论 */}
            <div className="hidden w-1/3 flex-col pr-6 md:flex">
              <div className="flex min-h-0 flex-grow flex-col">
                <m.div
                  className={clsx("text-xl font-bold")}
                  variants={animation}
                >
                  最近评论
                </m.div>
                <ul
                  className={clsx(
                    "scrollbar-hide mt-4 flex-grow overflow-y-auto pr-2"
                  )}
                >
                  {recentComments.map((comment, index) => (
                    <m.li
                      key={comment.id}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="mb-4"
                    >
                      <a href={comment.url} className="group flex items-center">
                        <Image
                          src={comment.avatar || "/default-avatar.png"}
                          alt={comment.nick}
                          width={32}
                          height={32}
                          className="mr-3 h-8 w-8 rounded-full"
                        />
                        <div className="flex w-full flex-col">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-700 dark:text-gray-300">
                              {comment.nick}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.created).toLocaleDateString(
                                "zh-CN",
                                {
                                  month: "2-digit",
                                  day: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {comment.commentText.length > 50
                              ? `${comment.commentText.slice(0, 50)}...`
                              : comment.commentText}
                          </p>
                        </div>
                      </a>
                      {index !== recentComments.length - 1 && (
                        <hr className="my-2 border-t border-dashed border-gray-200 dark:border-gray-600" />
                      )}
                    </m.li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <TipShortcuts />
              </div>
            </div>
            {/* 右侧区域 - 主要内容 */}
            <div className="flex w-full flex-col space-y-6 dark:border-slate-700 md:w-2/3">
              <ActionCenter />
              <NewPosts onItemClick={() => setQuickAccessOpen(false)} />
              <Activity onItemClick={() => setQuickAccessOpen(false)} />
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  ) : null;
}

export default QuickAccess;
