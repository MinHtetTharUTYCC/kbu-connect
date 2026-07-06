'use client';

import { getUsersControllerGetMyProfileQueryKey, useUsersControllerToggleDiscoverable } from '@services/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useToggleDiscoverable() {
    const queryClient = useQueryClient();

    return useUsersControllerToggleDiscoverable({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: getUsersControllerGetMyProfileQueryKey()
                });

                toast.success(data.message);
            }
        }
    });
}
