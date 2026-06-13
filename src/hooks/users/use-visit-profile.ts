"use client";

import { useUsersControllerGetUserProfile } from "../../../services/generated/users/users";

export function useVisitProfile(userId: string) {
  return useUsersControllerGetUserProfile(userId);
}
