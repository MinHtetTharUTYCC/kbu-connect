"use client";

import { useChatControllerGetConversationMessages } from "@services/generated/chat/chat";

// TODO: infinite scroll here, but the API doesn't support pagination yet, so we just return all messages for now(API coming soon)

export function useConversationMessages(conversationId: string, _limit = 20) {
    const query = useChatControllerGetConversationMessages(conversationId, {
        query: {
            enabled: Boolean(conversationId),
        },
    });
    const messages = query.data?.messages ?? [];

    return {
        ...query,
        messages,
        hasNextPage: false,
        isFetchingNextPage: false,
        fetchNextPage: async () => undefined,
    };
}
