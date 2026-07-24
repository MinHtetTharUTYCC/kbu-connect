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
            onMutate: (variables) => {
                queryClient.setQueriesData<InfiniteData<ConversationsListResponseDto>>(
                    {
                        queryKey: getChatControllerGetConversationsInfiniteQueryKey()
                    },
                    (oldData) => {
                        if (!oldData) return oldData;

                        const newPages = oldData.pages.map((page) => ({
                            ...page,
                            conversations: page.conversations.map((conversation) =>
                                conversation.id === variables.conversationId ? { ...conversation, isRead: true } : conversation
                            )
                        }));

                        return {
                            ...oldData,
                            pages: newPages
                        };
                    }
                );
            }
        }
    });
}
