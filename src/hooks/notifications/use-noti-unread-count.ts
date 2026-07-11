import { useNotificationsControllerGetUnreadCount } from '@services/generated/notifications/notifications';

export function useNotificationsUnreadCount(skip: boolean = false) {
    const query = useNotificationsControllerGetUnreadCount({
        query: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            enabled: !skip
        }
    });

    return { ...query, unreadCount: query.data?.unreadCount ?? 0 };
}
