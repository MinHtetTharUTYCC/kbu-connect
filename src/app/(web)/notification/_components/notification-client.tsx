"use client";

import { Bell, Heart, Megaphone, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useMarkAllNotificationsRead } from "@/hooks/notifications/use-mark-all-notifications-read";
import { useNotificationsList } from "@/hooks/notifications/use-notifications-list";
import { relativeTime } from "@/lib/profile-utils";
import {
  NotificationItemDto,
  NotificationItemDtoType,
} from "../../../../../services/model";

export function NotificationClient() {
  const {
    notifications,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotificationsList({ limit: 20 });
  const markAllRead = useMarkAllNotificationsRead();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const hasUnread = notifications.some((item) => !item.isRead);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <MobileScreen className="bg-[#fcf8f8]">
      <TopBar
        action={
          <button
            type="button"
            className="text-xs font-semibold text-primary disabled:text-[#a1a1a1]"
            disabled={!hasUnread || markAllRead.isPending}
            onClick={() => markAllRead.mutate()}
          >
            {markAllRead.isPending
              ? "Marking..."
              : hasUnread
                ? "Mark all as read"
                : "All read"}
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto pb-8">
        {isLoading ? (
          <EmptyState
            title="Loading notifications"
            body="Checking for new activity."
          />
        ) : notifications.length ? (
          <Section title="Latest">
            {notifications.map((item) => (
              <NotificationRow key={item.id} notification={item} />
            ))}
            <div
              ref={loadMoreRef}
              className="px-5 py-4 text-center text-xs text-[#6b6b6b]"
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                  ? ""
                  : "No more notifications"}
            </div>
          </Section>
        ) : (
          <EmptyState
            title="No notifications"
            body="You are all caught up. New matches, messages, and updates will show here."
          />
        )}
      </main>
    </MobileScreen>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-5 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function NotificationRow({
  notification,
}: {
  notification: NotificationItemDto;
}) {
  const Icon = getNotificationIcon(notification.type);

  return (
    <div
      className={
        notification.isRead
          ? "border-b border-black/10 bg-white"
          : "border-b border-black/10 bg-[#fff1ed]"
      }
    >
      <div className="flex gap-4 px-5 py-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffdbd1] text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-start justify-between gap-3">
            <h3 className="font-semibold">{notification.title}</h3>
            <span className="shrink-0 text-xs text-[#6b6b6b]">
              {relativeTime(notification.createdAt)}
            </span>
          </div>
          {notification.body && (
            <p className="text-sm leading-6 text-[#434655]">
              {notification.body}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function getNotificationIcon(type: NotificationItemDto["type"]) {
  if (type === NotificationItemDtoType.NEW_MATCH) return Heart;
  if (type === NotificationItemDtoType.NEW_MESSAGE) return MessageCircle;
  if (
    type === NotificationItemDtoType.SHOUTOUT_RECEIVED ||
    type === NotificationItemDtoType.SHOUTOUT_REPLIED
  ) {
    return Megaphone;
  }
  return Bell;
}
