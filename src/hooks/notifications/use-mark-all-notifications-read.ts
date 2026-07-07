'use client';

import {
    getNotificationsControllerGetNotificationsInfiniteQueryKey,
    getNotificationsControllerGetUnreadCountQueryKey,
    useNotificationsControllerMarkAllAsRead
} from '@services/generated/notifications/notifications';
import type { NotificationsListResponseDto, NotificationsUnreadCountResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    const listQueryKey = getNotificationsControllerGetNotificationsInfiniteQueryKey();
    const countQueryKey = getNotificationsControllerGetUnreadCountQueryKey();

    return useNotificationsControllerMarkAllAsRead({
        mutation: {
            onSuccess: () => {
                queryClient.setQueryData<InfiniteData<NotificationsListResponseDto>>(listQueryKey, (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;

                    const newPages = oldData.pages.map((page) => {
                        return {
                            ...page,
                            notifications: page.notifications.map((notification) => ({
                                ...notification,
                                isRead: true
                            }))
                        };
                    });

                    return {
                        ...oldData,
                        pages: newPages
                    };
                });
                queryClient.setQueryData<NotificationsUnreadCountResponseDto>(countQueryKey, (oldData) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        unreadCount: 0
                    };
                });
            }
        }
    });
}
