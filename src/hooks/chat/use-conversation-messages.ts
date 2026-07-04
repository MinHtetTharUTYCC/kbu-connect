'use client';

import { useChatControllerGetConversationMessagesInfinite } from '@services/generated/chat/chat';
import {
    ChatControllerGetConversationMessagesParams,
    MessagesListResponseDto,
} from '@services/model';
import { InfiniteData } from '@tanstack/react-query';

export function useConversationMessages(
    conversationId: string,
    params?: ChatControllerGetConversationMessagesParams,
) {
    const query = useChatControllerGetConversationMessagesInfinite<
        InfiniteData<MessagesListResponseDto, string | null>
    >(conversationId, params, {
        query: {
            initialPageParam: null,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: Boolean(conversationId),
        },
    });
    const messages =
        query.data?.pages.flatMap((page) => page.messages).reverse() ?? [];

    return { ...query, messages };
}
