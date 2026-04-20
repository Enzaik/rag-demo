import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: [
    "@rag/shared",
    "react-markdown",
    "remark-gfm",
    "rehype-sanitize",
  ],
};

export default config;
