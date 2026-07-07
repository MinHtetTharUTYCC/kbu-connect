import { useNotificationsControllerGetUnreadCount } from '@services/generated/notifications/notifications';

export function useNotificationsUnreadCount() {
    return useNotificationsControllerGetUnreadCount({
        query: {
            staleTime: 1000 * 60 * 5 // 5 minutes
        }
    });
}
