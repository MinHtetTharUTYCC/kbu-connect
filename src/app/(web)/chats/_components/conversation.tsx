'use client';

import { PlusCircle, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useConversationsList } from '@/hooks/chat/use-conversations-list';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import { relativeTime } from '@/lib/profile-utils';
import { cn } from '@/lib/utils';
import type { MessageItemDto } from '@services/model';
import { LoadMoreRow } from './chat-list';

export function ChatClient({ chatId }: { chatId: string }) {
    const { user } = useAuthContext();
    const {
        messages,
        isLoading: isLoadingMessages,
        fetchNextPage: fetchNextPageMessages,
        hasNextPage: hasNextPageMessages,
        fetchingNextPage: isFetchingNextPageMessages,
    } = useConversationMessages(chatId, 20);
    const loadMoreMessagesRef = useRef<HTMLDivElement | null>(null);

    const {
        conversations,
        isLoading: conversationsLoading,
        fetchNextPage: fetchNextConversationsPage,
        hasNextPage: hasNextConversationsPage,
        isFetchingNextPage: isFetchingNextPageConversations,
    } = useConversationsList({
        cursor: null,
        limit: 20,
    });
    const { mutate: markSeen } = useMarkConversationSeen();

    const [draft, setDraft] = useState('');
    const [localMessages, setLocalMessages] = useState<MessageItemDto[]>([]);
    const conversation = conversations.find((item) => item.id === chatId);

    useEffect(() => {
        if (
            !conversation &&
            hasNextConversationsPage &&
            !isFetchingNextPageConversations
        ) {
            fetchNextConversationsPage();
        }
    }, [
        conversation,
        hasNextConversationsPage,
        isFetchingNextPageConversations,
        fetchNextConversationsPage,
    ]);
    const allMessages = useMemo(
        () => [...messages, ...localMessages],
        [messages, localMessages],
    );
    const myId = user?.user?.id ?? 'me';

    useTopBar({
        title: conversation?.otherUser?.name ?? 'Messages',
        backHref: '/chats',
        action: conversation ? (
            <Avatar
                src={conversation.otherUser.avatarUrl}
                name={conversation.otherUser.name}
                className="size-10"
            />
        ) : undefined,
    });

    useEffect(() => {
        if (chatId && conversation && !conversation.isRead) {
            markSeen({ conversationId: chatId });
        }
    }, [chatId, conversation, markSeen]);

    useEffect(() => {
        const target = loadMoreMessagesRef.current;
        if (!target || !hasNextPageMessages) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPageMessages) {
                    fetchNextPageMessages();
                }
            },
            { rootMargin: '180px 0px' },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [
        fetchNextPageMessages,
        hasNextPageMessages,
        isFetchingNextPageMessages,
    ]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const content = draft.trim();
        if (!content) return;
        setLocalMessages((items) => [
            ...items,
            {
                id: `local-${Date.now()}`,
                content,
                senderId: myId,
                timestamp: new Date().toISOString(),
            },
        ]);
        setDraft('');
    }

    if (conversationsLoading || (!conversation && hasNextPageMessages)) {
        return (
            <EmptyState
                title="Loading conversation"
                body="Opening your conversation."
            />
        );
    }

    if (!conversation) {
        return (
            <EmptyState
                title="Conversation unavailable"
                body="This chat may have been deleted or is no longer available."
            />
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-5 py-6">
            {isLoadingMessages ? (
                <EmptyState
                    title="Loading messages"
                    body="Opening your messages."
                />
            ) : messages.length ? (
                messages.map((message) => {
                    const mine =
                        message.senderId === myId || message.senderId === 'me';
                    return (
                        <div
                            key={message.id}
                            className={cn(
                                'flex max-w-[85%] flex-col',
                                mine ? 'self-end items-end' : 'items-start',
                            )}
                        >
                            <div
                                className={cn(
                                    'rounded-xl p-3 text-sm leading-6',
                                    mine
                                        ? 'rounded-tr-none bg-primary text-white'
                                        : 'rounded-tl-none border border-black/10 bg-[#f9f9f8]',
                                )}
                            >
                                {message.content}
                            </div>
                            <span className="mt-1 px-1 text-[10px] text-[#6b6b6b]">
                                {relativeTime(message.timestamp)}
                            </span>
                        </div>
                    );
                })
            ) : (
                <EmptyState
                    title="No messages yet"
                    body="Send the first message to start the conversation."
                />
            )}
            <LoadMoreRow
                ref={loadMoreMessagesRef}
                hasNextPage={hasNextPageMessages}
                isFetchingNextPage={isFetchingNextPageMessages}
                endLabel="No more messages"
            />
            <form
                onSubmit={handleSubmit}
                className="flex shrink-0 items-center gap-3 border-t border-black/10 bg-white px-5 py-3"
            >
                <button
                    type="button"
                    className="grid size-11 place-items-center text-primary"
                    aria-label="Add attachment"
                >
                    <PlusCircle className="size-6" />
                </button>
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message"
                    aria-label="Message"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f9f9f8] px-4 text-sm outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    className="grid size-11 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
                    aria-label="Send message"
                >
                    <Send className="size-5" />
                </button>
            </form>
        </main>
    );
}
