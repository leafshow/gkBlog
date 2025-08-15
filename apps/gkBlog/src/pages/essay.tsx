import EssayContents from "@/contents/essay";
import Page from "@/contents-layouts/Page";

function Essay() {
  return (
    <Page
      frontMatter={{
        title: "回忆录",
        description: "朋友圈的回忆录，大多数都是非主流，当时年少轻狂时候发的",
        caption: "My",
      }}
    >
      <EssayContents />
    </Page>
  );
}

export default Essay;
