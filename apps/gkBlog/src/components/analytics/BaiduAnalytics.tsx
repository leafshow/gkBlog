import Script from "next/script";

/**
 * 百度分析组件
 * 该组件用于在页面中引入百度统计脚本，以收集页面访问数据
 * 使用 Next.js 的 Script 组件来加载百度统计脚本，并确保在页面交互完成后加载
 */
function BaiDuAnalytics() {
  return (
    <Script
      id="baidu-tongji"
      strategy="afterInteractive"
      // 以安全的方式直接嵌入内联脚本
      dangerouslySetInnerHTML={{
        __html: `
          var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${process.env.NEXT_PUBLIC_BAIDU_TONGJI}";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();
          `,
      }}
    />
  );
}

export default BaiDuAnalytics;
