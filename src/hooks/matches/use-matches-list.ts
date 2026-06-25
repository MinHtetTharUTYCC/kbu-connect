'use client';

import { InfiniteData } from '@tanstack/react-query';
import { useMatchesControllerGetMatchesInfinite } from '../../../services/generated/matches/matches';
import { MatchesControllerGetMatchesParams, MatchListResponseDto } from '../../../services/model';

export function useMatchesList(params: MatchesControllerGetMatchesParams = { limit: 20 }) {
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
