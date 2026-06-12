"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useNotificationsControllerGetNotificationsInfinite } from "../../../services/generated/notifications/notifications";
import type { NotificationsListResponseDto } from "../../../services/model";

export function useNotificationsList(limit = 30) {
  const query = useNotificationsControllerGetNotificationsInfinite<
    InfiniteData<NotificationsListResponseDto>
  >(
    { limit },
    {
      query: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => getNextCursor(lastPage.nextCursor),
      },
    },
  );
  const notifications =
    query.data?.pages.flatMap((page) => page.notifications) ?? [];

  return { ...query, notifications };
}

function getNextCursor(nextCursor: unknown) {
  return typeof nextCursor === "string" && nextCursor.length > 0
    ? nextCursor
    : undefined;
}
