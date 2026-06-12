"use client";

import { useChatControllerMarkNewestConversationMessageAsSeen } from "../../../services/generated/chat/chat";

export function useMarkConversationSeen() {
  return useChatControllerMarkNewestConversationMessageAsSeen();
}
