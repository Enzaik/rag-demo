import "../load-env";
import { createDb, products } from "@rag/db";
import { sql } from "drizzle-orm";
import { productsSeed } from "./products.data";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const { db, pool } = createDb({ connectionString });

  const existing = await db.execute<{ count: string }>(sql`select count(*)::text as count from products`);
  const currentCount = Number(existing.rows[0]?.count ?? "0");
  if (currentCount > 0) {
    console.log(`products table already has ${currentCount} rows — skipping seed`);
    await pool.end();
    return;
  }

  await db.insert(products).values(productsSeed);
  console.log(`✓ inserted ${productsSeed.length} products`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
