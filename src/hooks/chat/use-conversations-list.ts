'use client';

import type { InfiniteData } from '@tanstack/react-query';
import { useChatControllerGetConversationsInfinite } from '../../../services/generated/chat/chat';
import type {
    ChatControllerGetConversationsParams,
    ConversationsListResponseDto,
} from '../../../services/model';

export function useConversationsList(
    params: ChatControllerGetConversationsParams = {
        cursor: null,
        limit: 20,
    },
) {
    const query = useChatControllerGetConversationsInfinite<
        InfiniteData<ConversationsListResponseDto, string | null>
    >(
        { cursor: params.cursor, limit: params.limit },
        {
            query: {
                initialPageParam: null,
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            },
        },
    );
    const conversations = query.data?.pages.flatMap((page) => page.conversations) ?? [];

    return { ...query, conversations };
}
