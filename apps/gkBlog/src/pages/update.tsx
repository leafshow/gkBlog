import UpdateContents from "@/contents/update";
import Page from "@/contents-layouts/Page";

function Update() {
  return (
    <Page
      frontMatter={{
        title: "gkBlog 主题更新日志",
        description: "此页面是 gkBlog 主题的更新日志，记录了此网站的生命历程。",
        caption: "Theme Update Log",
      }}
    >
      <UpdateContents />
    </Page>
  );
}

export default Update;
