'use client';

import { useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';
import {
    getUsersControllerGetMyProfileQueryKey,
    useUsersControllerToggleDiscoverable,
} from '../../../services/generated/users/users';

export function useToggleDiscoverable() {
    const queryClient = useQueryClient();

    return useUsersControllerToggleDiscoverable({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: () =>
                queryClient.invalidateQueries({
                    queryKey: getUsersControllerGetMyProfileQueryKey(),
                }),
        },
    });
}
