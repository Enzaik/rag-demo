import {
  pgTable,
  pgEnum,
  text,
  uuid,
  timestamp,
  integer,
  jsonb,
  vector,
  index,
} from "drizzle-orm/pg-core";

// better-auth-generated tables (user, session, account, verification).
// Produced by `pnpm dlx @better-auth/cli generate` — re-exported so drizzle-kit
// picks them up alongside our app tables.
export * from "./auth-schema";

export const documentSource = pgEnum("document_source", ["markdown", "product"]);
export const messageRole = pgEnum("message_role", ["user", "assistant", "system"]);

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  specs: jsonb("specs").$type<Record<string, unknown>>().notNull().default({}),
  priceCents: integer("price_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    source: documentSource("source").notNull(),
    sourceRef: text("source_ref").notNull(),
    title: text("title").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    sourceRefIdx: index("documents_source_ref_idx").on(table.source, table.sourceRef),
  }),
);

export const chunks = pgTable(
  "chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
    tokenCount: integer("token_count").notNull(),
    chunkIndex: integer("chunk_index").notNull(),
  },
  (table) => ({
    documentIdx: index("chunks_document_id_idx").on(table.documentId),
    embeddingIdx: index("chunks_embedding_idx").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  title: text("title").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRole("role").notNull(),
    content: text("content").notNull(),
    citations: jsonb("citations")
      .$type<Array<{ chunkId: string; score: number }>>()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    conversationIdx: index("messages_conversation_id_idx").on(table.conversationId),
  }),
);

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type Product = typeof products.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Chunk = typeof chunks.$inferSelect;
export type NewChunk = typeof chunks.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
