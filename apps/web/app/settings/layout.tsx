import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { listConversationsServer } from "@/lib/api-server";
import { makeQueryClient } from "@/lib/query-client";
import { conversationKeys } from "@/lib/query-keys";
import { getSession } from "@/lib/session";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
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
        <AppSidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </HydrationBoundary>
  );
}
