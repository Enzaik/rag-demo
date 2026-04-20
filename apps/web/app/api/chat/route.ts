import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type Message as AiMessage } from "ai";
import { NextResponse } from "next/server";

import { conversationTitleFromUserMessage } from "@/lib/conversation-title";
import { getSession } from "@/lib/session";
import { patchConversationServer, retrieveServer, sendMessageServer } from "@/lib/api-server";
import type { RetrievedChunk } from "@rag/shared";

export const runtime = "nodejs";

type ChatBody = {
  conversationId: string;
  messages: AiMessage[];
  apiKey?: string;
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { conversationId, messages, apiKey } = (await req.json()) as ChatBody;
  if (!conversationId || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const resolvedKey = apiKey?.trim() || process.env.OPENAI_API_KEY;
  if (!resolvedKey) {
    return NextResponse.json(
      { error: "No OpenAI API key. Set one in Settings or configure OPENAI_API_KEY on the server." },
      { status: 400 },
    );
  }
  const openai = createOpenAI({ apiKey: resolvedKey });

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !last.content.trim()) {
    return NextResponse.json({ error: "Last message must be from user" }, { status: 400 });
  }
  const userText = last.content;

  await sendMessageServer(conversationId, { role: "user", content: userText });

  const { chunks }: { chunks: RetrievedChunk[] } = await retrieveServer({
    query: userText,
    topK: 6,
    apiKey: apiKey?.trim() || undefined,
  });

  console.log(
    `[chat] retrieved ${chunks.length} chunks for "${userText}":`,
    chunks.map((c) => ({ title: c.documentTitle, ref: c.sourceRef, score: c.score.toFixed(3) })),
  );

  const context = chunks
    .map(
      (c, i) =>
        `[${i + 1}] ${c.documentTitle} (${c.source}:${c.sourceRef})\n${c.content}`,
    )
    .join("\n\n---\n\n");

  const system = [
    "You are the assistant for Alpine Forge, an outdoor gear company.",
    "Answer the user's question using the numbered context passages below. Prefer information from the context over prior knowledge.",
    "Quote or paraphrase relevant details when helpful, and cite the passages you used inline as [1], [2], etc.",
    "If the context is genuinely silent on the question, say so and suggest the closest related topic the context does cover.",
    "",
    "Context:",
    context || "(no context retrieved)",
  ].join("\n");

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system,
    messages,
    async onFinish({ text }) {
      await sendMessageServer(conversationId, {
        role: "assistant",
        content: text,
        citations: chunks.map((c) => ({
          chunkId: c.id,
          score: c.score,
          documentTitle: c.documentTitle,
          source: c.source,
          sourceRef: c.sourceRef,
          content: c.content,
        })),
      });
      try {
        await patchConversationServer(conversationId, {
          title: conversationTitleFromUserMessage(userText),
          onlyIfEmpty: true,
        });
      } catch (err) {
        console.error("[chat] auto-title:", err);
      }
    },
  });

  return result.toDataStreamResponse();
}
