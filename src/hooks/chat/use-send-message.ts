import {
    getChatControllerGetConversationMessagesInfiniteQueryKey,
    getChatControllerGetConversationsInfiniteQueryKey,
    useChatControllerSendMessage,
} from '@services/generated/chat/chat';
import type { MessageItemDto, MessagesListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSendMessage(
    conversationId: string,
    userId: string | undefined,
    onSuccess: () => void,
) {
    const queryClient = useQueryClient();

    const queryKey =
        getChatControllerGetConversationMessagesInfiniteQueryKey(
            conversationId,
        );

    const optimisticUpdate = (content: string, tempId: string) => {
        if (!userId) return undefined;

        const previous = queryClient.getQueryData(queryKey);

        const tempMessage: MessageItemDto = {
            id: tempId,
            content,
            senderId: userId ?? '',
            timestamp: new Date().toISOString(),
        };

        queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(
            queryKey,
            (old) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page, idx) =>
                        idx === 0
                            ? {
                                  ...page,
                                  messages: [tempMessage, ...page.messages],
                              }
                            : page,
                    ),
                };
            },
        );

        return previous;
    };

    const replaceTempMessage = (tempId: string, newMessage: MessageItemDto) => {
        queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(
            queryKey,
            (old) => {
                if (!old?.pages) return old;

                let didReplace = false;
                const pages = old.pages.map((page) => {
                    const hasResolved = page.messages.some(
                        (item) =>
                            item.id === newMessage.id && item.id !== tempId,
                    );
                    const messages = hasResolved
                        ? page.messages.filter((item) => item.id !== tempId)
                        : page.messages.map((item) => {
                              if (item.id === tempId) {
                                  didReplace = true;
                                  return newMessage;
                              }
                              return item;
                          });

                    if (hasResolved) {
                        didReplace = true;
                    }

                    return didReplace ? { ...page, messages } : page;
                });

                return didReplace ? { ...old, pages } : old;
            },
        );
    };

    return useChatControllerSendMessage({
        mutation: {
            onMutate: async (data) => {
                const { content } = data.data;

                const tempId = `temp-${Date.now()}`;

                return {
                    previous: optimisticUpdate(content, tempId),
                    tempId,
                };
            },

            onError: (
                _err: unknown,
                _vars: unknown,
                context?: { previous?: unknown; tempId?: string },
            ) => {
                if (context?.previous) {
                    queryClient.setQueryData(queryKey, context.previous);
                }
                toast.error('Failed to send message. Please try again.');
            },

            onSuccess: (data, _vars, context?: { tempId?: string }) => {
                if (data && context?.tempId) {
                    replaceTempMessage(context.tempId, data);
                }

                if (data) {
                    queryClient.invalidateQueries({
                        queryKey:
                            getChatControllerGetConversationsInfiniteQueryKey(),
                    });
                }

                onSuccess();
            },
        },
    });
}
