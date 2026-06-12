"use client";

import { useRouter } from "next/navigation";
import { handleBackendError } from "@/lib/error/error-util";
import { useUsersControllerUpdateMyProfile } from "../../../services/generated/users/users";
import type { UpdateProfileDto } from "../../../services/model";

export function useUpdateMyProfile() {
  const router = useRouter();

  return useUsersControllerUpdateMyProfile({
    mutation: {
      onError: (error) => handleBackendError(error),
      onSuccess: () => router.replace("/discover"),
    },
  });
}

export type UpdateMyProfilePayload = UpdateProfileDto;
