import { z } from "zod";

// ---------------------------------------------------------------------------
// Retrieval
// ---------------------------------------------------------------------------

export const retrieveRequestSchema = z.object({
  query: z.string().min(1).max(4000),
  topK: z.number().int().min(1).max(20).optional(),
});
export type RetrieveRequest = z.infer<typeof retrieveRequestSchema>;

export const retrievedChunkSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  score: z.number(),
  source: z.enum(["markdown", "product"]),
  sourceRef: z.string(),
  documentId: z.string().uuid(),
  documentTitle: z.string(),
});
export type RetrievedChunk = z.infer<typeof retrievedChunkSchema>;

export const retrieveResponseSchema = z.object({
  chunks: z.array(retrievedChunkSchema),
});
export type RetrieveResponse = z.infer<typeof retrieveResponseSchema>;

// ---------------------------------------------------------------------------
// Conversations & messages
// ---------------------------------------------------------------------------

export const messageRoleSchema = z.enum(["user", "assistant", "system"]);
export type MessageRole = z.infer<typeof messageRoleSchema>;

export const citationSchema = z.object({
  chunkId: z.string().uuid(),
  score: z.number(),
});
export type Citation = z.infer<typeof citationSchema>;

export const conversationSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const messageSchema = z.object({
  id: z.string().uuid(),
  conversationId: z.string().uuid(),
  role: messageRoleSchema,
  content: z.string(),
  citations: z.array(citationSchema),
  createdAt: z.string().datetime(),
});
export type Message = z.infer<typeof messageSchema>;

export const createConversationRequestSchema = z.object({
  title: z.string().max(200).optional(),
});
export type CreateConversationRequest = z.infer<typeof createConversationRequestSchema>;

export const sendMessageRequestSchema = z.object({
  role: messageRoleSchema,
  content: z.string().min(1),
  citations: z.array(citationSchema).optional(),
});
export type SendMessageRequest = z.infer<typeof sendMessageRequestSchema>;

export const listConversationsResponseSchema = z.object({
  conversations: z.array(conversationSchema),
});
export type ListConversationsResponse = z.infer<typeof listConversationsResponseSchema>;

export const listMessagesResponseSchema = z.object({
  messages: z.array(messageSchema),
});
export type ListMessagesResponse = z.infer<typeof listMessagesResponseSchema>;
