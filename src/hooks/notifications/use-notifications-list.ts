'use client';

import { useNotificationsControllerGetNotificationsInfinite } from '@services/generated/notifications/notifications';
import type {
    NotificationsControllerGetNotificationsParams,
    NotificationsListResponseDto,
} from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useNotificationsList(
    params: NotificationsControllerGetNotificationsParams = {},
) {
    const query = useNotificationsControllerGetNotificationsInfinite<
        InfiniteData<NotificationsListResponseDto>
    >(params, {
        query: {
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    });

    const notifications =
        query.data?.pages.flatMap((page) => page.notifications) ?? [];

    return { ...query, notifications };
}
