import rehypeKatex from "rehype-katex";
import rehypePrismPlus from "rehype-prism-plus";

import withCodeAttributes from "./withCodeAttributes";
import withInlineHighlights from "./withInlineHighlights";

import type { PluggableList } from "unified";

const plugins: PluggableList = [
  rehypeKatex,           // 处理数学公式
  withInlineHighlights,  // 自定义内联高亮
  withCodeAttributes,    // 自定义代码属性
  rehypePrismPlus,       // 最后进行语法高亮，确保所有预处理完成
];

const rehypePlugins = {
  plugins,
};

export default rehypePlugins;