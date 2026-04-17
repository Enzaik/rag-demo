import { config as loadEnv } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { resolve } from "node:path";

// Load .env from the repo root so `pnpm db:migrate` works without the
// caller having to export DATABASE_URL manually.
loadEnv({ path: resolve(__dirname, "../../../.env") });

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
    );
  }

  const pool = new Pool({ connectionString });
  const db = drizzle(pool);
  const migrationsFolder = resolve(__dirname, "../migrations");

  await migrate(db, { migrationsFolder });
  await pool.end();

  console.log("✓ migrations applied");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
