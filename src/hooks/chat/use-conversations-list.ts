"use client";

import type { InfiniteData } from "@tanstack/react-query";
import { useChatControllerGetConversationsInfinite } from "../../../services/generated/chat/chat";
import type { ConversationsListResponseDto } from "../../../services/model";

export function useConversationsList(limit = 20) {
  const query = useChatControllerGetConversationsInfinite<
    InfiniteData<ConversationsListResponseDto, string | null>
  >(
    { cursor: null, limit },
    {
      query: {
        initialPageParam: null,
        getNextPageParam: (lastPage, _pages, lastPageParam) => {
          const nextCursor = getNextCursor(lastPage.nextCursor);
          return nextCursor && nextCursor !== lastPageParam
            ? nextCursor
            : undefined;
        },
      },
    },
  );
  const conversations =
    query.data?.pages.flatMap((page) => page.conversations) ?? [];

  return { ...query, conversations };
}

function getNextCursor(nextCursor: unknown) {
  return typeof nextCursor === "string" && nextCursor.length > 0
    ? nextCursor
    : undefined;
}
