import Script from "next/script";

/**
 * ClarityAnalytics 组件用于在页面中嵌入 Clarity 分析脚本
 * Clarity 是微软提供的一个用户行为分析工具，可以帮助开发者理解用户如何与网站互动
 * 该组件利用 Next.js 的 Script 组件将 Clarity 的跟踪代码注入到页面中
 */
function ClarityAnalytics() {
  return (
    <Script
      id="clarity-analytics"
      strategy="afterInteractive"
      // 以安全的方式直接嵌入内联脚本
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_TAG_ID}");
        `,
      }}
    />
  );
}

export default ClarityAnalytics;
