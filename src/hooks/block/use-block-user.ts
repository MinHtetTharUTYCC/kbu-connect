import { getBlockControllerGetBlockedUsersInfiniteQueryKey, useBlockControllerBlockUser } from '@services/generated/block/block';
import {
    getChatControllerGetConversationDetailsQueryKey,
    getChatControllerGetConversationMessagesInfiniteQueryKey,
    getChatControllerGetConversationsInfiniteQueryKey
} from '@services/generated/chat/chat';
import { useQueryClient } from '@tanstack/react-query';

export function useBlockUser(chatId: string) {
    const queryClient = useQueryClient();

    return useBlockControllerBlockUser({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getChatControllerGetConversationDetailsQueryKey(chatId) });
                queryClient.invalidateQueries({ queryKey: getChatControllerGetConversationMessagesInfiniteQueryKey(chatId) });
                queryClient.invalidateQueries({ queryKey: getBlockControllerGetBlockedUsersInfiniteQueryKey() });
                queryClient.invalidateQueries({ queryKey: getChatControllerGetConversationsInfiniteQueryKey() });
            }
        }
    });
}
