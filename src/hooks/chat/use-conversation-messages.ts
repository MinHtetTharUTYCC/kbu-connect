"use client";

import { useChatControllerGetConversationMessages } from "../../../services/generated/chat/chat";

export function useConversationMessages(conversationId: string) {
  const query = useChatControllerGetConversationMessages(conversationId);
  const messages = query.data?.messages ?? [];

  return { ...query, messages };
}
