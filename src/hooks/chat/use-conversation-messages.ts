"use client";

import { fallbackMessages } from "@/lib/app-data";
import { useChatControllerGetConversationMessages } from "../../../services/generated/chat/chat";

export function useConversationMessages(conversationId: string) {
  const query = useChatControllerGetConversationMessages(conversationId);
  const messages = query.data?.messages?.length
    ? query.data.messages
    : fallbackMessages;

  return { ...query, messages };
}
