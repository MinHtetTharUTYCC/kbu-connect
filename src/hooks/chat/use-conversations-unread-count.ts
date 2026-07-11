import { useChatControllerGetUnreadCount } from '@services/generated/chat/chat';

export function useConversationsUnreadCount(skip: boolean = false) {
    const query = useChatControllerGetUnreadCount({
        query: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            enabled: !skip
        }
    });

    return { ...query, unreadCount: query.data?.unreadCount ?? 0 };
}
