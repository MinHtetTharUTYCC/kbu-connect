"use client";

import { Lock } from "lucide-react";
import {
  Avatar,
  Chip,
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useNotificationsList } from "@/hooks/notifications/use-notifications-list";
import { relativeTime } from "@/lib/profile-utils";
import { NotificationItemDtoType } from "../../../../../services/model";

export function ShoutoutsClient() {
  const { notifications, isLoading } = useNotificationsList(30);
  const shoutouts = notifications.filter(
    (notification) =>
      notification.type === NotificationItemDtoType.SHOUTOUT_RECEIVED ||
      notification.type === NotificationItemDtoType.SHOUTOUT_REPLIED,
  );

  return (
    <MobileScreen>
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-6">
        <section className="px-5 py-6">
          <h1 className="mb-6 text-xl font-semibold">Shoutouts</h1>
          <div className="flex rounded-xl border border-black/10 bg-[#f9f9f8] p-1">
            <button
              type="button"
              className="flex-1 rounded-lg border border-primary bg-white py-2 text-xs font-semibold text-primary shadow-sm"
            >
              Received
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-xs font-semibold text-[#6b6b6b]"
            >
              Sent
            </button>
          </div>
        </section>

        {isLoading ? (
          <EmptyState
            title="Loading shoutouts"
            body="Fetching shoutout notifications from the API."
          />
        ) : shoutouts.length ? (
          <section>
            {shoutouts.map((item) => (
              <article
                key={item.id}
                className="border-b border-black/10 bg-white p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar
                      src={null}
                      name={item.title}
                      className="size-12 blur-[1px] grayscale"
                    />
                    <div className="absolute inset-0 grid place-items-center text-white">
                      <Lock className="size-5 fill-black/20 drop-shadow" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h2 className="truncate text-xs font-bold text-primary">
                        {item.title}
                      </h2>
                      <span className="text-xs text-[#a1a1a1]">
                        {relativeTime(item.createdAt)}
                      </span>
                    </div>
                    {item.body && (
                      <p className="line-clamp-2 text-sm italic leading-6">
                        {item.body}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <Chip>Shoutout</Chip>
                      <span className="text-xs font-medium text-[#6b6b6b]">
                        {item.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <EmptyState
            title="No shoutouts"
            body="Shoutout notifications returned by the API will appear here."
          />
        )}
      </main>
    </MobileScreen>
  );
}
