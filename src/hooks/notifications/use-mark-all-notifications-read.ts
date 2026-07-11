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
            onMutate: async () => {
                await queryClient.cancelQueries({ queryKey: listQueryKey });
                await queryClient.cancelQueries({ queryKey: countQueryKey });

                // Snapshot the current cache values for rollback
                const previousList = queryClient.getQueryData<InfiniteData<NotificationsListResponseDto>>(listQueryKey);
                const previousCount = queryClient.getQueryData<NotificationsUnreadCountResponseDto>(countQueryKey);

                // do the optimistic update for the list
                queryClient.setQueryData<InfiniteData<NotificationsListResponseDto>>(listQueryKey, (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            notifications: page.notifications.map((notification) => ({
                                ...notification,
                                isRead: true
                            }))
                        }))
                    };
                });

                // do the optimistic update for the unread count
                queryClient.setQueryData<NotificationsUnreadCountResponseDto>(countQueryKey, (oldData) => {
                    if (!oldData) return oldData;
                    return { ...oldData, unreadCount: 0 };
                });

                // Return snapshot data
                return { previousList, previousCount };
            },
            // biome-ignore lint/correctness/noUnusedFunctionParameters: <>
            onError: (err, variables, context) => {
                if (context?.previousList) {
                    queryClient.setQueryData(listQueryKey, context.previousList);
                }
                if (context?.previousCount) {
                    queryClient.setQueryData(countQueryKey, context.previousCount);
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: listQueryKey });
                queryClient.invalidateQueries({ queryKey: countQueryKey });
            },
            meta: {
                skipGlobalToast: true
            }
        }
    });
}
