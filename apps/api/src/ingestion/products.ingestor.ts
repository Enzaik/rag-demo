import { Injectable, Logger } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { chunks, documents, products, type Database } from "@rag/db";
import { chunkText } from "./chunker";
import { EmbeddingsService } from "./embeddings.service";

@Injectable()
export class ProductsIngestor {
  private readonly logger = new Logger(ProductsIngestor.name);

  constructor(private readonly embeddings: EmbeddingsService) {}

  async ingestAll(db: Database): Promise<{ documents: number; chunks: number }> {
    const allProducts = await db.select().from(products);
    let totalChunks = 0;

    for (const product of allProducts) {
      const chunkCount = await this.ingestOne(db, product);
      totalChunks += chunkCount;
    }

    this.logger.log(`ingested ${allProducts.length} products → ${totalChunks} chunks`);
    return { documents: allProducts.length, chunks: totalChunks };
  }

  private async ingestOne(
    db: Database,
    product: typeof products.$inferSelect,
  ): Promise<number> {
    const body = renderProductText(product);
    const pieces = chunkText(body);
    if (pieces.length === 0) return 0;

    // Idempotent: remove any prior document+chunks for this source ref.
    const prior = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(eq(documents.source, "product"), eq(documents.sourceRef, product.id)));
    if (prior.length > 0) {
      await db.delete(chunks).where(
        inArray(
          chunks.documentId,
          prior.map((d) => d.id),
        ),
      );
      await db.delete(documents).where(
        inArray(
          documents.id,
          prior.map((d) => d.id),
        ),
      );
    }

    const [doc] = await db
      .insert(documents)
      .values({
        source: "product",
        sourceRef: product.id,
        title: product.name,
      })
      .returning({ id: documents.id });
    if (!doc) throw new Error("failed to insert product document");

    const vectors = await this.embeddings.embedBatch(pieces.map((p) => p.content));

    await db.insert(chunks).values(
      pieces.map((piece, i) => ({
        documentId: doc.id,
        content: piece.content,
        embedding: vectors[i] as number[],
        tokenCount: piece.tokenCount,
        chunkIndex: piece.index,
      })),
    );

    return pieces.length;
  }
}

function renderProductText(product: typeof products.$inferSelect): string {
  const specLines = Object.entries(product.specs).map(
    ([k, v]) => `- ${k}: ${typeof v === "object" ? JSON.stringify(v) : String(v)}`,
  );
  return [
    `Product: ${product.name}`,
    `Price: $${(product.priceCents / 100).toFixed(2)}`,
    "",
    product.description,
    "",
    "Specifications:",
    ...specLines,
  ].join("\n");
}
