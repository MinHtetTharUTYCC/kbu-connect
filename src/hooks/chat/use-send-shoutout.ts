'use client';

import {
    getChatControllerGetShoutoutsInfiniteQueryKey,
    useChatControllerSendShoutout,
} from '@services/generated/chat/chat';
import { useQueryClient } from '@tanstack/react-query';
import { handleBackendError } from '@/lib/error/error-util';
import { toast } from 'sonner';

export function useSendShoutout() {
    const queryClient = useQueryClient();

    return useChatControllerSendShoutout({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getChatControllerGetShoutoutsInfiniteQueryKey({
                        type: 'sent',
                    }),
                });

                toast.success('Shoutout sent successfully!');
            },
        },
    });
}
