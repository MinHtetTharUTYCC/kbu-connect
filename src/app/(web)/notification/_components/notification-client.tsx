"use client";

import { Bell, Heart, Megaphone, MessageCircle, Star } from "lucide-react";
import { useState } from "react";
import { MobileScreen, TopBar } from "@/components/mobile/app-chrome";

const notifications = [
  {
    id: "n1",
    title: "New Match!",
    body: "You and Sophie from Architecture just matched. Send a message!",
    time: "2m",
    icon: Heart,
    unread: true,
  },
  {
    id: "n2",
    title: "James sent a message",
    body: "Hey! I saw your post about the library study group...",
    time: "15m",
    icon: MessageCircle,
    unread: true,
  },
  {
    id: "n3",
    title: "New Campus Shoutout",
    body: "Someone posted a shoutout to 'The girl in the red scarf'.",
    time: "2h",
    icon: Megaphone,
    unread: false,
  },
  {
    id: "n4",
    title: "Profile Verified",
    body: "Your student ID has been successfully verified.",
    time: "Yesterday",
    icon: Bell,
    unread: false,
  },
];

export function NotificationClient() {
  const [allRead, setAllRead] = useState(false);

  return (
    <MobileScreen className="bg-[#fcf8f8]">
      <TopBar
        action={
          <button
            type="button"
            className="text-xs font-semibold text-primary disabled:text-[#a1a1a1]"
            disabled={allRead}
            onClick={() => setAllRead(true)}
          >
            {allRead ? "All read" : "Mark all as read"}
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto pb-8">
        <div className="px-5 pb-4 pt-8">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <Section title="Today">
          {notifications.slice(0, 3).map((item) => (
            <NotificationRow
              key={item.id}
              {...item}
              unread={item.unread && !allRead}
            />
          ))}
        </Section>
        <Section title="Earlier">
          {notifications.slice(3).map((item) => (
            <NotificationRow key={item.id} {...item} unread={false} />
          ))}
          <div className="mx-5 mt-6 overflow-hidden rounded-xl border border-black/10 bg-primary p-4 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
                  UPGRADE
                </span>
                <h2 className="mt-3 text-xl font-bold leading-tight">
                  See who is already into you.
                </h2>
                <p className="mt-2 max-w-[260px] text-sm leading-6 text-white/90">
                  Unlock your likes list and start more conversations.
                </p>
              </div>
              <Star className="size-16 shrink-0 fill-white/15 text-white/15" />
            </div>
          </div>
        </Section>
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
  title,
  body,
  time,
  icon: Icon,
  unread,
}: {
  title: string;
  body: string;
  time: string;
  icon: typeof Heart;
  unread: boolean;
}) {
  return (
    <div
      className={
        unread
          ? "border-b border-black/10 bg-[#fff1ed]"
          : "border-b border-black/10 bg-white"
      }
    >
      <div className="flex gap-4 px-5 py-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#ffdbd1] text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-start justify-between gap-3">
            <h3 className="font-semibold">{title}</h3>
            <span className="text-xs text-[#6b6b6b]">{time}</span>
          </div>
          <p className="text-sm leading-6 text-[#434655]">{body}</p>
        </div>
      </div>
    </div>
  );
}
