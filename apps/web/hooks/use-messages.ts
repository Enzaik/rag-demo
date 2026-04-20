"use client";

import { useQuery } from "@tanstack/react-query";

import { listMessages } from "@/lib/api";
import { conversationKeys } from "@/lib/query-keys";

export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: conversationKeys.messages(conversationId),
    queryFn: async () => (await listMessages(conversationId)).messages,
    enabled: !!conversationId,
  });
}
