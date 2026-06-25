'use client';

import type { MessageItemDto } from '@services/model';
import { Lock, PlusCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Avatar, Chip, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useConversationsList } from '@/hooks/chat/use-conversations-list';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import {
    type ShoutoutItem,
    type ShoutoutType,
    useShoutoutsList,
} from '@/hooks/chat/use-shoutouts-list';
import { relativeTime } from '@/lib/profile-utils';
import { cn } from '@/lib/utils';

type ChatTab = 'chats' | 'shoutouts';

export function ChatHomeClient() {
    const searchParams = useSearchParams();
    const activeTab: ChatTab =
        searchParams.get('tab') === 'shoutouts' ? 'shoutouts' : 'chats';

    useTopBar({ title: 'Chats' });

    return (
        <main className="flex-1 overflow-y-auto pb-5">
            <div className="bg-white px-5 py-4">
                <div className="flex rounded-xl border border-black/10 bg-[#f9f9f8] p-1">
                    <Link
                        href="/chats"
                        className={cn(
                            'flex-1 rounded-lg py-2 text-center text-xs font-semibold',
                            activeTab === 'chats'
                                ? 'border border-primary bg-white text-primary shadow-sm'
                                : 'text-[#6b6b6b]',
                        )}
                    >
                        Chats
                    </Link>
                    <Link
                        href="/chats?tab=shoutouts"
                        className={cn(
                            'flex-1 rounded-lg py-2 text-center text-xs font-semibold',
                            activeTab === 'shoutouts'
                                ? 'border border-primary bg-white text-primary shadow-sm'
                                : 'text-[#6b6b6b]',
                        )}
                    >
                        Shoutouts
                    </Link>
                </div>
            </div>
            {activeTab === 'shoutouts' ? (
                <ShoutoutsPanel />
            ) : (
                <ChatListClient />
            )}
        </main>
    );
}

function ShoutoutsPanel() {
    const searchParams = useSearchParams();
    const activeSubTab: ShoutoutType =
        searchParams.get('shoutouts') === 'sent' ? 'sent' : 'received';
    const {
        shoutouts,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useShoutoutsList({ type: activeSubTab, limit: 20 });
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '180px 0px' },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <section>
            <div className="px-5 pb-4">
                <div className="flex border-b border-black/10">
                    <Link
                        href="/chats?tab=shoutouts&shoutouts=received"
                        className={cn(
                            'flex-1 border-b-2 pb-3 text-center text-sm font-medium',
                            activeSubTab === 'received'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-[#6b6b6b]',
                        )}
                    >
                        Received
                    </Link>
                    <Link
                        href="/chats?tab=shoutouts&shoutouts=sent"
                        className={cn(
                            'flex-1 border-b-2 pb-3 text-center text-sm font-medium',
                            activeSubTab === 'sent'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-[#6b6b6b]',
                        )}
                    >
                        Sent
                    </Link>
                </div>
            </div>
            {isLoading ? (
                <EmptyState
                    title="Loading shoutouts"
                    body="Checking your shoutouts."
                />
            ) : shoutouts.length ? (
                <div>
                    {shoutouts.map((item) => (
                        <ShoutoutRow key={item.id} shoutout={item} />
                    ))}
                    <LoadMoreRow
                        ref={loadMoreRef}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            ) : (
                <div>
                    <EmptyState
                        title={
                            activeSubTab === 'received'
                                ? 'No received shoutouts'
                                : 'No sent shoutouts'
                        }
                        body={
                            activeSubTab === 'received'
                                ? 'Shoutouts people send you will show here.'
                                : 'Shoutouts you send will show here.'
                        }
                    />
                    <LoadMoreRow
                        ref={loadMoreRef}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                </div>
            )}
        </section>
    );
}

const LoadMoreRow = ({
    ref,
    hasNextPage,
    isFetchingNextPage,
    endLabel = 'No more shoutouts',
}: {
    ref: React.Ref<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    endLabel?: string;
}) => (
    <div ref={ref} className="px-5 py-4 text-center text-xs text-[#6b6b6b]">
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? '' : endLabel}
    </div>
);

function ShoutoutRow({ shoutout }: { shoutout: ShoutoutItem }) {
    return (
        <article className="border-b border-black/10 bg-white p-5">
            <div className="flex items-start gap-3">
                <div className="relative">
                    <Avatar
                        src={shoutout.otherUser.avatarUrl as string | null}
                        name={shoutout.otherUser.name}
                        className="size-12"
                    />
                    {shoutout.type === 'received' && (
                        <div className="absolute inset-0 grid place-items-center text-white">
                            <Lock className="size-5 fill-black/20 drop-shadow" />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                        <h2 className="truncate text-xs font-bold text-primary">
                            {shoutout.otherUser.name}
                        </h2>
                        <span className="text-xs text-[#a1a1a1]">
                            {relativeTime(shoutout.createdAt)}
                        </span>
                    </div>
                    <p className="line-clamp-2 text-sm leading-6">
                        {shoutout.content}
                    </p>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <Chip>
                            {shoutout.type === 'received' ? 'Received' : 'Sent'}
                        </Chip>
                        {shoutout.type === 'received' && (
                            <Link
                                href={`/profile/${shoutout.otherUser.id}`}
                                className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white active:scale-95"
                            >
                                View
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

export function ChatListClient() {
    const {
        conversations,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useConversationsList({ cursor: null, limit: 20 });
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '180px 0px' },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) {
        return (
            <EmptyState
                title="Loading chats"
                body="Checking your conversations."
            />
        );
    }

    if (!conversations.length) {
        return (
            <EmptyState
                title="No chats"
                body="After you match and start a conversation, it will show here."
            />
        );
    }

    return (
        <div className="flex flex-col">
            {conversations.map((conversation) => (
                <Link
                    key={conversation.id}
                    href={`/chats/${conversation.id}`}
                    className="flex items-center border-b border-black/10 px-5 py-4"
                >
                    <Avatar
                        src={conversation.otherUser.avatarUrl as string | null}
                        name={conversation.otherUser.name}
                        className="size-12"
                    />
                    <div className="ml-3 min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="truncate font-semibold">
                                {conversation.otherUser.name}
                            </span>
                            <span className="text-xs text-[#6b6b6b]">
                                {relativeTime(conversation.updatedAt)}
                            </span>
                        </div>
                        <p className="truncate text-sm text-[#6b6b6b]">
                            {conversation.lastMessage?.content ??
                                'No messages yet.'}
                        </p>
                    </div>
                </Link>
            ))}
            <LoadMoreRow
                ref={loadMoreRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                endLabel="No more chats"
            />
        </div>
    );
}

export function ChatClient({ chatId }: { chatId: string }) {
    const { user } = useAuthContext();
    const messagesQuery = useConversationMessages(chatId, 20);
    const loadMoreMessagesRef = useRef<HTMLDivElement | null>(null);

    const { conversations, isLoading: conversationsLoading } =
        useConversationsList({
            cursor: null,
            limit: 20,
        });
    const { mutate: markSeen } = useMarkConversationSeen();

    const [draft, setDraft] = useState('');
    const [localMessages, setLocalMessages] = useState<MessageItemDto[]>([]);
    const conversation = conversations.find((item) => item.id === chatId);
    const apiMessages = messagesQuery.messages;
    const messages = useMemo(
        () => [...apiMessages, ...localMessages],
        [apiMessages, localMessages],
    );
    const myId = user?.user?.id ?? 'me';

    useTopBar({
        title: conversation?.otherUser?.name ?? 'Messages',
        backHref: '/chats',
        action: conversation ? (
            <Avatar
                src={conversation.otherUser.avatarUrl as string | null}
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
        if (!target || !messagesQuery.hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !messagesQuery.isFetchingNextPage) {
                    messagesQuery.fetchNextPage();
                }
            },
            { rootMargin: '180px 0px' },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [
        messagesQuery.fetchNextPage,
        messagesQuery.hasNextPage,
        messagesQuery.isFetchingNextPage,
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

    if (conversationsLoading) {
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
            {messagesQuery.isLoading ? (
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
                hasNextPage={messagesQuery.hasNextPage}
                isFetchingNextPage={messagesQuery.isFetchingNextPage}
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
                    placeholder="Message..."
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
