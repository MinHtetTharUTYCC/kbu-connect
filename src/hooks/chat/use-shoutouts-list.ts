"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useChatControllerGetShoutoutsInfinite } from "../../../services/generated/chat/chat";
import type {
  ChatControllerGetShoutoutsParams,
  ChatControllerGetShoutoutsType,
  ShoutoutItemDto,
  ShoutoutsListResponseDto,
} from "../../../services/model";

export type ShoutoutType = ChatControllerGetShoutoutsType;
export type ShoutoutItem = ShoutoutItemDto;

export function useShoutoutsList(
  params: ChatControllerGetShoutoutsParams = { limit: 20 },
) {
  const query = useChatControllerGetShoutoutsInfinite<
    InfiniteData<ShoutoutsListResponseDto, string | undefined>
  >(
    { type: params.type, cursor: params.cursor, limit: params.limit },
    {
      query: {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    },
  );

  const shoutouts = query.data?.pages.flatMap((page) => page.shoutouts) ?? [];

  return { ...query, shoutouts };
}
