"use client";

import {
    getUsersControllerGetMyProfileQueryKey,
    useUsersControllerUpdateMyProfile,
} from "@services/generated/users/users";
import type { UpdateProfileDto } from "@services/model";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { handleBackendError } from "@/lib/error/error-util";

export function useUpdateMyProfile(redirectTo = "/discover") {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useUsersControllerUpdateMyProfile({
        mutation: {
            onSuccess: () => router.replace(redirectTo),
            onError: (error) => handleBackendError(error),
            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: getUsersControllerGetMyProfileQueryKey(),
                });
            },
        },
    });
}

export type UpdateMyProfilePayload = UpdateProfileDto;
