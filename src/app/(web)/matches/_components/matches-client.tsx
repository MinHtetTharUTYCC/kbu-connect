"use client";

import Link from "next/link";
import {
  Avatar,
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useConversationsList } from "@/hooks/chat/use-conversations-list";
import { useMatchesList } from "@/hooks/matches/use-matches-list";
import { getUserName, relativeTime } from "@/lib/profile-utils";

export function MatchesClient() {
  const { matches, isLoading: matchesLoading } = useMatchesList(20);
  const { conversations, isLoading: conversationsLoading } =
    useConversationsList(20);

  return (
    <MobileScreen>
      <TopBar />
      <main className="flex-1 overflow-y-auto pb-5">
        <section className="bg-white px-5 py-4">
          <div className="flex border-b border-black/10">
            <button
              type="button"
              className="flex-1 border-b-2 border-primary pb-3 text-sm font-medium"
            >
              Matches
            </button>
            <button
              type="button"
              className="flex-1 border-b-2 border-transparent pb-3 text-sm text-[#6b6b6b]"
            >
              Shoutouts
            </button>
          </div>
        </section>

        <section className="bg-white py-2">
          <div className="mb-4 flex items-end justify-between px-5">
            <h1 className="text-xl font-semibold">New Matches</h1>
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {matchesLoading ? (
              <p className="py-4 text-sm text-[#6b6b6b]">Loading matches...</p>
            ) : matches.length ? (
              matches.map((match) => (
                <Link
                  key={match.id}
                  href={
                    match.conversationId
                      ? `/chat/${match.conversationId}`
                      : `/profile/${match.matcher.id}`
                  }
                  className="flex min-w-16 flex-col items-center gap-2 active:scale-95"
                >
                  <div className="relative">
                    <Avatar
                      src={match.matcher.avatarUrl as string | null}
                      name={match.matcher.name}
                      className="size-14"
                    />
                    {match.isNew && (
                      <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-primary" />
                    )}
                  </div>
                  <span className="max-w-16 truncate text-xs font-medium">
                    {getUserName(match.matcher).split(" ")[0]}
                  </span>
                </Link>
              ))
            ) : (
              <p className="py-4 text-sm text-[#6b6b6b]">
                No matches returned yet.
              </p>
            )}
          </div>
        </section>

        <section className="mt-4 bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              type="button"
              className="rounded-xl border border-black/10 bg-[#f9f9f8] px-3 py-1.5 text-xs font-medium"
            >
              Filter
            </button>
          </div>
          <div className="flex flex-col">
            {conversationsLoading ? (
              <EmptyState
                title="Loading messages"
                body="Fetching your conversations."
              />
            ) : conversations.length ? (
              conversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/chat/${conversation.id}`}
                  className="relative flex items-center border-t border-black/10 px-5 py-4 transition hover:bg-[#f9f9f8]"
                >
                  {!conversation.isRead && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-0.5 rounded-r-full bg-primary" />
                  )}
                  <div className="relative">
                    <Avatar
                      src={conversation.otherUser.avatarUrl as string | null}
                      name={conversation.otherUser.name}
                      className="size-10"
                    />
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-primary" />
                    )}
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="mb-0.5 flex items-baseline justify-between gap-3">
                      <span
                        className={
                          conversation.isRead
                            ? "truncate font-medium"
                            : "truncate font-bold"
                        }
                      >
                        {conversation.otherUser.name}
                      </span>
                      <span
                        className={
                          conversation.isRead
                            ? "shrink-0 text-xs text-[#6b6b6b]"
                            : "shrink-0 text-xs font-semibold text-primary"
                        }
                      >
                        {relativeTime(
                          conversation.lastMessage?.timestamp ??
                            conversation.updatedAt,
                        )}
                      </span>
                    </div>
                    <p
                      className={
                        conversation.isRead
                          ? "truncate text-sm text-[#6b6b6b]"
                          : "truncate text-sm font-semibold"
                      }
                    >
                      {conversation.lastMessage?.content ??
                        "Start the conversation."}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <EmptyState
                title="No conversations"
                body="Conversations from the API will appear here after you match."
              />
            )}
          </div>
        </section>
      </main>
    </MobileScreen>
  );
}
