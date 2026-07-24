'use client';

import { getDiscoveryControllerGetDiscoveryInfiniteQueryKey } from '@services/generated/discovery/discovery';
import { useSwipesControllerResetHistory } from '@services/generated/swipes-matches/swipes-matches';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useResetSwipeHistory() {
    const queryClient = useQueryClient();

    return useSwipesControllerResetHistory({
        mutation: {
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: getDiscoveryControllerGetDiscoveryInfiniteQueryKey()
                });

                toast.success(data.message ?? 'Swipe history reset successfully');
            }
        }
    });
}
