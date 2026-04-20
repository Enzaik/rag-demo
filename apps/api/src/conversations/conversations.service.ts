import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import { conversations, messages, type Database } from "@rag/db";
import type { Citation, Conversation, Message, MessageRole } from "@rag/shared";

@Injectable()
export class ConversationsService {
  async list(db: Database, userId: string): Promise<Conversation[]> {
    const rows = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .orderBy(desc(conversations.updatedAt));
    return rows.map(toConversation);
  }

  async create(db: Database, userId: string, title?: string): Promise<Conversation> {
    const [row] = await db
      .insert(conversations)
      .values({ userId, title: title ?? "" })
      .returning();
    if (!row) throw new Error("failed to insert conversation");
    return toConversation(row);
  }

  async listMessages(
    db: Database,
    userId: string,
    conversationId: string,
  ): Promise<Message[]> {
    await this.assertOwnership(db, userId, conversationId);
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
    return rows.map(toMessage);
  }

  async appendMessage(
    db: Database,
    userId: string,
    conversationId: string,
    input: { role: MessageRole; content: string; citations?: Citation[] },
  ): Promise<Message> {
    await this.assertOwnership(db, userId, conversationId);

    const [row] = await db
      .insert(messages)
      .values({
        conversationId,
        role: input.role,
        content: input.content,
        citations: input.citations ?? [],
      })
      .returning();
    if (!row) throw new Error("failed to insert message");

    // Touch updatedAt on the conversation so the sidebar sorts sensibly.
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));

    return toMessage(row);
  }

  async deleteConversation(db: Database, userId: string, conversationId: string): Promise<void> {
    await this.assertOwnership(db, userId, conversationId);
    await db.delete(conversations).where(eq(conversations.id, conversationId));
  }

  async patchConversation(
    db: Database,
    userId: string,
    conversationId: string,
    input: { title: string; onlyIfEmpty?: boolean },
  ): Promise<Conversation> {
    await this.assertOwnership(db, userId, conversationId);
    if (input.onlyIfEmpty) {
      const [existing] = await db
        .select()
        .from(conversations)
        .where(eq(conversations.id, conversationId));
      if (!existing) throw new NotFoundException("conversation not found");
      if (existing.title?.trim()) {
        return toConversation(existing);
      }
    }
    const [updated] = await db
      .update(conversations)
      .set({ title: input.title, updatedAt: new Date() })
      .where(eq(conversations.id, conversationId))
      .returning();
    if (!updated) throw new NotFoundException("conversation not found");
    return toConversation(updated);
  }

  private async assertOwnership(db: Database, userId: string, conversationId: string) {
    const [row] = await db
      .select({ userId: conversations.userId })
      .from(conversations)
      .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)));
    if (!row) {
      // Hide the distinction between "doesn't exist" and "not yours".
      throw new NotFoundException("conversation not found");
    }
    if (row.userId !== userId) {
      throw new ForbiddenException();
    }
  }
}

function toConversation(row: typeof conversations.$inferSelect): Conversation {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toMessage(row: typeof messages.$inferSelect): Message {
  return {
    id: row.id,
    conversationId: row.conversationId,
    role: row.role,
    content: row.content,
    citations: row.citations,
    createdAt: row.createdAt.toISOString(),
  };
}
