'use client';

import {
    getNotificationsControllerGetNotificationsInfiniteQueryKey,
    getNotificationsControllerGetUnreadCountQueryKey,
    useNotificationsControllerMarkAllAsRead,
} from '@services/generated/notifications/notifications';
import { useQueryClient } from '@tanstack/react-query';

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useNotificationsControllerMarkAllAsRead({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getNotificationsControllerGetNotificationsInfiniteQueryKey(),
                });
                queryClient.invalidateQueries({
                    queryKey: getNotificationsControllerGetUnreadCountQueryKey(),
                });
            },
        },
    });
}
