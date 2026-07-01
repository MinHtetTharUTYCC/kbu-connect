'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Avatar, Chip, EmptyState } from '@/components/mobile/app-chrome';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationsList } from '@/hooks/chat/use-conversations-list';
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
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
        null,
    );
    const router = useRouter();

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
                        <ShoutoutRow
                            key={item.id}
                            shoutout={item}
                            onUserClick={setSelectedProfileId}
                        />
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
            {selectedProfileId && (
                <ProfileSheet
                    userId={selectedProfileId}
                    onClose={() => setSelectedProfileId(null)}
                    onMessage={() => router.push(`/chats/${selectedProfileId}`)}
                    from="visit"
                />
            )}
        </section>
    );
}

export const LoadMoreRow = ({
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

function ShoutoutRow({
    shoutout,
    onUserClick,
}: {
    shoutout: ShoutoutItem;
    onUserClick: (userId: string) => void;
}) {
    return (
        <article className="border-b border-black/10 bg-white p-5">
            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => onUserClick(shoutout.otherUser.id)}
                    className="relative shrink-0"
                >
                    <Avatar
                        src={shoutout.otherUser.avatarUrl}
                        name={shoutout.otherUser.name}
                        className="size-12"
                    />
                    {shoutout.type === 'received' && (
                        <div className="absolute inset-0 grid place-items-center text-white">
                            <Lock className="size-5 fill-black/20 drop-shadow" />
                        </div>
                    )}
                </button>
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => onUserClick(shoutout.otherUser.id)}
                            className="truncate text-xs font-bold text-primary active:opacity-70"
                        >
                            {shoutout.otherUser.name}
                        </button>
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
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
        null,
    );
    const router = useRouter();

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
                <div
                    key={conversation.id}
                    className="flex items-center border-b border-black/10 px-5 py-4"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedProfileId(conversation.otherUser.id)
                        }
                        className="shrink-0"
                    >
                        <Avatar
                            src={conversation.otherUser.avatarUrl}
                            name={conversation.otherUser.name}
                            className="size-12"
                        />
                    </button>
                    <div className="ml-3 min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedProfileId(
                                        conversation.otherUser.id,
                                    )
                                }
                                className="truncate font-semibold active:opacity-70"
                            >
                                {conversation.otherUser.name}
                            </button>
                            <span className="text-xs text-[#6b6b6b]">
                                {relativeTime(conversation.updatedAt)}
                            </span>
                        </div>
                        <Link
                            href={`/chats/${conversation.id}`}
                            className="block truncate text-sm text-[#6b6b6b]"
                        >
                            {conversation.lastMessage?.content ??
                                'No messages yet.'}
                        </Link>
                    </div>
                </div>
            ))}
            <LoadMoreRow
                ref={loadMoreRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                endLabel="No more chats"
            />
            {selectedProfileId && (
                <ProfileSheet
                    userId={selectedProfileId}
                    onClose={() => setSelectedProfileId(null)}
                    onMessage={() => router.push(`/chats/${selectedProfileId}`)}
                    from="visit"
                />
            )}
        </div>
    );
}
