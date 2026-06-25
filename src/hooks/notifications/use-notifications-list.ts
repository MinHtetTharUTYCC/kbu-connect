'use client';

import { useNotificationsControllerGetNotificationsInfinite } from '@services/generated/notifications/notifications';
import type {
    NotificationsControllerGetNotificationsParams,
    NotificationsListResponseDto,
} from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useNotificationsList(
    params: NotificationsControllerGetNotificationsParams = { limit: 20 },
) {
    const query = useNotificationsControllerGetNotificationsInfinite<
        InfiniteData<NotificationsListResponseDto>
    >(
        { cursor: params.cursor, limit: params.limit },
        {
            query: {
                initialPageParam: undefined,
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            },
        },
    );

    const notifications =
        query.data?.pages.flatMap((page) => page.notifications) ?? [];

    return { ...query, notifications };
}
