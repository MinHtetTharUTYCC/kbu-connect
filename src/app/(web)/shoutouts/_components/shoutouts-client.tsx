"use client";

import { Lock } from "lucide-react";
import {
  Avatar,
  Chip,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";

const shoutouts = [
  {
    id: "s1",
    name: "Mystery Student",
    meta: "Biology Major",
    text: "I saw you at the library yesterday reading that biology textbook. You seemed so focused...",
    locked: true,
  },
  {
    id: "s2",
    name: "Marcus Chen",
    meta: "Economics Senior",
    text: "That presentation you gave in Economics was incredible. Would love to grab a coffee...",
    locked: false,
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "s3",
    name: "Someone in Engineering",
    meta: "Engineering Major",
    text: "You left your scarf at the Student Union yesterday. I turned it into lost and found...",
    locked: true,
  },
  {
    id: "s4",
    name: "Sarah Williams",
    meta: "Chem Engineering Soph.",
    text: "Thanks for the help with the Chem lab. I actually understood the titration for once.",
    locked: false,
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
  },
];

export function ShoutoutsClient() {
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
        <section>
          {shoutouts.map((item) => (
            <article
              key={item.id}
              className="border-b border-black/10 bg-white p-5"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar
                    src={item.avatar}
                    name={item.name}
                    className={
                      item.locked ? "size-12 blur-[1px] grayscale" : "size-12"
                    }
                  />
                  {item.locked && (
                    <div className="absolute inset-0 grid place-items-center text-white">
                      <Lock className="size-5 fill-black/20 drop-shadow" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <h2
                      className={
                        item.locked
                          ? "truncate text-xs font-bold text-primary"
                          : "truncate text-xs font-bold"
                      }
                    >
                      {item.name}
                    </h2>
                    <span className="text-xs text-[#a1a1a1]">2h ago</span>
                  </div>
                  <p
                    className={
                      item.locked
                        ? "line-clamp-2 text-sm italic leading-6"
                        : "line-clamp-2 text-sm leading-6"
                    }
                  >
                    {item.text}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Chip>{item.meta}</Chip>
                    <button
                      type="button"
                      className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white active:scale-95"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </MobileScreen>
  );
}
