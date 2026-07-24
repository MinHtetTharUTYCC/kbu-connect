'use client';

import { getBlockControllerGetBlockedUsersInfiniteQueryKey, useBlockControllerUnblockUser } from '@services/generated/block/block';
import { getChatControllerGetConversationsInfiniteQueryKey } from '@services/generated/chat/chat';
import type { BlocksListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useUnblockUser() {
    const queryClient = useQueryClient();

    return useBlockControllerUnblockUser({
        mutation: {
            onSuccess: ({ unblockedUserId }) => {
                queryClient.setQueryData<InfiniteData<BlocksListResponseDto>>(
                    getBlockControllerGetBlockedUsersInfiniteQueryKey(),
                    (oldData) => {
                        if (!oldData || !oldData.pages) return oldData;

                        const newPages = oldData.pages.map((page) => {
                            return {
                                ...page,
                                blocks: page.blocks.filter((b) => b.blockedId !== unblockedUserId)
                            };
                        });

                        return {
                            ...oldData,
                            pages: newPages
                        };
                    }
                );

                queryClient.invalidateQueries({
                    queryKey: getChatControllerGetConversationsInfiniteQueryKey(),
                    refetchType: 'all'
                });
            }
        }
    });
}
