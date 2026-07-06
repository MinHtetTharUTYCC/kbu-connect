'use client';

import { useAuthControllerLogin } from '@services/generated/auth/auth';
import { handleBackendError } from '@/lib/error/error-util';

export function useLogin(onSuccess: (email: string) => void) {
    return useAuthControllerLogin({
        mutation: {
            onSuccess: (data) => {
                //TODO:: ATT:: api returns code here for dev, check the response to get the code
                onSuccess(data.email);
            },
            onError: (error) => handleBackendError(error)
        }
    });
}
