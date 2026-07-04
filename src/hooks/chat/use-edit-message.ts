import {
    getChatControllerGetConversationMessagesInfiniteQueryKey,
    useChatControllerEditMessage,
} from '@services/generated/chat/chat';
import type { MessagesListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';

export function useEditMessage(conversationId: string) {
    const queryClient = useQueryClient();

    const queryKey =
        getChatControllerGetConversationMessagesInfiniteQueryKey(
            conversationId,
        );

    return useChatControllerEditMessage({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (data) => {
                queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(
                    queryKey,
                    (old) => {
                        if (!old?.pages) return old;

                        return {
                            ...old,
                            pages: old.pages.map((page) => ({
                                ...page,
                                messages: page.messages.map((msg) =>
                                    msg.id === data.id
                                        ? { ...msg, content: data.content }
                                        : msg,
                                ),
                            })),
                        };
                    },
                );
            },
        },
    });
}
