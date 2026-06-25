'use client';

import { useMatchesControllerGetMatchesInfinite } from '@services/generated/matches/matches';
import type {
    MatchesControllerGetMatchesParams,
    MatchListResponseDto,
} from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useMatchesList(
    params: MatchesControllerGetMatchesParams = { limit: 20 },
) {
    const query = useMatchesControllerGetMatchesInfinite<
        InfiniteData<MatchListResponseDto, string | undefined>
    >(
        { cursor: params.cursor, limit: params.limit },
        {
            query: {
                initialPageParam: undefined,
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            },
        },
    );

    const matches = query.data?.pages.flatMap((page) => page.matches) ?? [];

    return { ...query, matches };
}
