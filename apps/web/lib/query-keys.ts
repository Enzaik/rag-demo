export const conversationKeys = {
  all: ["conversations"] as const,
  list: () => [...conversationKeys.all, "list"] as const,
  messages: (id: string) => [...conversationKeys.all, id, "messages"] as const,
};
