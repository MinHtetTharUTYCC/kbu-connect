import {
    getChatControllerGetConversationsInfiniteQueryKey,
    useChatControllerDeleteConversation,
} from '@services/generated/chat/chat';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleBackendError } from '@/lib/error/error-util';

export function useDeleteConversation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useChatControllerDeleteConversation({
        mutation: {
            onError: (error) => handleBackendError(error),
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey:
                        getChatControllerGetConversationsInfiniteQueryKey(),
                });
                toast.success('Conversation deleted');
                router.replace('/chats');
            },
        },
    });
}
