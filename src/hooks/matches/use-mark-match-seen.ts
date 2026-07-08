'use client';

import { getMatchesControllerGetMatchesInfiniteQueryKey, useMatchesControllerMarkMatchAsSeen } from '@services/generated/matches/matches';
import type { MatchListResponseDto } from '@services/model';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';

export function useMarkMatchSeen() {
    const queryClient = useQueryClient();

    const queryKey = getMatchesControllerGetMatchesInfiniteQueryKey();

    return useMatchesControllerMarkMatchAsSeen({
        mutation: {
            meta: {
                skipGlobalToast: true
            },
            onSuccess: (data) => {
                const { matchId } = data;

                queryClient.setQueryData<InfiniteData<MatchListResponseDto>>(queryKey, (oldData) => {
                    if (!oldData || !oldData.pages) return oldData;

                    const updatedPages = oldData.pages.map((page) => ({
                        ...page,
                        matches: page.matches.map((match) => (match.id === matchId ? { ...match, isNew: false } : match))
                    }));

                    return {
                        ...oldData,
                        pages: updatedPages
                    };
                });
            }
        }
    });
}
