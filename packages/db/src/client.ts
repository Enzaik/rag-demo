import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolConfig } from "pg";
import * as schema from "./schema.js";

export function createDb(config: { connectionString: string } & Omit<PoolConfig, "connectionString">) {
  const pool = new Pool(config);
  const db = drizzle(pool, { schema });
  return { db, pool };
}

export type Database = ReturnType<typeof createDb>["db"];
