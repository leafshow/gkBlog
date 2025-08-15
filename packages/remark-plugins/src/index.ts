import remarkFrontMatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import withFrontMatter from "./withFrontMatter";
import withLayout from "./withLayout";
import withStrict from "./withStrict";

import type { PluggableList } from "unified";

const plugins: PluggableList = [
  remarkFrontMatter,
  remarkGfm,
  remarkMath,
  withFrontMatter,
  withStrict,
  withLayout,
];

const remarkPlugins = {
  plugins,
};

export default remarkPlugins;
