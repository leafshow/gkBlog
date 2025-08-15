import TILContents from "@/contents/TIL";
import Page from "@/contents-layouts/Page";

function TIL() {
  return (
    <Page
      frontMatter={{
        title: "T.I.L",
        description: `学习过程记录`,
      }}
    >
      <TILContents />
    </Page>
  );
}

export default TIL;
