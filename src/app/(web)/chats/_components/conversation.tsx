'use client';

import { PlusCircle, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import { relativeTime } from '@/lib/profile-utils';
import { cn } from '@/lib/utils';
import { LoadMoreRow } from './chat-list';
import { useConversation } from '@/hooks/chat/use-conversation';
import { useSendMessage } from '@/hooks/chat/use-send-message';

export function ChatClient({ chatId }: { chatId: string }) {
    const { user } = useAuthContext();

    const {
        messages,
        isLoading: isLoadingMessages,
        fetchNextPage: fetchNextPageMessages,
        hasNextPage: hasNextPageMessages,
        isFetchingNextPage: isFetchingNextPageMessages,
    } = useConversationMessages(chatId);
    const { data: conversation, isLoading: conversationLoading } = useConversation(chatId);
    const { mutate: markSeen } = useMarkConversationSeen();

    const loadMoreMessagesRef = useRef<HTMLDivElement | null>(null);

    const [draft, setDraft] = useState('');

    const myId = user?.user?.id;

    const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage(
        chatId,
        myId,
        () => {},
    );

    useTopBar({
        title: conversation?.participant.name ?? 'Messages',
        backHref: '/chats',
        action: conversation ? (
            <Avatar
                src={conversation.participant.avatarUrl}
                name={conversation.participant.name}
                className="size-10"
            />
        ) : undefined,
    });

    useEffect(() => {
        if (chatId && conversation) {
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
    }, [fetchNextPageMessages, hasNextPageMessages, isFetchingNextPageMessages]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const content = draft.trim();
        if (!content || !myId) return;

        await sendMessage({ data: { conversationId: chatId, content } });
    }

    if (conversationLoading || (!conversation && hasNextPageMessages)) {
        return <EmptyState title="Loading conversation" body="Opening your conversation." />;
    }

    if (!conversation) {
        return (
            <EmptyState
                title="Conversation unavailable"
                body="This chat may have been deleted or is no longer available."
            />
        );
    }

    if (!myId) {
        return (
            <EmptyState
                title="Authentication required"
                body="Please sign in to view this conversation."
            />
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-5 py-6">
            {isLoadingMessages ? (
                <EmptyState title="Loading messages" body="Opening your messages." />
            ) : messages.length ? (
                messages.map((message) => {
                    const mine = message.senderId === myId;
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
                    placeholder="Type here..."
                    aria-label="Message"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f9f9f8] px-4 text-sm outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={isSendingMessage || !draft.trim()}
                    className="grid size-11 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
                    aria-label="Send message"
                >
                    <Send className="size-5" />
                </button>
            </form>
        </main>
    );
}
