/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

import { visit } from "unist-util-visit";

const withCodeAttributes = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre") {
      const attributes: {
        [key: string]: string | number;
      } = {};

      // 确保pre节点有子节点
      if (!Array.isArray(node.children) || node.children.length === 0) {
        return;
      }

      const firstNode = node.children[0];

      // 确保第一个子节点是code标签
      if (!firstNode || firstNode.tagName !== "code") {
        return;
      }

      // lines attribute
      if (Array.isArray(firstNode.children) && firstNode.children.length > 0) {
        attributes.lines = firstNode.children.length;
      }

      // language attribute
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

      // 解析meta数据
      const data = firstNode.data || {};
      const meta = typeof data.meta === "string" ? data.meta : "";
      const metas = meta.match(/[^{}]+(?=})/g) || [];

      // 解析动态属性
      metas.forEach((attr: string) => {
        if (typeof attr === "string" && attr.includes(":")) {
          const parts = attr.split(":");
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join(":").trim(); // 处理值中包含冒号的情况
            
            if (key) {
              attributes[key] = val;
            }
          }
        }
      });

      // 应用属性
      const nodeProperties = node.properties || (node.properties = {});
      
      Object.keys(attributes).forEach((key) => {
        nodeProperties[`data-${key}`] = attributes[key];
      });
    }
  });
};

export default withCodeAttributes;