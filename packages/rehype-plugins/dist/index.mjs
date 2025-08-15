// src/index.ts
import rehypeKatex from "rehype-katex";
import rehypePrismPlus from "rehype-prism-plus";

// src/withCodeAttributes.ts
import { visit } from "unist-util-visit";
var withCodeAttributes = () => (tree) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre") {
      const attributes = {};
      if (!Array.isArray(node.children) || node.children.length === 0) {
        return;
      }
      const firstNode = node.children[0];
      if (!firstNode || firstNode.tagName !== "code") {
        return;
      }
      if (Array.isArray(firstNode.children) && firstNode.children.length > 0) {
        attributes.lines = firstNode.children.length;
      }
      const properties = node.properties || {};
      const className = Array.isArray(properties.className) ? properties.className : [];
      if (className.length > 0) {
        const firstClass = className[0];
        if (typeof firstClass === "string") {
          const lang = firstClass.replace("language-", "") || "";
          if (lang) {
            attributes.language = lang;
          }
        }
      }
      const data = firstNode.data || {};
      const meta = typeof data.meta === "string" ? data.meta : "";
      const metas = meta.match(/[^{}]+(?=})/g) || [];
      metas.forEach((attr) => {
        if (typeof attr === "string" && attr.includes(":")) {
          const parts = attr.split(":");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(":").trim();
            if (key) {
              attributes[key] = val;
            }
          }
        }
      });
      const nodeProperties = node.properties || (node.properties = {});
      Object.keys(attributes).forEach((key) => {
        nodeProperties[`data-${key}`] = attributes[key];
      });
    }
  });
};
var withCodeAttributes_default = withCodeAttributes;

// src/withInlineHighlights.ts
import { visit as visit2 } from "unist-util-visit";
var withInlineHighlights = () => (tree) => {
  visit2(tree, "element", (codeElement, _index, parent) => {
    if (!parent || parent.tagName !== "pre" || codeElement.tagName !== "code") {
      return;
    }
    const meta = codeElement.data?.meta || "";
    const metas = meta.match(/[^{}]+(?=})/g) || [];
    metas.forEach((attr) => {
      if (typeof attr === "string" && attr.includes(":")) {
        const [key, val] = attr.split(":").map((s) => s.trim());
        if (key.toLowerCase() === "inlinehighlight") {
          const [keyword, selected = "0", className = ""] = val.split("|").map((s) => s.trim());
          const selectedIdx = selected === "0" ? [] : selected.split(",").map((s) => s.trim());
          let matchIndex = 0;
          visit2(codeElement, "text", (textNode, index, parentNode) => {
            if (typeof index !== "number" || !parentNode || !Array.isArray(parentNode.children)) {
              return;
            }
            if (textNode.value === keyword) {
              matchIndex += 1;
              if (selectedIdx.length > 0 && !selectedIdx.includes(matchIndex.toString())) {
                return;
              }
              const highlightNode = {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["inline-highlight", className].filter(Boolean)
                  // 过滤掉空字符串
                },
                children: [textNode]
              };
              parentNode.children[index] = highlightNode;
            }
          });
        }
      }
    });
  });
};
var withInlineHighlights_default = withInlineHighlights;

// src/index.ts
var plugins = [
  rehypeKatex,
  // 处理数学公式
  withInlineHighlights_default,
  // 自定义内联高亮
  withCodeAttributes_default,
  // 自定义代码属性
  rehypePrismPlus
  // 最后进行语法高亮，确保所有预处理完成
];
var rehypePlugins = {
  plugins
};
var index_default = rehypePlugins;
export {
  index_default as default
};
