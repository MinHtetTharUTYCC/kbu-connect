"use client";

import { Heart, Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Chip,
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useDiscoveryProfiles } from "@/hooks/discovery/use-discovery-profiles";
import { useSwipeProfile } from "@/hooks/swipes/use-swipe-profile";
import { cn } from "@/lib/utils";

export function DiscoverClient() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const discovery = useDiscoveryProfiles(10);
  const swipe = useSwipeProfile();
  const profiles = discovery.profiles;
  const profile = profiles[index];
  const remainingProfiles = profiles.length - index;

  useEffect(() => {
    if (
      remainingProfiles <= 3 &&
      discovery.hasNextPage &&
      !discovery.isFetchingNextPage
    ) {
      discovery.fetchNextPage();
    }
  }, [
    discovery.fetchNextPage,
    discovery.hasNextPage,
    discovery.isFetchingNextPage,
    remainingProfiles,
  ]);

  function handleSwipe(type: "LIKE" | "DISLIKE") {
    if (!profile) return;
    setDirection(type === "LIKE" ? "right" : "left");
    if (type === "LIKE") {
      swipe.like(profile.id);
    } else {
      swipe.dislike(profile.id);
    }
    window.setTimeout(() => {
      setIndex((value) => value + 1);
      setDirection(null);
    }, 260);
  }

  if (discovery.isLoading) {
    return (
      <MobileScreen>
        <TopBar />
        <EmptyState
          title="Loading profiles"
          body="Fetching real discovery profiles from the API."
        />
      </MobileScreen>
    );
  }

  if (!profile) {
    if (discovery.isFetchingNextPage) {
      return (
        <MobileScreen>
          <TopBar />
          <EmptyState
            title="Loading more profiles"
            body="Fetching the next discovery page from the API."
          />
        </MobileScreen>
      );
    }

    return (
      <MobileScreen>
        <TopBar />
        <EmptyState
          title="No profiles nearby"
          body="Check back later as more KBU students complete their profiles."
        />
      </MobileScreen>
    );
  }

  return (
    <MobileScreen className="bg-[#fcf8f8]">
      <TopBar />
      <main className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <section className="relative flex min-h-[560px] flex-1 items-center justify-center">
          <div
            className={cn(
              "relative flex h-full max-h-[610px] min-h-[500px] w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm transition duration-300",
              direction === "left" && "-translate-x-24 -rotate-6 opacity-0",
              direction === "right" && "translate-x-24 rotate-6 opacity-0",
            )}
          >
            <div className="relative flex-1 overflow-hidden bg-[#ebe7e7]">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.name}
                  fill
                  priority
                  sizes="(max-width: 430px) 100vw, 430px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-[linear-gradient(135deg,#ffdbd1,#ebe7e7_45%,#f9f9f8)]" />
              )}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/50 to-transparent" />
              {direction === "left" && (
                <SwipeStamp
                  label="PASS"
                  className="left-8 -rotate-12 border-[#737686] text-[#737686]"
                />
              )}
              {direction === "right" && (
                <SwipeStamp
                  label="LIKE"
                  className="right-8 rotate-12 border-primary text-primary"
                />
              )}
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-end gap-2">
                <h1 className="text-xl font-semibold">
                  {profile?.name}
                  {profile?.age ? `, ${profile.age}` : ""}
                </h1>
                <span className="pb-0.5 text-sm text-[#6b6b6b]">
                  {profile?.nationality
                    ? profile.nationality.slice(0, 2)
                    : "KBU"}
                </span>
              </div>
              {profile?.faculty && <Chip>{profile.faculty}</Chip>}
              {profile?.bio && (
                <p className="text-sm leading-6 text-[#434655]">
                  {profile.bio}
                </p>
              )}
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {profile.interests.map((interest) => (
                  <Chip key={interest}>{interest}</Chip>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="mt-7 flex items-center justify-center gap-8">
          <ActionButton
            label="Pass"
            onClick={() => handleSwipe("DISLIKE")}
            disabled={swipe.isPending}
          >
            <X className="size-7" />
          </ActionButton>
          <ActionButton label="Star" compact>
            <Star className="size-6 fill-primary" />
          </ActionButton>
          <ActionButton
            label="Like"
            onClick={() => handleSwipe("LIKE")}
            disabled={swipe.isPending}
          >
            <Heart className="size-7 fill-primary" />
          </ActionButton>
        </section>
      </main>
    </MobileScreen>
  );
}

function SwipeStamp({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "absolute top-8 z-10 rounded-xl border-4 px-4 py-1 text-xl font-bold",
        className,
      )}
    >
      {label}
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  disabled,
  compact = false,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid place-items-center rounded-full border border-black/10 bg-white text-primary shadow-sm transition active:scale-90 disabled:opacity-50",
        compact ? "size-12" : "size-14",
      )}
    >
      {children}
    </button>
  );
}
