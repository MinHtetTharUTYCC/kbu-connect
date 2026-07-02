'use client';

import { useSwipesControllerSwipe } from '@services/generated/swipes-matches/swipes-matches';
import { CreateSwipeDtoType } from '@services/model';

export function useSwipeProfile() {
    const swipe = useSwipesControllerSwipe();

    return {
        ...swipe,
        like: (receiverId: string) =>
            swipe.mutate({
                data: { receiverId, type: CreateSwipeDtoType.LIKE },
            }),
        dislike: (receiverId: string) =>
            swipe.mutate({
                data: { receiverId, type: CreateSwipeDtoType.DISLIKE },
            }),
    };
}
