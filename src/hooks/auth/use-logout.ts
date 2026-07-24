'use client';

import { useAuthControllerLogout } from '@services/generated/auth/auth';
import { useRouter } from 'next/navigation';
import { disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';

export function useLogout() {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    return useAuthControllerLogout({
        mutation: {
            onSuccess: () => {
                disconnectSocket();
                logout();
                router.replace('/login');
            }
        }
    });
}
