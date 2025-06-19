/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ["@typescript-eslint", "simple-import-sort", "react", "import"],
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@next/next/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
  rules: {
    // Next.js 特定规则
    "@next/next/no-html-link-for-pages": ["error", "apps/gkBlog/src/pages"],
    "@next/next/no-img-element": "off", // 允许使用原生 img 标签
    
    // 允许特定的下划线变量
    "no-underscore-dangle": ["error", { allow: ["_id", "_count", "_sum"] }],
    
    // 导入规则优化
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        ts: "never",
        tsx: "never",
        js: "never",
        jsx: "never",
      },
    ],
    "import/no-unresolved": "off", // 让 TypeScript 处理未解析的导入
    "import/order": "off", // 使用 simple-import-sort 替代
    "import/prefer-default-export": "off",
    
    // 导入排序规则
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // 外部依赖
          ["^@?\\w", "^\\u0000"],
          // 内部组件和提供者
          ["^@/components", "^@/providers"],
          // 钩子
          ["^@/hooks"],
          // 工具和库
          ["^@/utils", "^@/helpers", "^@/lib"],
          // 其他内部模块
          ["^@/"],
          // 相对路径
          ["^\\."],
          // 类型导入
          ["^.*\\u0000$", "^@/types"],
          // 样式文件
          ["^.+\\.s?css$"],
        ],
      },
    ],
    
    // React 规则调整
    "react/function-component-definition": [
      "error",
      { namedComponents: "arrow-function" },
    ],
    "react/require-default-props": "off", // 使用 TypeScript 类型替代
    "react/jsx-props-no-spreading": [
    "error",
    {
      html: "ignore", // 只保留支持的选项
      exceptions: [],
      },
    ],
    "react/jsx-filename-extension": [
      "error",
      { extensions: [".tsx", ".jsx"] },
    ],
    
    // TypeScript 规则
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off", // 可以根据需要调整
  },
  ignorePatterns: [
    ".next",
    ".turbo",
    "node_modules",
    "**/*.js",
    "**/*.mjs",
    "**/*.jsx",
  ],
};