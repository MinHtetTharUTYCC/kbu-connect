"use client";

import { Heart, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Chip, EmptyState } from "@/components/mobile/app-chrome";
import { useTopBar } from "@/components/mobile/top-bar-provider";
import { useSendShoutout } from "@/hooks/chat/use-send-shoutout";
import { useDiscoveryProfiles } from "@/hooks/discovery/use-discovery-profiles";
import { useSwipeProfile } from "@/hooks/swipes/use-swipe-profile";
import { cn } from "@/lib/utils";

const SWIPE_THRESHOLD = 80;

export function DiscoverClient() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [isShoutoutOpen, setIsShoutoutOpen] = useState(false);
    const [shoutoutMessage, setShoutoutMessage] = useState("");
    const [dragX, setDragX] = useState(0);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isDragging = useRef(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const {
        profiles,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useDiscoveryProfiles({ limit: 10 });
    const { like, dislike, isPending: isSwipePending } = useSwipeProfile();
    const { mutateAsync: sendShoutout, isPending: isSendingShoutout } =
        useSendShoutout();
    const profile = profiles[index];
    const remainingProfiles = profiles.length - index;

    useTopBar({});

    useEffect(() => {
        if (remainingProfiles <= 3 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, remainingProfiles]);

    const handleSwipe = useCallback(
        (type: "LIKE" | "DISLIKE") => {
            if (!profile || direction) return;
            setDirection(type === "LIKE" ? "right" : "left");
            setDragX(0);
            if (type === "LIKE") {
                like(profile.id);
            } else {
                dislike(profile.id);
            }
            window.setTimeout(() => {
                setIndex((value) => value + 1);
                setDirection(null);
            }, 260);
        },
        [profile, direction, like, dislike],
    );

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isDragging.current = false;
    }

    function handleTouchMove(e: React.TouchEvent) {
        if (isSwipePending || direction) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = e.touches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
            isDragging.current = true;
            setDragX(dx);
        }
    }

    function handleTouchEnd() {
        if (isDragging.current) {
            if (dragX > SWIPE_THRESHOLD) {
                handleSwipe("LIKE");
            } else if (dragX < -SWIPE_THRESHOLD) {
                handleSwipe("DISLIKE");
            } else {
                setDragX(0);
            }
        }
        isDragging.current = false;
    }

    async function handleSendShoutout(e: React.FormEvent) {
        e.preventDefault();
        if (!profile || !shoutoutMessage.trim()) return;

        await sendShoutout({
            data: {
                receiverId: profile.id,
                message: shoutoutMessage.trim(),
            },
        });
        setShoutoutMessage("");
        setIsShoutoutOpen(false);
    }

    if (isLoading) {
        return (
            <EmptyState
                title="Loading profiles"
                body="Finding people you may want to meet."
            />
        );
    }

    if (!profile) {
        if (isFetchingNextPage) {
            return (
                <EmptyState
                    title="Loading more profiles"
                    body="Looking for more people from the campus."
                />
            );
        }

        return (
            <EmptyState
                title="No profiles nearby"
                body="Check back later as more KBU students complete their profiles."
            />
        );
    }

    const dragRotation = dragX * 0.06;
    const dragOpacity = Math.max(0, 1 - Math.abs(dragX) / 300);
    const showLikeStamp =
        direction === "right" || (!direction && dragX > SWIPE_THRESHOLD * 0.5);
    const showPassStamp =
        direction === "left" || (!direction && dragX < -SWIPE_THRESHOLD * 0.5);

    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-[#fcf8f8]">
            <main className="flex flex-1 flex-col overflow-hidden px-5 pb-6 pt-5">
                <section className="relative flex min-h-0 flex-1 items-center justify-center">
                    <div
                        ref={cardRef}
                        className={cn(
                            "relative flex h-full min-h-[400px] w-full max-w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm",
                            !dragX && "transition duration-300",
                            direction === "left" &&
                                "-translate-x-24 -rotate-6 opacity-0",
                            direction === "right" &&
                                "translate-x-24 rotate-6 opacity-0",
                        )}
                        style={{
                            transform: direction
                                ? undefined
                                : `translateX(${dragX}px) rotate(${dragRotation}deg)`,
                            opacity: direction ? undefined : dragOpacity,
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
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
                            {showLikeStamp && (
                                <SwipeStamp
                                    label="LIKE"
                                    className="right-8 rotate-12 border-primary text-primary"
                                />
                            )}
                            {showPassStamp && (
                                <SwipeStamp
                                    label="PASS"
                                    className="left-8 -rotate-12 border-[#737686] text-[#737686]"
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
                <section className="mt-4 flex shrink-0 items-center justify-center gap-8 pb-2">
                    <ActionButton
                        label="Pass"
                        onClick={() => handleSwipe("DISLIKE")}
                        disabled={isSwipePending}
                    >
                        <X className="size-7" />
                    </ActionButton>
                    <ActionButton
                        label="Send shoutout"
                        compact
                        onClick={() => setIsShoutoutOpen(true)}
                        disabled={isSendingShoutout}
                    >
                        <MessageCircle className="size-6" />
                    </ActionButton>
                    <ActionButton
                        label="Like"
                        onClick={() => handleSwipe("LIKE")}
                        disabled={isSwipePending}
                    >
                        <Heart className="size-7 fill-primary" />
                    </ActionButton>
                </section>
            </main>
            {isShoutoutOpen && (
                <ShoutoutSheet
                    message={shoutoutMessage}
                    name={profile.name}
                    isSending={isSendingShoutout}
                    onChange={setShoutoutMessage}
                    onClose={() => setIsShoutoutOpen(false)}
                    onSubmit={handleSendShoutout}
                />
            )}
        </div>
    );
}

function ShoutoutSheet({
    name,
    message,
    isSending,
    onChange,
    onClose,
    onSubmit,
}: {
    name: string;
    message: string;
    isSending: boolean;
    onChange: (value: string) => void;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
}) {
    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 px-4 pb-4">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-[398px] rounded-t-2xl bg-white p-5 shadow-xl"
            >
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold">Send shoutout</h2>
                        <p className="mt-1 text-sm text-[#6b6b6b]">
                            Write to {name}.
                        </p>
                        <p className="mt-1 text-xs text-[#a1a1a1]">
                            You can send 5 shoutouts a day.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 place-items-center rounded-full bg-[#f9f9f8] text-[#6b6b6b]"
                        aria-label="Close shoutout"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Say something short..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-black/10 bg-[#f9f9f8] p-3 text-sm leading-6 outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={!message.trim() || isSending}
                    className="mt-4 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-50"
                >
                    {isSending ? "Sending..." : "Send"}
                </button>
            </form>
        </div>
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
