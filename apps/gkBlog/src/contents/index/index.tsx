import clsx from "clsx";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

import { CodeIcon, HeartIcon, SparklesIcon } from "@/components/Icons";
import Toast from "@/components/Toast";

import CleanIntuitive from "@/contents/index/CleanIntuitive";
import DetailOriented from "@/contents/index/DetailOriented";
import FeaturedCard from "@/contents/index/FeaturedCard";
import Header from "@/contents/index/Header";
import PrettyOptimized from "@/contents/index/PrettyOptimized";
import Quote01 from "@/contents/index/Quote01";

const privacyToast = {
  title: "隐私协议助手",
  message: (
    <>
      查看本站为你的个人隐私做出的努力。
      <a
        href="/privacy-policy/"
        className="text-blue-500 underline"
        rel="noopener noreferrer"
      >
        查看隐私政策
      </a>
    </>
  ),
};

function FeaturedCardSection() {
  return (
    <div className={clsx("content-wrapper")}>
      <div className={clsx("flex flex-col gap-4", "lg:flex-row lg:gap-8")}>
        <FeaturedCard
          icon={
            <div
              className={clsx(
                "rounded-full bg-amber-300 p-3.5",
                "dark:bg-amber-900",
              )}
            >
              <SparklesIcon className={clsx("h-5 w-5 text-white")} />
            </div>
          }
          title="简洁直观"
          desc="保持用户界面简洁且具有现代风格，同时不影响用户体验。"
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                "rounded-full bg-pink-300 p-3.5",
                "dark:bg-pink-900",
              )}
            >
              <HeartIcon className={clsx("h-5 w-5 text-white")} />
            </div>
          }
          title="注重细节"
          desc="意识到易于访问、UI 一致性和改进的 UX。"
        />
        <FeaturedCard
          icon={
            <div
              className={clsx(
                "rounded-full bg-sky-300 p-3.5",
                "dark:bg-sky-900",
              )}
            >
              <CodeIcon className={clsx("h-5 w-5 text-white")} />
            </div>
          }
          title="美观优化"
          desc="编写干净的代码是首要任务，同时尽可能保持其优化。"
        />
      </div>
    </div>
  );
}

function QuoteSection01() {
  return (
    <div className={clsx("content-wrapper")}>
      <div className={clsx("flex items-center justify-center py-8")}>
        <Quote01 />
      </div>
    </div>
  );
}

function IndexContents() {
  const toastRef = useRef(null);

  useEffect(() => {
    if (toastRef.current) {
      toast.remove(toastRef.current.id);
    }
    toastRef.current = toast.custom((t) => (
      <Toast title={privacyToast.title} message={privacyToast.message} t={t} />
    ));
  }, []);

  return (
    <>
      <Header />
      <div className={clsx("hidden", "lg:-mt-16 lg:mb-24 lg:block")}>
        <FeaturedCardSection />
      </div>
      <div className={clsx("-mt-12 mb-12", "md:mt-0 md:mb-24")}>
        <QuoteSection01 />
      </div>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <CleanIntuitive />
      </section>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <DetailOriented />
      </section>
      <section className={clsx("mb-12", "lg:mb-24")}>
        <PrettyOptimized />
      </section>
    </>
  );
}

export default IndexContents;
