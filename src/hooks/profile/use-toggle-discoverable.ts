"use client";

import { handleBackendError } from "@/lib/error/error-util";
import { useUsersControllerToggleDiscoverable } from "../../../services/generated/users/users";

export function useToggleDiscoverable() {
  return useUsersControllerToggleDiscoverable({
    mutation: {
      onError: (error) => handleBackendError(error),
    },
  });
}
