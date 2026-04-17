import config from "@rag/eslint-config/react";

export default [
  ...config,
  {
    ignores: [".next/**", "node_modules/**", "dist/**"],
  },
];
