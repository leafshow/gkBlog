import MessagesContents from "@/contents/feedback";
import Page from "@/contents-layouts/Page";

// 添加这行代码，强制使用 Node.js 运行时
export const runtime = "nodejs";

const Messages = () => (
  <Page
    frontMatter={{
      title: "留言反馈",
      description: "欢迎在留言板上分享您的意见或建议",
      caption: "More",
    }}
  >
    <MessagesContents />
  </Page>
);

export default Messages;
