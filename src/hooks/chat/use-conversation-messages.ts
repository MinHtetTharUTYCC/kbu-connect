"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstanceFn } from "@/lib/axios/axios-instance";
import type { MessagesListResponseDto } from "../../../services/model";

export function useConversationMessages(conversationId: string, limit = 20) {
  const query = useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId, limit],
    queryFn: ({ pageParam, signal }) =>
      axiosInstanceFn<MessagesListResponseDto>({
        url: `/chats/conversations/${conversationId}/messages`,
        method: "GET",
        params: { cursor: pageParam, limit },
        signal,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      const nextCursor = getNextCursor(lastPage.nextCursor);
      return nextCursor && nextCursor !== lastPageParam
        ? nextCursor
        : undefined;
    },
    enabled: Boolean(conversationId),
  });
  const messages = query.data?.pages.flatMap((page) => page.messages) ?? [];

  return { ...query, messages };
}

function getNextCursor(nextCursor: unknown) {
  return typeof nextCursor === "string" && nextCursor.length > 0
    ? nextCursor
    : undefined;
}
