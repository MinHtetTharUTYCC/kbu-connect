'use client';

import { handleBackendError } from '@/lib/error/error-util';
import { useAuthControllerLogin } from '../../../services/generated/auth/auth';
import { useAuthStore } from '@/stores/auth-store';

export function useLogin(onSuccess: (email: string) => void) {
    const { setPendingEmail } = useAuthStore();
    return useAuthControllerLogin({
        mutation: {
            onSuccess: (data) => {
                setPendingEmail(data.email);
                onSuccess(data.email);
            },
            onError: (error) => {
                handleBackendError(error);
            },
        },
    });
}
