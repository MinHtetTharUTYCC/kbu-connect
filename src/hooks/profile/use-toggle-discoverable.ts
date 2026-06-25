'use client';

import {
    getUsersControllerGetMyProfileQueryKey,
    useUsersControllerToggleDiscoverable,
} from '@services/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';
// import { toast } from 'sonner';

// TOTDO: backend lacks to support api response format at orval, coming update soon
export function useToggleDiscoverable() {
    const queryClient = useQueryClient();

    return useUsersControllerToggleDiscoverable({
        mutation: {
            onError: (error) => handleBackendError(error),
            // onSuccess: (data) =>{
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getUsersControllerGetMyProfileQueryKey(),
                });

                // toast.success(data.message);
            },
        },
    });
}
