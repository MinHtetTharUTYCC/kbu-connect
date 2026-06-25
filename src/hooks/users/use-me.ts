import { useUsersControllerGetMyProfile } from '@services/generated/users/users';

export function useMe(skip = false) {
    return useUsersControllerGetMyProfile({
        query: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: false,
            enabled: !skip,
        },
    });
}
