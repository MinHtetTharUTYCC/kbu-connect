'use client';

import { useAuthControllerLogin } from '@services/generated/auth/auth';

export function useLogin(onSuccess: (email: string) => void) {
    return useAuthControllerLogin({
        mutation: {
            onSuccess: (data) => {
                //TODO:: ATT:: api returns code here for dev, check the response to get the code
                onSuccess(data.email);
            }
        }
    });
}
