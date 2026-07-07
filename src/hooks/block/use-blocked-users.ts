'use client';

import { useBlockControllerGetBlockedUsersInfinite } from '@services/generated/block/block';
import type { BlockControllerGetBlockedUsersParams, BlocksListResponseDto } from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useBlockedUsers(params?: BlockControllerGetBlockedUsersParams) {
    const query = useBlockControllerGetBlockedUsersInfinite<InfiniteData<BlocksListResponseDto>>(params, {
        query: {
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            staleTime: 1000 * 60 * 5
        }
    });

    const blocks = query.data?.pages.flatMap((page) => page.blocks) ?? [];

    return { ...query, blocks: Array(20).fill(blocks).flat() };
}
