"use client";

import { handleBackendError } from "@/lib/error/error-util";
import { useAuthControllerLogin } from "../../../services/generated/auth/auth";

export function useLogin(onSuccess: (email: string) => void) {
  return useAuthControllerLogin({
    mutation: {
      onSuccess: (data) => {
        onSuccess(data.email);
      },
      onError: (error) => {
        handleBackendError(error);
      },
    },
  });
}
