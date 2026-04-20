"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import { createConversation, deleteConversation, listConversations } from "@/lib/api";
import { conversationKeys } from "@/lib/query-keys";

export function useConversations() {
  return useQuery({
    queryKey: conversationKeys.list(),
    queryFn: async () => (await listConversations()).conversations,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => createConversation({ title }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: conversationKeys.list() });
    },
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  return useMutation({
    mutationFn: (id: string) => deleteConversation(id),
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: conversationKeys.messages(id) });
      qc.invalidateQueries({ queryKey: conversationKeys.list() });
      if (pathname === `/chat/${id}`) {
        router.push("/chat");
      }
    },
  });
}
