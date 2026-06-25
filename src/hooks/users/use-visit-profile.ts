"use client";

import { useUsersControllerGetUserProfile } from "@services/generated/users/users";

export function useVisitProfile(userId: string) {
    return useUsersControllerGetUserProfile(userId, {
        query: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    });
}
