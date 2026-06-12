"use client";

import { useQueryClient } from "@tanstack/react-query";
import { handleBackendError } from "@/lib/error/error-util";
import {
  getChatControllerGetShoutoutsInfiniteQueryKey,
  useChatControllerSendShoutout,
} from "../../../services/generated/chat/chat";

export function useSendShoutout() {
  const queryClient = useQueryClient();

  return useChatControllerSendShoutout({
    mutation: {
      onError: (error) => handleBackendError(error),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getChatControllerGetShoutoutsInfiniteQueryKey({
            type: "sent",
            limit: 20,
          }),
        });
      },
    },
  });
}
