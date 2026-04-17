import "../load-env";
import { createDb } from "@rag/db";
import { EmbeddingsService } from "../ingestion/embeddings.service";
import { ProductsIngestor } from "../ingestion/products.ingestor";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");

  const { db, pool } = createDb({ connectionString });
  const ingestor = new ProductsIngestor(new EmbeddingsService());

  const result = await ingestor.ingestAll(db);
  console.log(`✓ ingested ${result.documents} products → ${result.chunks} chunks`);

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
