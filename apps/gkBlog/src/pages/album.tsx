import AlbumContents from "@/contents/album";
import Page from "@/contents-layouts/Page";

function Album() {
  return (
    <Page
      frontMatter={{
        title: "相册集",
        description: "分享生活的点滴",
        caption: "My",
      }}
    >
      <AlbumContents />
    </Page>
  );
}

export default Album;
