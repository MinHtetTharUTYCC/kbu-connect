'use client';

import { useMatchesControllerGetMatchesInfinite } from '@services/generated/matches/matches';
import type {
    MatchesControllerGetMatchesParams,
    MatchListResponseDto,
} from '@services/model';
import type { InfiniteData } from '@tanstack/react-query';

export function useMatchesList(params: MatchesControllerGetMatchesParams = {}) {
    const query = useMatchesControllerGetMatchesInfinite<
        InfiniteData<MatchListResponseDto, string | undefined>
    >(params, {
        query: {
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    });

    const matches = query.data?.pages.flatMap((page) => page.matches) ?? [];

    return { ...query, matches };
}
