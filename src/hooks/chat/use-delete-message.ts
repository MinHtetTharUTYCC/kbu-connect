import {
    getChatControllerGetConversationMessagesInfiniteQueryKey,
    useChatControllerDeleteMessage,
} from '@services/generated/chat/chat';
import type { MessagesListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useDeleteMessage(
    conversationId: string,
    onSuccess: () => void,
) {
    const queryClient = useQueryClient();

    const queryKey =
        getChatControllerGetConversationMessagesInfiniteQueryKey(
            conversationId,
        );

    return useChatControllerDeleteMessage({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (_data, variables) => {
                queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(
                    queryKey,
                    (old) => {
                        if (!old?.pages) return old;

                        return {
                            ...old,
                            pages: old.pages.map((page) => ({
                                ...page,
                                messages: page.messages.filter(
                                    (msg) => msg.id !== variables.messageId,
                                ),
                            })),
                        };
                    },
                );

                toast.success('Message deleted successfully');
                onSuccess();
            },
        },
    });
}
