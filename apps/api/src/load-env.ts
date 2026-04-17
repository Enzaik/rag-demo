import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

// Monorepo root `.env` so the API and better-auth CLI work regardless of cwd.
loadEnv({ path: resolve(__dirname, "../../../.env") });
