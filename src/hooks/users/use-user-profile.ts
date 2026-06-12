"use client";

import { useUsersControllerGetUserProfile } from "../../../services/generated/users/users";
import type { PrivateProfileResponseDto } from "../../../services/model";

export function useUserProfile(userId: string) {
  return useUsersControllerGetUserProfile<PrivateProfileResponseDto>(userId);
}
