import { readFile, readdir } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { Injectable, Logger } from "@nestjs/common";
import { and, eq, inArray } from "drizzle-orm";
import { chunks, documents, type Database } from "@rag/db";
import { chunkText } from "./chunker";
import { EmbeddingsService } from "./embeddings.service";

const CONTENT_DIR = resolve(__dirname, "../../../../content");

@Injectable()
export class MarkdownIngestor {
  private readonly logger = new Logger(MarkdownIngestor.name);

  constructor(private readonly embeddings: EmbeddingsService) {}

  async ingestAll(
    db: Database,
    contentDir: string = CONTENT_DIR,
  ): Promise<{ documents: number; chunks: number }> {
    const files = await readdir(contentDir);
    const markdowns = files.filter((f) => extname(f).toLowerCase() === ".md");

    let totalChunks = 0;
    for (const file of markdowns) {
      const chunkCount = await this.ingestFile(db, join(contentDir, file));
      totalChunks += chunkCount;
    }

    this.logger.log(`ingested ${markdowns.length} markdown files → ${totalChunks} chunks`);
    return { documents: markdowns.length, chunks: totalChunks };
  }

  private async ingestFile(db: Database, filePath: string): Promise<number> {
    const raw = await readFile(filePath, "utf8");
    const sourceRef = basename(filePath);
    const title = extractTitle(raw) ?? sourceRef.replace(/\.md$/, "");

    const pieces = chunkText(raw);
    if (pieces.length === 0) return 0;

    // Idempotent: remove prior document + chunks for this file.
    const prior = await db
      .select({ id: documents.id })
      .from(documents)
      .where(and(eq(documents.source, "markdown"), eq(documents.sourceRef, sourceRef)));
    if (prior.length > 0) {
      const ids = prior.map((d) => d.id);
      await db.delete(chunks).where(inArray(chunks.documentId, ids));
      await db.delete(documents).where(inArray(documents.id, ids));
    }

    const [doc] = await db
      .insert(documents)
      .values({ source: "markdown", sourceRef, title })
      .returning({ id: documents.id });
    if (!doc) throw new Error(`failed to insert document for ${sourceRef}`);

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

function extractTitle(markdown: string): string | null {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? null;
}
