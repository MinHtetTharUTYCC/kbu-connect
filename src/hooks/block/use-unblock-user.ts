'use client';

import { getBlockControllerGetBlockedUsersInfiniteQueryKey, useBlockControllerUnblockUser } from '@services/generated/block/block';
import type { BlocksListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useUnblockUser() {
    const queryClient = useQueryClient();

    return useBlockControllerUnblockUser({
        mutation: {
            onSuccess: ({ unblockedUserId }) => {
                const blockedUsersQueryKey = getBlockControllerGetBlockedUsersInfiniteQueryKey();

                queryClient.setQueryData<InfiniteData<BlocksListResponseDto>>(blockedUsersQueryKey, (oldData) => {
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
            }
        }
    });
}
