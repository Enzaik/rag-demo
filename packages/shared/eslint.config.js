import config from "@rag/eslint-config/node";

export default [...config, { ignores: ["dist/**", "node_modules/**"] }];
