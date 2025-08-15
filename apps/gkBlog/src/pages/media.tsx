import MediaContents from "@/contents/media";
import Page from "@/contents-layouts/Page";

function Media() {
  return (
    <Page
      frontMatter={{
        title: "书影音",
        description: "我的 NeoDB 观影标记",
        caption: "My",
      }}
    >
      <MediaContents />
    </Page>
  );
}

export default Media;
