'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { DeleteConfirmSheet } from '@/components/mobile/delete-confirm-sheet';
import { ShoutoutDetailSheet } from '@/components/mobile/shoutout-detail-sheet';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationsList } from '@/hooks/chat/use-conversations-list';
import {
    type ShoutoutItem,
    type ShoutoutType,
    useShoutoutsList,
} from '@/hooks/chat/use-shoutouts-list';
import { useDeleteShoutout } from '@/hooks/chat/use-delete-shoutout';
import { useReplyShoutout } from '@/hooks/chat/use-reply-shoutout';
import { relativeTime } from '@/lib/profile-utils';
import { cn } from '@/lib/utils';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { LoadMoreRow } from '@/components/load-more-row';

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
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeSubTab: ShoutoutType =
        searchParams.get('shoutouts') === 'sent' ? 'sent' : 'received';
    const {
        shoutouts,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useShoutoutsList({ type: activeSubTab });
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [selectedShoutoutId, setSelectedShoutoutId] = useState<string | null>(
        null,
    );
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
        null,
    );
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
    const { mutate: replyToShoutout, isPending: isReplying } =
        useReplyShoutout();
    const { mutate: deleteShoutout, isPending: isDeleting } =
        useDeleteShoutout();

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
                    {shoutouts.map((item, index) => (
                        <ShoutoutRow
                            key={`${item.id}-${index}`}
                            shoutout={item}
                            onClick={() => setSelectedShoutoutId(item.id)}
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
            {selectedShoutoutId && (
                <ShoutoutDetailSheet
                    shoutout={
                        shoutouts.find((s) => s.id === selectedShoutoutId)!
                    }
                    onClose={() => setSelectedShoutoutId(null)}
                    onDelete={() => {
                        setDeleteTargetId(selectedShoutoutId);
                        setSelectedShoutoutId(null);
                    }}
                    onProfileClick={(userId) => {
                        setSelectedShoutoutId(null);
                        setSelectedProfileId(userId);
                    }}
                    onReply={(message) =>
                        replyToShoutout(
                            {
                                shoutoutId: selectedShoutoutId!,
                                data: { message },
                            },
                            {
                                onSuccess: () => {
                                    setSelectedShoutoutId(null);
                                },
                            },
                        )
                    }
                    isDeleting={isDeleting}
                    isReplying={isReplying}
                />
            )}
            {deleteTargetId && (
                <DeleteConfirmSheet
                    title="Delete shoutout"
                    message="Are you sure you want to delete this shoutout? This action cannot be undone."
                    isPending={isDeleting}
                    onClose={() => setDeleteTargetId(null)}
                    onConfirm={() =>
                        deleteShoutout(
                            { shoutoutId: deleteTargetId },
                            {
                                onSuccess: () => setDeleteTargetId(null),
                            },
                        )
                    }
                />
            )}
        </section>
    );
}

function ShoutoutRow({
    shoutout,
    onClick,
}: {
    shoutout: ShoutoutItem;
    onClick: () => void;
}) {
    return (
        <article
            className="border-b border-black/10 bg-white p-5 active:bg-black/5"
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                <Avatar
                    src={shoutout.otherUser.avatarUrl}
                    name={shoutout.otherUser.name}
                    className="size-12"
                />
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="truncate text-xs font-bold">
                            {shoutout.otherUser.name}
                        </span>
                        <span className="text-xs text-[#a1a1a1]">
                            {relativeTime(shoutout.createdAt)}
                        </span>
                    </div>
                    <p className="line-clamp-1 text-sm leading-6">
                        {shoutout.type === 'sent'
                            ? `You: ${shoutout.content}`
                            : shoutout.content}
                    </p>
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
    } = useConversationsList({ cursor: null });
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
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
                <Link
                    key={conversation.id}
                    href={`/chats/${conversation.id}`}
                    className="flex items-center border-b border-black/10 px-5 py-4 active:bg-black/5"
                >
                    <div className="shrink-0">
                        <Avatar
                            src={conversation.otherUser.avatarUrl}
                            name={conversation.otherUser.name}
                            className="size-12"
                        />
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                            <span className="truncate font-semibold">
                                {conversation.otherUser.name}
                            </span>
                            <span className="text-xs text-[#6b6b6b]">
                                {relativeTime(conversation.updatedAt)}
                            </span>
                        </div>
                        <p className="block truncate text-sm text-[#6b6b6b]">
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
