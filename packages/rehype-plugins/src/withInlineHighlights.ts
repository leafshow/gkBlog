/* eslint-disable no-param-reassign */
import { visit } from "unist-util-visit";

const withInlineHighlights = () => (tree: any) => {
  visit(tree, "element", (codeElement, _index, parent) => {
    // 确保父节点是pre且当前节点是code
    if (!parent || parent.tagName !== "pre" || codeElement.tagName !== "code") {
      return;
    }

    // 解析meta数据
    const meta = codeElement.data?.meta || "";
    const metas = meta.match(/[^{}]+(?=})/g) || [];

    // 处理每个属性
    metas.forEach((attr: string) => {
      // 确保属性包含冒号
      if (typeof attr === "string" && attr.includes(":")) {
        const [key, val] = attr.split(":").map((s) => s.trim());

        // 检查是否是inlineHighlight属性
        if (key.toLowerCase() === "inlinehighlight") {
          // 解析参数: keyword|selectedIndices|className
          const [keyword, selected = "0", className = ""] = val.split("|").map((s) => s.trim());
          
          // 解析选中的索引
          const selectedIdx = selected === "0" ? [] : selected.split(",").map((s) => s.trim());
          
          // 遍历所有文本节点
          let matchIndex = 0;
          
          visit(codeElement, "text", (textNode, index, parentNode) => {
            // 确保index有效
            if (typeof index !== "number" || !parentNode || !Array.isArray(parentNode.children)) {
              return;
            }
            
            // 检查文本是否匹配关键字
            if (textNode.value === keyword) {
              matchIndex += 1;
              
              // 如果指定了选中索引，检查当前匹配是否在选中列表中
              if (selectedIdx.length > 0 && !selectedIdx.includes(matchIndex.toString())) {
                return;
              }
              
              // 创建高亮span元素
              const highlightNode = {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["inline-highlight", className].filter(Boolean), // 过滤掉空字符串
                },
                children: [textNode],
              };
              
              // 替换文本节点为高亮节点
              parentNode.children[index] = highlightNode;
            }
          });
        }
      }
    });
  });
};

export default withInlineHighlights;