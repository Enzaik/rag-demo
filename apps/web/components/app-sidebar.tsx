"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut01, Plus, Settings01, Trash02 } from "@untitledui/icons";

import { ButtonUtility } from "@/components/ui/button-utility";
import { cn } from "@/lib/utils";
import {
  useConversations,
  useCreateConversation,
  useDeleteConversation,
} from "@/hooks/use-conversations";
import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: conversations, isLoading } = useConversations();
  const create = useCreateConversation();
  const remove = useDeleteConversation();
  const [signingOut, setSigningOut] = useState(false);

  async function onNew() {
    const conv = await create.mutateAsync(undefined);
    router.push(`/chat/${conv.id}`);
  }

  async function onSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const settingsActive = pathname === "/settings";

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

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
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

      <div className="flex flex-col gap-0.5 border-t border-secondary pt-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition",
            settingsActive
              ? "bg-primary_hover text-secondary"
              : "text-quaternary hover:text-secondary",
          )}
        >
          <Settings01 className="size-4 shrink-0" />
          Settings
        </Link>
        <Button
          variant="ghost"
          onClick={onSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold text-quaternary transition hover:text-secondary disabled:opacity-60"
        >
          <LogOut01 className="size-4 shrink-0" />
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </div>
    </aside>
  );
}
