"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsControllerGetNotificationsInfiniteQueryKey,
  getNotificationsControllerGetUnreadCountQueryKey,
  useNotificationsControllerMarkAllAsRead,
} from "../../../services/generated/notifications/notifications";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useNotificationsControllerMarkAllAsRead({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            getNotificationsControllerGetNotificationsInfiniteQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getNotificationsControllerGetUnreadCountQueryKey(),
        });
      },
    },
  });
}
