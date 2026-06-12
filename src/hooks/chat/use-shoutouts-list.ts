"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useChatControllerGetShoutoutsInfinite } from "../../../services/generated/chat/chat";
import type { ChatControllerGetShoutoutsType } from "../../../services/model";

export type ShoutoutType = ChatControllerGetShoutoutsType;

export type ShoutoutItem = {
  id: string;
  content: string;
  type: ShoutoutType;
  createdAt: string;
  otherUser: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
};

type ShoutoutsListPage = {
  shoutouts: ShoutoutItem[];
  nextCursor: string | null;
};

export function useShoutoutsList(type: ShoutoutType = "received", limit = 20) {
  const query = useChatControllerGetShoutoutsInfinite<
    InfiniteData<ShoutoutsListPage, string | undefined>
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
