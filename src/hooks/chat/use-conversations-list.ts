"use client";

import { useChatControllerGetConversations } from "../../../services/generated/chat/chat";

export function useConversationsList(limit = 20) {
  const query = useChatControllerGetConversations({ cursor: null, limit });
  const conversations = query.data?.conversations ?? [];

  return { ...query, conversations };
}
