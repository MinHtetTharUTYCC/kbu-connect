"use client";

import { fallbackConversations } from "@/lib/app-data";
import { useChatControllerGetConversations } from "../../../services/generated/chat/chat";

export function useConversationsList(limit = 20) {
  const query = useChatControllerGetConversations({ cursor: null, limit });
  const conversations = query.data?.conversations?.length
    ? query.data.conversations
    : fallbackConversations;

  return { ...query, conversations };
}
