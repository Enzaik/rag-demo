import "server-only";

import { cookies } from "next/headers";
import type { ListConversationsResponse, ListMessagesResponse } from "@rag/shared";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function serverRequest<T>(path: string): Promise<T> {
  const cookieHeader = (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_INTERNAL_URL}${path}`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Server request failed: ${path} (${res.status})`);
  }
  return (await res.json()) as T;
}

export function listConversationsServer(): Promise<ListConversationsResponse> {
  return serverRequest<ListConversationsResponse>("/conversations");
}

export function listMessagesServer(id: string): Promise<ListMessagesResponse> {
  return serverRequest<ListMessagesResponse>(`/conversations/${id}/messages`);
}
