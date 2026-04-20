"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createConversation, listConversations } from "@/lib/api";
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
