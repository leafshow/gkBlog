/* eslint-disable no-plusplus */

const withStrict = () => (tree) => {
  for (let nodeIndex = 0; nodeIndex < tree.children.length; nodeIndex++) {
    const node = tree.children[nodeIndex];

    if (
      (node.type === "heading" && ![2, 3, 4].includes(node.depth)) ||
      (node.type === "mdxJsxFlowElement" &&
        ["h1", "h6"].includes(node.name)) // 仅禁止 h1、h6
    ) {
      throw new Error("Headings depths other than 2, 3, or 4 are not allowed.");
    }
  }
};

export default withStrict;