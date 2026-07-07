'use client';

import { type NotificationItemDto, NotificationItemDtoType } from '@services/model';
import { Bell, BellCheck, BellRing, Heart, Loader2, Megaphone, MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { LoadMoreRow } from '@/components/load-more-row';
import { EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import Skeleton from '@/components/skeleton';
import { useMarkAllNotificationsRead } from '@/hooks/notifications/use-mark-all-notifications-read';
import { useNotificationsUnreadCount } from '@/hooks/notifications/use-noti-unread-count';
import { useNotificationsList } from '@/hooks/notifications/use-notifications-list';
import { getFormattedDate } from '@/lib/date/format-date';
import { cn } from '@/lib/utils';

export function NotificationClient() {
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { notifications, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotificationsList({});
    const { mutate: markAllRead, isPending: isMarkingAllRead } = useMarkAllNotificationsRead();

    const { data: countData = { unreadCount: 0 } } = useNotificationsUnreadCount();

    useTopBar({
        title: 'Notifications',
        action: (
            <button
                type="button"
                className="p-2 bg-primary/10 rounded-md text-primary disabled:text-muted-foreground"
                disabled={countData.unreadCount === 0 || isMarkingAllRead}
                onClick={() => markAllRead()}
            >
                {isMarkingAllRead ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : countData.unreadCount === 0 ? (
                    <BellCheck className="w-4 h-4" />
                ) : (
                    <BellRing className="w-4 h-4" />
                )}
            </button>
        )
    });

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '160px 0px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <main className="flex-1 overflow-y-auto bg-background pb-8">
            {isLoading ? (
                <Skeleton />
            ) : notifications.length ? (
                <Section title="">
                    <div className="space-y-1.5">
                        {notifications.map((item) => (
                            <NotificationRow key={item.id} notification={item} />
                        ))}
                    </div>
                    <LoadMoreRow
                        ref={loadMoreRef}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        endLabel="No More Notifications"
                    />
                </Section>
            ) : (
                <EmptyState
                    title="No notifications"
                    body="You are all caught up. New matches, messages, and updates will show here."
                    icon={'bell'}
                />
            )}
        </main>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-6">
            <h2 className="mb-2 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
            {children}
        </section>
    );
}

function NotificationRow({ notification }: { notification: NotificationItemDto }) {
    const Icon = getNotificationIcon(notification.type);

    return (
        <div
            className={cn(
                'rounded-md',
                notification.isRead ? 'border-b border-black/10 bg-white' : 'border-b border-black/10 bg-primary/10'
            )}
        >
            <div className="flex gap-4 px-5 py-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-start justify-between gap-3">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="shrink-0 text-xs text-muted-foreground">{getFormattedDate(notification.createdAt)}</span>
                    </div>
                    {notification.body && <p className="text-sm leading-6 text-foreground">{notification.body}</p>}
                </div>
            </div>
        </div>
    );
}

function getNotificationIcon(type: NotificationItemDto['type']) {
    if (type === NotificationItemDtoType.NEW_MATCH) return Heart;
    if (type === NotificationItemDtoType.NEW_MESSAGE) return MessageCircle;
    if (type === NotificationItemDtoType.SHOUTOUT_RECEIVED || type === NotificationItemDtoType.SHOUTOUT_REPLIED) {
        return Megaphone;
    }
    return Bell;
}
