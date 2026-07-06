'use client';

import {
    getChatControllerGetConversationsInfiniteQueryKey,
    useChatControllerMarkNewestConversationMessageAsSeen
} from '@services/generated/chat/chat';
import type { ConversationsListResponseDto } from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useMarkConversationSeen() {
    const queryClient = useQueryClient();

    return useChatControllerMarkNewestConversationMessageAsSeen({
        mutation: {
            onSuccess: (_data, variables) => {
                queryClient.setQueriesData<InfiniteData<ConversationsListResponseDto>>(
                    {
                        queryKey: getChatControllerGetConversationsInfiniteQueryKey()
                    },
                    (oldData) => {
                        if (!oldData) return oldData;

                        return {
                            ...oldData,
                            pages: oldData.pages.map((page) => ({
                                ...page,
                                conversations: page.conversations.map((conversation) =>
                                    conversation.id === variables.conversationId ? { ...conversation, isRead: true } : conversation
                                )
                            }))
                        };
                    }
                );
            },
            onError: (error) => {
                // silent log
                console.error('Error marking conversation as seen:', error);
            }
        }
    });
}
