'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { LoadMoreRow } from '@/components/load-more-row';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useConversationsList } from '@/hooks/chat/use-conversations-list';
import { getFormattedDate, getLastSeenToday } from '@/lib/date/format-date';
import { cn } from '@/lib/utils';
import ItemsLoading from './loading';
import { ShoutoutsPanel } from './shoutouts-panel';
import { Badge } from '@/components/ui/badge';

type ChatTab = 'chats' | 'shoutouts';

export function ChatHomeClient() {
    const searchParams = useSearchParams();
    const activeTab: ChatTab = searchParams.get('tab') === 'shoutouts' ? 'shoutouts' : 'chats';

    useTopBar({ title: 'Chats' });

    return (
        <main className="flex-1 overflow-y-auto pb-5">
            <div className="bg-white px-5 py-4">
                <div className="flex rounded-xl border border-black/10 bg-muted p-1">
                    <Link
                        href="/chats"
                        className={cn(
                            'flex-1 rounded-lg py-2 text-center text-xs font-semibold',
                            activeTab === 'chats' ? 'border border-primary bg-white text-primary shadow-sm' : 'text-muted-foreground'
                        )}
                    >
                        Chats
                    </Link>
                    <Link
                        href="/chats?tab=shoutouts"
                        className={cn(
                            'flex-1 rounded-lg py-2 text-center text-xs font-semibold',
                            activeTab === 'shoutouts' ? 'border border-primary bg-white text-primary shadow-sm' : 'text-muted-foreground'
                        )}
                    >
                        Shoutouts
                    </Link>
                </div>
            </div>
            {activeTab === 'shoutouts' ? <ShoutoutsPanel /> : <ChatListClient />}
        </main>
    );
}

export function ChatListClient() {
    const { conversations, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useConversationsList();
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
            { rootMargin: '180px 0px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    if (isLoading) return <ItemsLoading />;

    if (!conversations.length) {
        return <EmptyState title="No chats" body="After you match and start a conversation, it will show here." icon="message" />;
    }

    return (
        <div className="flex flex-col">
            {conversations.map((conversation, idx) => {
                const lastSeenToday = !conversation.isOnline && conversation.lastOnline ? getLastSeenToday(conversation.lastOnline) : null;
                return (
                    <Link
                        key={`${conversation.id}-${idx}`}
                        href={`/chats/${conversation.id}`}
                        className="flex items-center border-b border-black/10 px-5 py-4 active:bg-black/5"
                    >
                        <div className="shrink-0 relative">
                            <Avatar src={conversation.otherUser.avatarUrl} name={conversation.otherUser.name} className="size-12" />
                            {conversation.isOnline ? (
                                <Badge className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full px-1 text-[9px] bg-green-500" />
                            ) : (
                                conversation.lastOnline && (
                                    <Badge className="absolute bottom-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full text-[9px]  bg-green-500">
                                        {lastSeenToday}
                                    </Badge>
                                )
                            )}
                        </div>
                        <div className="ml-3 min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="truncate font-semibold">{conversation.otherUser.name}</span>
                                <span className="text-xs text-muted-foreground">{getFormattedDate(conversation.updatedAt)}</span>
                            </div>
                            <p className="block truncate text-sm text-muted-foreground">
                                {conversation.lastMessage?.content ?? 'No messages yet.'}
                            </p>
                        </div>
                    </Link>
                );
            })}
            <LoadMoreRow ref={loadMoreRef} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} endLabel="No more chats" />
        </div>
    );
}
