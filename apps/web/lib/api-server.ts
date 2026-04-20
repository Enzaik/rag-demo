import "server-only";

import { cookies } from "next/headers";
import type {
  Conversation,
  ListConversationsResponse,
  ListMessagesResponse,
  Message,
  PatchConversationRequest,
  RetrieveRequest,
  RetrieveResponse,
  SendMessageRequest,
} from "@rag/shared";

const API_INTERNAL_URL =
  process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function cookieHeader() {
  return (await cookies())
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

async function serverRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_INTERNAL_URL}${path}`, {
    ...init,
    headers: {
      cookie: await cookieHeader(),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
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

export function sendMessageServer(id: string, body: SendMessageRequest): Promise<Message> {
  return serverRequest<Message>(`/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function patchConversationServer(
  id: string,
  body: PatchConversationRequest,
): Promise<Conversation> {
  return serverRequest<Conversation>(`/conversations/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export function retrieveServer(body: RetrieveRequest): Promise<RetrieveResponse> {
  return serverRequest<RetrieveResponse>("/retrieve", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
