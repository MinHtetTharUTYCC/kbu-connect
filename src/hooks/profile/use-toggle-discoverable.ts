'use client';

import {
    getUsersControllerGetMyProfileQueryKey,
    useUsersControllerToggleDiscoverable,
} from '@services/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';
import { toast } from 'sonner';

export function useToggleDiscoverable() {
    const queryClient = useQueryClient();

    return useUsersControllerToggleDiscoverable({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: getUsersControllerGetMyProfileQueryKey(),
                });

                toast.success(data.message);
            },
        },
    });
}
