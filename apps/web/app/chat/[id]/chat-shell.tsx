"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Stop } from "@untitledui/icons";

import { Button } from "@/components/ui/button";
import { ButtonUtility } from "@/components/ui/button-utility";
import { Input } from "@/components/ui/input";
import { useApiKey } from "@/hooks/use-api-key";
import { useMessages } from "@/hooks/use-messages";
import { conversationTitleFromUserMessage } from "@/lib/conversation-title";
import { listMessages } from "@/lib/api";
import { conversationKeys } from "@/lib/query-keys";
import type { ListConversationsResponse } from "@rag/shared";
import type { Citation } from "@rag/shared";

import { ChatBubble } from "./chat-bubble";

type SeedMsg = Pick<UIMessage, "id" | "role" | "content">;

export function ChatShell({
  conversationId,
  userId,
}: {
  conversationId: string;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const { data: stored } = useMessages(conversationId);
  const { key: apiKey, hydrated: apiKeyHydrated, read: readApiKey } = useApiKey(userId);

  // useChat feeds SWR `fallbackData` from `initialMessages`. If this changes when
  // React Query refetches (e.g. after the first reply), the thread can reset to
  // empty. Seed once when messages have loaded, then never update — runtime history
  // is owned by useChat + setMessages in onFinish.
  const frozenInitial = useRef<SeedMsg[] | "pending">("pending");
  const prevConversationId = useRef(conversationId);
  if (prevConversationId.current !== conversationId) {
    prevConversationId.current = conversationId;
    frozenInitial.current = "pending";
  }
  if (frozenInitial.current === "pending" && stored !== undefined) {
    frozenInitial.current = stored.map((m) => ({
      id: m.id,
      role: m.role as UIMessage["role"],
      content: m.content,
    }));
  }
  const initialMessages = frozenInitial.current === "pending" ? [] : frozenInitial.current;

  const citationsById = useMemo(() => {
    const map = new Map<string, Citation[]>();
    for (const m of stored ?? []) {
      if (m.citations?.length) map.set(m.id, m.citations);
    }
    return map;
  }, [stored]);

  const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop, error } =
    useChat({
      api: "/api/chat",
      id: conversationId,
      initialMessages,
      // Inject the per-user API key at submit time so a key change takes effect
      // without reloading the chat.
      experimental_prepareRequestBody: ({ messages: msgs }) => ({
        conversationId,
        messages: msgs,
        apiKey: readApiKey() ?? undefined,
      }),
      onFinish: async () => {
        // Do not use fetchQuery here: global staleTime (30s) keeps the prefetched
        // `[]` "fresh", so fetchQuery returns cached empty messages and setMessages
        // wipes the thread right after the stream completes.
        const fresh = (await listMessages(conversationId)).messages;
        queryClient.setQueryData(conversationKeys.messages(conversationId), fresh);
        setMessages(
          fresh.map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
          })),
        );
        // Merge sidebar title without invalidating the list (invalidation refetches can
        // briefly desync React Query + useChat and clear the thread UI).
        const firstUser = fresh.find((m) => m.role === "user");
        if (firstUser?.content?.trim()) {
          const autoTitle = conversationTitleFromUserMessage(firstUser.content);
          const listKey = conversationKeys.list();
          const prev = queryClient.getQueryData<ListConversationsResponse>(listKey);
          const rows = prev?.conversations;

          if (!Array.isArray(rows)) {
            void queryClient.invalidateQueries({ queryKey: listKey });
          } else if (!rows.some((c) => c.id === conversationId)) {
            void queryClient.invalidateQueries({ queryKey: listKey });
          } else {
            queryClient.setQueryData<ListConversationsResponse>(listKey, {
              conversations: rows.map((c) =>
                c.id === conversationId && !c.title?.trim()
                  ? { ...c, title: autoTitle }
                  : c,
              ),
            });
          }
        }
      },
    });

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, status]);

  const [openCitation, setOpenCitation] = useState<string | null>(null);
  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-8">
          {messages.length === 0 && (
            <p className="py-16 text-center text-sm text-tertiary">
              Ask a question to start.
            </p>
          )}
          {messages.map((m) => (
            <ChatBubble
              key={m.id}
              id={m.id}
              role={m.role}
              content={m.content}
              citations={citationsById.get(m.id)}
              openCitation={openCitation}
              onOpenCitationChange={setOpenCitation}
            />
          ))}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-secondary bg-primary p-4"
      >
        {apiKeyHydrated && !apiKey && (
          <p className="mx-auto mb-2 max-w-3xl text-xs text-tertiary">
            No OpenAI key set for your account —{" "}
            <Link href="/settings" className="font-medium text-brand-secondary hover:underline">
              add one in Settings
            </Link>{" "}
            to use your own key. Until then, the server&apos;s default key is used if
            configured.
          </p>
        )}
        {error && (
          <p className="mx-auto mb-2 max-w-3xl text-sm text-error-primary">
            {error.message}
          </p>
        )}
        <div className="mx-auto flex w-full max-w-3xl items-center gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question…"
            disabled={isStreaming}
            className="flex-1"
          />
          {isStreaming ? (
            <ButtonUtility
              icon={Stop}
              size="sm"
              color="secondary"
              tooltip="Stop"
              onClick={() => stop()}
              aria-label="Stop"
            />
          ) : (
            <Button type="submit" size="sm" disabled={!input.trim()}>
              <ArrowUp />
              Send
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
