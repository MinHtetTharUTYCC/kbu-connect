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
                const blocksListQueryKey = getBlockControllerGetBlockedUsersInfiniteQueryKey();
                const conversationsListQueryKey = getChatControllerGetConversationsInfiniteQueryKey();

                queryClient.setQueryData<InfiniteData<BlocksListResponseDto>>(blocksListQueryKey, (oldData) => {
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
                });

                queryClient.invalidateQueries({
                    queryKey: conversationsListQueryKey,
                    refetchType: 'all'
                });
            }
        }
    });
}
