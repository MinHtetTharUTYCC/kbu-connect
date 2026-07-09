import { getChatControllerGetConversationsInfiniteQueryKey, useChatControllerDeleteConversation } from '@services/generated/chat/chat';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useDeleteConversation() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useChatControllerDeleteConversation({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getChatControllerGetConversationsInfiniteQueryKey()
                });
                toast.success('Conversation deleted');
                router.replace('/chats');
            }
        }
    });
}
