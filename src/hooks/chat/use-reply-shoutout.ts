'use client';

import {
    getChatControllerGetConversationsInfiniteQueryKey,
    getChatControllerGetShoutoutsInfiniteQueryKey,
    useChatControllerReplyToShoutout
} from '@services/generated/chat/chat';
import type { ConversationsListResponseDto, ShoutoutsListResponseDto } from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';

export function useReplyShoutout() {
    const queryClient = useQueryClient();

    return useChatControllerReplyToShoutout({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (data, variables) => {
                const { shoutoutId } = variables;

                const shoutoutsQueryKey = getChatControllerGetShoutoutsInfiniteQueryKey();
                const chatsQueryKey = getChatControllerGetConversationsInfiniteQueryKey();

                queryClient.setQueryData<InfiniteData<ShoutoutsListResponseDto>>(shoutoutsQueryKey, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            shoutouts: page.shoutouts.filter((s) => s.id !== shoutoutId)
                        }))
                    };
                });

                queryClient.setQueryData<InfiniteData<ConversationsListResponseDto>>(chatsQueryKey, (old) => {
                    if (!old) return old;

                    const pages = old.pages.map((page) => ({
                        ...page,
                        conversations: page.conversations.filter((c) => c.id !== data.id)
                    }));

                    pages[0] = {
                        ...pages[0],
                        conversations: [data, ...pages[0].conversations]
                    };

                    return {
                        ...old,
                        pages
                    };
                });
            }
        }
    });
}
