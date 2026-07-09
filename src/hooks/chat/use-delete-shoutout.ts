'use client';

import { getChatControllerGetShoutoutsInfiniteQueryKey, useChatControllerDeleteShoutout } from '@services/generated/chat/chat';
import type { ShoutoutsListResponseDto } from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';

export function useDeleteShoutout() {
    const queryClient = useQueryClient();

    return useChatControllerDeleteShoutout({
        mutation: {
            onSuccess: (_data, variables) => {
                const { shoutoutId } = variables;
                const queryKey = getChatControllerGetShoutoutsInfiniteQueryKey();

                const previousData = queryClient.getQueryData<InfiniteData<ShoutoutsListResponseDto>>(queryKey);

                queryClient.setQueryData<InfiniteData<ShoutoutsListResponseDto>>(queryKey, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            shoutouts: page.shoutouts.filter((s) => s.id !== shoutoutId)
                        }))
                    };
                });

                const wasFound = previousData?.pages.some((p) => p.shoutouts.some((s) => s.id === shoutoutId));

                if (!wasFound) {
                    queryClient.invalidateQueries({ queryKey });
                }
            }
        }
    });
}
