import type {
  Conversation,
  CreateConversationRequest,
  ListConversationsResponse,
  ListMessagesResponse,
  Message,
  SendMessageRequest,
} from "@rag/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function listConversations(): Promise<ListConversationsResponse> {
  return request<ListConversationsResponse>("/conversations");
}

export function createConversation(body: CreateConversationRequest): Promise<Conversation> {
  return request<Conversation>("/conversations", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function listMessages(id: string): Promise<ListMessagesResponse> {
  return request<ListMessagesResponse>(`/conversations/${id}/messages`);
}

export function sendMessage(id: string, body: SendMessageRequest): Promise<Message> {
  return request<Message>(`/conversations/${id}/messages`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
