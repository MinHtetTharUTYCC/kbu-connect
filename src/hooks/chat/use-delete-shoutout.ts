'use client';

import {
    getChatControllerGetShoutoutsInfiniteQueryKey,
    useChatControllerDeleteShoutout,
} from '@services/generated/chat/chat';
import type { ShoutoutsListResponseDto } from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useDeleteShoutout() {
    const queryClient = useQueryClient();

    return useChatControllerDeleteShoutout({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (_data, variables) => {
                const { shoutoutId } = variables;
                const queryKey =
                    getChatControllerGetShoutoutsInfiniteQueryKey();

                const previousData =
                    queryClient.getQueryData<
                        InfiniteData<ShoutoutsListResponseDto>
                    >(queryKey);

                queryClient.setQueryData<
                    InfiniteData<ShoutoutsListResponseDto>
                >(queryKey, (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        pages: old.pages.map((page) => ({
                            ...page,
                            shoutouts: page.shoutouts.filter(
                                (s) => s.id !== shoutoutId,
                            ),
                        })),
                    };
                });

                const wasFound = previousData?.pages.some((p) =>
                    p.shoutouts.some((s) => s.id === shoutoutId),
                );

                if (!wasFound) {
                    queryClient.invalidateQueries({ queryKey });
                }

                toast.success('Shoutout deleted');
            },
        },
    });
}
