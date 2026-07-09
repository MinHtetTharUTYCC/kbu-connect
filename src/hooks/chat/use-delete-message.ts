import { getChatControllerGetConversationMessagesInfiniteQueryKey, useChatControllerDeleteMessage } from '@services/generated/chat/chat';
import type { MessagesListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useDeleteMessage(conversationId: string) {
    const queryClient = useQueryClient();

    const queryKey = getChatControllerGetConversationMessagesInfiniteQueryKey(conversationId);

    return useChatControllerDeleteMessage({
        mutation: {
            onSuccess: (_data, variables) => {
                queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(queryKey, (old) => {
                    if (!old?.pages) return old;

                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            messages: page.messages.filter((msg) => msg.id !== variables.messageId)
                        }))
                    };
                });
            }
        }
    });
}
