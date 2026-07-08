'use client';

import { type NotificationItemDto, NotificationItemDtoType } from '@services/model';
import { Bell, BellRing, Heart, Loader2, Megaphone, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ItemsLoading from '@/app/chats/_components/loading';
import { LoadMoreRow } from '@/components/load-more-row';
import { EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useMarkAllNotificationsRead } from '@/hooks/notifications/use-mark-all-notifications-read';
import { useNotificationsUnreadCount } from '@/hooks/notifications/use-noti-unread-count';
import { useNotificationsList } from '@/hooks/notifications/use-notifications-list';
import { getFormattedDate } from '@/lib/date/format-date';
import { cn } from '@/lib/utils';
import { NotificationDetailSheet } from './notification-detail-sheet';

export function NotificationClient() {
    const router = useRouter();
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [selectedNotification, setSelectedNotification] = useState<NotificationItemDto | null>(null);

    const { notifications, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotificationsList({});
    const { mutate: markAllRead, isPending: isMarkingAllRead } = useMarkAllNotificationsRead();

    const { data: countData = { unreadCount: 0 } } = useNotificationsUnreadCount();

    useTopBar({
        title: 'Notifications',
        action:
            isMarkingAllRead || countData.unreadCount > 0 ? (
                <button
                    type="button"
                    className="p-2 bg-primary/10 rounded-md text-primary disabled:text-muted-foreground"
                    disabled={countData.unreadCount === 0 || isMarkingAllRead}
                    onClick={() => markAllRead()}
                >
                    {isMarkingAllRead ? <Loader2 className="w-4 h-4 animate-spin" /> : <BellRing className="w-4 h-4" />}
                </button>
            ) : undefined
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

    function handleNavigate(notification: NotificationItemDto) {
        switch (notification.type) {
            case NotificationItemDtoType.NEW_MESSAGE:
                router.push(`/chats/${(notification.data as Record<string, unknown>)?.conversationId}`);
                break;
            case NotificationItemDtoType.NEW_MATCH:
                router.push('/matches');
                break;
            case NotificationItemDtoType.SHOUTOUT_RECEIVED:
                router.push('/chats?tab=shoutouts');
                break;
            case NotificationItemDtoType.SHOUTOUT_REPLIED:
                router.push(`/chats/${(notification.data as Record<string, unknown>)?.conversationId}`);
                break;
            case NotificationItemDtoType.SYSTEM:
            case NotificationItemDtoType.ANNOUNCEMENT:
                setSelectedNotification(notification);
                break;
        }
    }

    return (
        <main className="flex-1 overflow-y-auto bg-background pb-8">
            {isLoading ? (
                <ItemsLoading />
            ) : notifications.length ? (
                <Section title="">
                    <div className="space-y-1.5">
                        {notifications.map((item) => (
                            <NotificationRow key={item.id} notification={item} onNavigate={handleNavigate} />
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
            <NotificationDetailSheet notification={selectedNotification} onClose={() => setSelectedNotification(null)} />
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

function NotificationRow({
    notification,
    onNavigate
}: {
    notification: NotificationItemDto;
    onNavigate: (notification: NotificationItemDto) => void;
}) {
    const Icon = getNotificationIcon(notification.type);

    return (
        <button
            type="button"
            onClick={() => onNavigate(notification)}
            className={cn(
                'w-full rounded-md text-left active:bg-black/5',
                notification.isRead ? 'border-b border-black/10 bg-white' : 'border-b border-black/10 bg-primary/10'
            )}
        >
            <div className="flex gap-4 px-5 py-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                    <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-start justify-between gap-3">
                        <h3 className="font-semibold line-clamp-2">{notification.title}</h3>
                        <span className="shrink-0 text-xs text-muted-foreground">{getFormattedDate(notification.createdAt)}</span>
                    </div>
                    {notification.body && <p className="text-sm leading-6 text-foreground line-clamp-2">{notification.body}</p>}
                </div>
            </div>
        </button>
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
