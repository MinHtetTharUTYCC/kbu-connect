import { useAuthControllerLogin } from '@services/generated/auth/auth';

export function useLogin() {
    return useAuthControllerLogin({
        mutation: {
            meta: {
                skipGlobalToast: true
            }
        }
    });
}
