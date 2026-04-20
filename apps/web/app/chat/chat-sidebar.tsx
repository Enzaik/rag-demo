"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, Trash02 } from "@untitledui/icons";

import { ButtonUtility } from "@/components/ui/button-utility";
import { cn } from "@/lib/utils";
import { useConversations, useCreateConversation, useDeleteConversation } from "@/hooks/use-conversations";

export function ChatSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: conversations, isLoading } = useConversations();
  const create = useCreateConversation();
  const remove = useDeleteConversation();

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
            <div
              key={c.id}
              className={cn(
                "group flex items-center gap-1 rounded-md py-1 pl-1 pr-0.5",
                active && "bg-primary_hover",
              )}
            >
              <Link
                href={`/chat/${c.id}`}
                className={cn(
                  "min-w-0 flex-1 truncate px-1 py-1.5 text-md font-semibold transition md:text-sm text-quaternary hover:text-secondary",
                  active && "text-secondary md:text-sm text-md",
                )}
              >
                {c.title?.trim() ? c.title : "New chat"}
              </Link>
              <ButtonUtility
                icon={Trash02}
                size="xs"
                color="tertiary"
                tooltip="Delete conversation"
                isDisabled={remove.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  void remove.mutateAsync(c.id);
                }}
                className="shrink-0 opacity-50 transition-opacity hover:opacity-100 group-hover:opacity-80"
              />
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
