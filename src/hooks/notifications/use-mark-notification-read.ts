import {
    getNotificationsControllerGetNotificationsInfiniteQueryKey,
    getNotificationsControllerGetUnreadCountQueryKey,
    useNotificationsControllerMarkAsRead
} from '@services/generated/notifications/notifications';
import type { NotificationsListResponseDto, NotificationsUnreadCountResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    const listQueryKey = getNotificationsControllerGetNotificationsInfiniteQueryKey();
    const countQueryKey = getNotificationsControllerGetUnreadCountQueryKey();

    return useNotificationsControllerMarkAsRead({
        mutation: {
            meta: {
                skipGlobalToast: true
            },
            onMutate: async (variables) => {
                queryClient.setQueryData<InfiniteData<NotificationsListResponseDto>>(listQueryKey, (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;

                    const newPages = oldData.pages.map((page) => ({
                        ...page,
                        notifications: page.notifications.map((notification) =>
                            notification.id === variables.id ? { ...notification, isRead: true } : notification
                        )
                    }));

                    return { ...oldData, pages: newPages };
                });

                queryClient.setQueryData<NotificationsUnreadCountResponseDto>(countQueryKey, (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        unreadCount: Math.max(0, oldData.unreadCount - 1)
                    };
                });
            }
        }
    });
}
