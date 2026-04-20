import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { makeQueryClient } from "@/lib/query-client";
import { listConversationsServer } from "@/lib/api-server";
import { conversationKeys } from "@/lib/query-keys";
import { getSession } from "@/lib/session";

import { ChatSidebar } from "./chat-sidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const queryClient = makeQueryClient();
  await queryClient.prefetchQuery({
    queryKey: conversationKeys.list(),
    queryFn: async () => (await listConversationsServer()).conversations,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen">
        <ChatSidebar />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </HydrationBoundary>
  );
}
