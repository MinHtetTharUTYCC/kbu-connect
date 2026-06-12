"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useChatControllerGetShoutoutsInfinite } from "../../../services/generated/chat/chat";
import type {
  ChatControllerGetShoutoutsType,
  ShoutoutItemDto,
  ShoutoutsListResponseDto,
} from "../../../services/model";

export type ShoutoutType = ChatControllerGetShoutoutsType;
export type ShoutoutItem = ShoutoutItemDto;

export function useShoutoutsList(type: ShoutoutType = "received", limit = 20) {
  const query = useChatControllerGetShoutoutsInfinite<
    InfiniteData<ShoutoutsListResponseDto, string | undefined>
  >(
    { type, limit },
    {
      query: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => getNextCursor(lastPage.nextCursor),
      },
    },
  );
  const shoutouts = query.data?.pages.flatMap((page) => page.shoutouts) ?? [];

  return { ...query, shoutouts };
}

function getNextCursor(nextCursor: unknown) {
  return typeof nextCursor === "string" && nextCursor.length > 0
    ? nextCursor
    : undefined;
}
