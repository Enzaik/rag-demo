"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "@untitledui/icons";

import { ButtonUtility } from "@/components/ui/button-utility";
import { cn } from "@/lib/utils";
import { useConversations, useCreateConversation } from "@/hooks/use-conversations";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: conversations, isLoading } = useConversations();
  const create = useCreateConversation();

  async function onNew() {
    const conv = await create.mutateAsync(undefined);
    router.push(`/chat/${conv.id}`);
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-3 border-r border-secondary bg-primary p-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold text-primary">Conversations</h2>
        <ButtonUtility
          icon={Plus}
          size="xs"
          color="tertiary"
          tooltip="New conversation"
          onClick={onNew}
          disabled={create.isPending}
          aria-label="New conversation"
        />
      </div>

      <nav className="flex flex-col gap-0.5">
        {isLoading && <p className="px-2 text-sm text-tertiary">Loading…</p>}
        {!isLoading && conversations && conversations.length === 0 && (
          <p className="px-2 text-sm text-tertiary">No conversations yet.</p>
        )}
        {conversations?.map((c) => {
          const active = pathname === `/chat/${c.id}`;
          return (
            <Link
              key={c.id}
              href={`/chat/${c.id}`}
              className={cn(
                "truncate rounded-md px-2 py-2 text-md font-semibold transition md:text-sm text-quaternary hover:text-secondary",
                active && "bg-primary_hover group-hover:text-secondary_hover md:text-sm text-md text-secondary transition-inherit-all z-1",
              )}
            >
              {c.title || "Untitled"}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
