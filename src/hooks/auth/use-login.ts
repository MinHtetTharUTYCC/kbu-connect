'use client';

import { useAuthControllerLogin } from '@services/generated/auth/auth';
import { handleBackendError } from '@/lib/error/error-util';

export function useLogin(onSuccess: (email: string) => void) {
    return useAuthControllerLogin({
        mutation: {
            onSuccess: (data) => {
                onSuccess(data.email);
            },
            onError: (error) => handleBackendError(error),
        },
    });
}
