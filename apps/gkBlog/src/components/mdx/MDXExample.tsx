import { type ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

interface MDXExampleProps {
  children: ReactNode;
  sources?: string;
  className?: string;
}

export default function MDXExample({
  children,
  sources = undefined,
  className = "",
}: MDXExampleProps) {
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const sourceCode =
    sources ||
    (typeof children === "string" ? children : "Source code not available");

  return (
    <div
      className={cn(
        "my-8 w-full rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm",
        className
      )}
    >
      {/* Tabs */}
      <div className="flex bg-white dark:bg-gray-800">
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 text-center py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-tl-md",
            "transition-colors duration-300 ease-in-out",
            activeTab === "preview"
              ? "text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 border-b-2 border-primary-600 dark:border-primary-400"
              : "hover:text-primary-500 dark:hover:text-primary-300"
          )}
        >
          样式预览
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("code")}
          className={cn(
            "flex-1 text-center py-3.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-tr-md",
            "transition-colors duration-300 ease-in-out",
            activeTab === "code"
              ? "text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 border-b-2 border-primary-600 dark:border-primary-400"
              : "hover:text-primary-500 dark:hover:text-primary-300"
          )}
        >
          示例源码
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 p-6">
        {activeTab === "preview" ? (
          <div className="mdx-example-preview">{children}</div>
        ) : (
          <div className="relative">
            <pre className="overflow-x-auto rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 text-sm leading-6">
              <code>{sourceCode}</code>
            </pre>
            <div className="absolute right-3 top-3 inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300">
              TSX
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
