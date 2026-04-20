/** Same rules as PATCH auto-title on the API: first-line label from the opening user prompt. */
export function conversationTitleFromUserMessage(userText: string): string {
  const normalized = userText.replace(/\s+/g, " ").trim();
  if (!normalized) return "Chat";
  return normalized.length <= 60 ? normalized : `${normalized.slice(0, 57)}…`;
}
