"use client";

import Link from "next/link";
import { Avatar, MobileScreen, TopBar } from "@/components/mobile/app-chrome";
import { useMatchesList } from "@/hooks/matches/use-matches-list";
import { getUserName } from "@/lib/profile-utils";

export function MatchesClient() {
  const { matches, isLoading: matchesLoading } = useMatchesList(20);

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
      </main>
    </MobileScreen>
  );
}
