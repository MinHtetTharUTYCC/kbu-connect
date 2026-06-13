"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import {
  getChatControllerGetConversationsInfiniteQueryKey,
  useChatControllerMarkNewestConversationMessageAsSeen,
} from "../../../services/generated/chat/chat";
import type { ConversationsListResponseDto } from "../../../services/model";

export function useMarkConversationSeen() {
  const queryClient = useQueryClient();

  return useChatControllerMarkNewestConversationMessageAsSeen({
    mutation: {
      onError: (error) => {
        console.error("Error marking conversation as seen:", error);
      },
      onSuccess: (_data, variables) => {
        queryClient.setQueriesData<
          InfiniteData<ConversationsListResponseDto, string | null>
        >(
          {
            queryKey: getChatControllerGetConversationsInfiniteQueryKey(),
          },
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                conversations: page.conversations.map((conversation) =>
                  conversation.id === variables.conversationId
                    ? { ...conversation, isRead: true }
                    : conversation,
                ),
              })),
            };
          },
        );
      },
    },
  });
}
