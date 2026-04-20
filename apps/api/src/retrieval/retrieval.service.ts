import { Injectable } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { Database } from "@rag/db";
import type { RetrievedChunk } from "@rag/shared";
import { EmbeddingsService } from "../ingestion/embeddings.service";

const DEFAULT_TOP_K = 6;

@Injectable()
export class RetrievalService {
  constructor(private readonly embeddings: EmbeddingsService) {}

  async retrieve(
    db: Database,
    query: string,
    topK: number = DEFAULT_TOP_K,
    apiKey?: string,
  ): Promise<RetrievedChunk[]> {
    const vector = await this.embeddings.embedOne(query, apiKey);
    const literal = `[${vector.join(",")}]`;

    const rows = await db.execute<{
      id: string;
      content: string;
      score: number;
      source: "markdown" | "product";
      source_ref: string;
      document_id: string;
      document_title: string;
    }>(sql`
      select
        c.id,
        c.content,
        1 - (c.embedding <=> ${literal}::vector) as score,
        d.source,
        d.source_ref,
        c.document_id,
        d.title as document_title
      from chunks c
      join documents d on d.id = c.document_id
      order by c.embedding <=> ${literal}::vector
      limit ${topK}
    `);

    return rows.rows.map((r) => ({
      id: r.id,
      content: r.content,
      score: Number(r.score),
      source: r.source,
      sourceRef: r.source_ref,
      documentId: r.document_id,
      documentTitle: r.document_title,
    }));
  }
}
