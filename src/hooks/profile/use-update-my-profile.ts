"use client";

import { useRouter } from "next/navigation";
import { handleBackendError } from "@/lib/error/error-util";
import { useUsersControllerUpdateMyProfile } from "../../../services/generated/users/users";
import type { UpdateProfileDto } from "../../../services/model";

export function useUpdateMyProfile(redirectTo = "/discover") {
  const router = useRouter();

  return useUsersControllerUpdateMyProfile({
    mutation: {
      onError: (error) => handleBackendError(error),
      onSuccess: () => router.replace(redirectTo),
    },
  });
}

export type UpdateMyProfilePayload = UpdateProfileDto;
