'use client';

import { useChatControllerGetConversationsInfinite } from '@services/generated/chat/chat';
import type {
    ChatControllerGetConversationsParams,
    ConversationsListResponseDto,
} from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useConversationsList(
    params: ChatControllerGetConversationsParams = {
        cursor: null,
    },
) {
    const query = useChatControllerGetConversationsInfinite<
        InfiniteData<ConversationsListResponseDto, string | null>
    >(params, {
        query: {
            initialPageParam: null,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    });

    const conversations =
        query.data?.pages.flatMap((page) => page.conversations) ?? [];

    return { ...query, conversations: Array(20).fill(conversations).flat() };
}
