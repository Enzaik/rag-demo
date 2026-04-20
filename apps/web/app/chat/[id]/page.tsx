import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import { listMessagesServer } from "@/lib/api-server";
import { makeQueryClient } from "@/lib/query-client";
import { conversationKeys } from "@/lib/query-keys";

import { ChatShell } from "./chat-shell";

export default async function ChatConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = makeQueryClient();
  try {
    await queryClient.prefetchQuery({
      queryKey: conversationKeys.messages(id),
      queryFn: async () => (await listMessagesServer(id)).messages,
    });
  } catch {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChatShell conversationId={id} />
    </HydrationBoundary>
  );
}
