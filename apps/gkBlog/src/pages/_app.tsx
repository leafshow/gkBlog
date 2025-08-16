import BaiDuAnalytics from "@/components/analytics/BaiduAnalytics";
import ClarityAnalytics from "@/components/analytics/ClarityAnalytics";
import RootLayout from "@/components/layouts/Root";
import WithNavigationFooter from "@/components/layouts/WithNavigationFooter";
import Provider from "@/providers";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

import "@/styles/main.css";

type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function getDefaultLayout(page: ReactElement): ReactNode {
  return <WithNavigationFooter>{page}</WithNavigationFooter>;
}

function App({ Component, pageProps, router }: AppPropsWithLayout) {
  // 确定布局函数
  const getLayout = router.query.simpleLayout
    ? (page: ReactElement) => <main>{page}</main>
    : Component.getLayout || getDefaultLayout;

  // 使用布局函数包装页面内容
  const pageContent = getLayout(<Component {...pageProps} />);

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <Provider>
      <RootLayout>
        {/* 渲染带布局的页面内容 */}
        {pageContent}
        {isProduction && <BaiDuAnalytics />}
        {isProduction && <ClarityAnalytics />}
      </RootLayout>
    </Provider>
  );
}

export default App;
