import { useChatControllerGetConversationDetails } from '@services/generated/chat/chat';

export function useConversation(conversationId: string) {
    return useChatControllerGetConversationDetails(conversationId, {
        query: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    });
}
