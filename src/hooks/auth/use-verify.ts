import { handleBackendError } from '@/lib/error/error-util';
import { useAuthControllerVerify } from '../../../services/generated/auth/auth';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useVerify() {
    const router = useRouter();

    const { setToken, clearPendingEmail } = useAuthStore();

    return useAuthControllerVerify({
        mutation: {
            onSuccess: (data) => {
                setToken(data.access_token);
                clearPendingEmail();

                if (data.profileCompleted) {
                    router.replace('/discover');
                } else {
                    router.replace('/profile-setup');
                }
            },
            onError: (error) => {
                handleBackendError(error);
            },
        },
    });
}
