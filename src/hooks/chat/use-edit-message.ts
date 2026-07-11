import { getChatControllerGetConversationMessagesInfiniteQueryKey, useChatControllerEditMessage } from '@services/generated/chat/chat';
import type { MessagesListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useEditMessage(conversationId: string, didTheOptimistic: () => void) {
    const queryClient = useQueryClient();
    const queryKey = getChatControllerGetConversationMessagesInfiniteQueryKey(conversationId);

    return useChatControllerEditMessage({
        mutation: {
            onMutate: async ({ messageId, data }) => {
                const content = data.content;

                const previous = queryClient.getQueryData(queryKey);

                queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(queryKey, (old) => {
                    if (!old?.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            messages: page.messages.map((msg) => (msg.id === messageId ? { ...msg, content } : msg))
                        }))
                    };
                });

                didTheOptimistic();

                return { previous };
            },

            onError: (_err, _vars, context?: { previous?: unknown }) => {
                if (context?.previous) {
                    queryClient.setQueryData(queryKey, context.previous);
                }
            },

            onSuccess: (data) => {
                queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(queryKey, (old) => {
                    if (!old?.pages) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            messages: page.messages.map((msg) => (msg.id === data.id ? { ...msg, ...data } : msg))
                        }))
                    };
                });
            }
        }
    });
}
