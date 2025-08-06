import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Sidebar from "@/components/sidebar/Sidebar";

import useContentMeta from "@/hooks/useContentMeta";

import PostPreview from "@/contents/blog/PostPreview";

import type { TPostFrontMatter } from "@/types";

// 1. 变量名改为复数形式，明确是数组
const PINNED_POSTS = ["how-i-built-my-blog", "Celebrity-Quotations"];
const POSTS_PER_PAGE = 10;

export type BlogContentsProps = {
  posts: Array<{
    slug: string;
    frontMatter: TPostFrontMatter;
  }>;
};

type TPostPreview = TPostFrontMatter & {
  slug: string;
  shares: number;
  views: number;
  cover?: string;
};

const BlogContents = ({ posts }: BlogContentsProps) => {
  const { data } = useContentMeta();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // 2. 将单个变量改为数组，存储所有置顶文章
  const pinnedPosts: TPostPreview[] = [];
  const postsPreview: Array<TPostPreview> = [];

  posts.forEach(({ slug, frontMatter }) => {
    const { shares, views } = data[slug]
      ? data[slug].meta
      : { shares: 0, views: 0 };
    const preview: TPostPreview = {
      slug,
      views,
      shares,
      ...frontMatter,
    };

    // 3. 使用 includes 检查是否为置顶文章
    if (PINNED_POSTS.includes(slug)) {
      pinnedPosts.push(preview);
    } else {
      postsPreview.push(preview);
    }
  });

  // 4. 可选：按日期排序置顶文章（最新的在前）
  pinnedPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(postsPreview.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const currentPosts = postsPreview.slice(startIndex, endIndex);

  useEffect(() => {
    const queryPage = router.query.page;
    if (queryPage) {
      const page = Number.parseInt(queryPage as string, 10);
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      } else {
        setCurrentPage(1);
      }
    } else {
      setCurrentPage(1);
    }
  }, [router.query.page, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/blog?page=${page}`);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i += 1) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        buttons.push(
          <button
            type="button"
            key={i}
            style={{
              padding: "0 15px",
              backgroundColor: i === currentPage ? "#3B82F6" : "#E5E7EB",
              color: i === currentPage ? "white" : "black",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
            onClick={() => handlePageChange(i)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D1D5DB";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                i === currentPage ? "#3B82F6" : "#E5E7EB";
            }}
          >
            {i}
          </button>
        );
      } else if (
        buttons[buttons.length - 1]?.key !== "..." &&
        (i === 2 ||
          i === totalPages - 1 ||
          i === currentPage - 2 ||
          i === currentPage + 2)
      ) {
        buttons.push(<span key="...">...</span>);
      }
    }
    return buttons;
  };

  return (
    <div className={clsx("content-wrapper flex flex-col gap-8")}>
      <div className={clsx("flex flex-col gap-6 md:flex-row")}>
        {/* 侧边栏 */}
        <div className={clsx("w-full md:w-80")}>
          <div className={clsx("sticky top-24", "space-y-6")}>
            <Sidebar
              show={[
                "tags",
                "categories",
                "recentArticles",
                "recentComments",
                "publicAccount",
              ]}
            />
          </div>
        </div>

        {/* 主内容 */}
        <div className={clsx("flex-1")}>
          {/* 5. 循环渲染所有置顶文章 */}
          {pinnedPosts.map((post) => (
            <div
              key={post.slug}
              className={clsx(
                "mb-8 flex items-start gap-4",
                "md:mb-12 md:gap-6"
              )}
            >
              <div className={clsx("flex-1")}>
                <PostPreview
                  pinned
                  slug={post.slug}
                  category={post.category}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  lang={post.lang}
                  tags={post.tags}
                  views={post.views}
                  shares={post.shares}
                  cover={post.cover}
                />
              </div>
            </div>
          ))}

          {currentPosts.map(
            ({
              slug,
              category,
              title,
              description,
              date,
              lang,
              tags,
              views,
              shares,
              cover,
            }) => (
              <div
                key={slug}
                className={clsx(
                  "mb-8 flex items-start gap-4",
                  "md:mb-4 md:gap-6"
                )}
              >
                <div className={clsx("flex-1")}>
                  <PostPreview
                    slug={slug}
                    category={category}
                    title={title}
                    description={description}
                    date={date}
                    lang={lang}
                    tags={tags}
                    views={views}
                    shares={shares}
                    cover={cover}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* 分页按钮 */}
      <div className="mt-8 flex flex-col items-center">
        <div className="flex justify-center space-x-2">
          <button
            type="button"
            className={clsx("btn rounded-md px-4 py-2", {
              "cursor-not-allowed opacity-50": currentPage === 1,
            })}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            上一页
          </button>

          {renderPageButtons()}

          <button
            type="button"
            className={clsx("btn rounded-md px-4 py-2", {
              "cursor-not-allowed opacity-50": currentPage === totalPages,
            })}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            下一页
          </button>
        </div>
        <div className="mt-2 text-center text-sm">{`第 ${currentPage} 页，共 ${totalPages} 页`}</div>
      </div>
    </div>
  );
};

export default BlogContents;
