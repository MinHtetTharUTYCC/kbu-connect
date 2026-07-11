'use client';

import { getUsersControllerGetUserProfileQueryOptions } from '@services/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';
import { GraduationCap, Heart, Megaphone, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Chip, EmptyState } from '@/components/mobile/app-chrome';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { useSendShoutout } from '@/hooks/chat/use-send-shoutout';
import { useDiscoveryProfiles } from '@/hooks/discovery/use-discovery-profiles';
import { useSwipeProfile } from '@/hooks/swipes/use-swipe-profile';
import { cn, formatEnum, formatFaculty } from '@/lib/utils';
import { SendShoutoutSheet } from './send-shoutout-sheet';

const SWIPE_THRESHOLD = 80;

export function DiscoverClient() {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [isShoutoutOpen, setIsShoutoutOpen] = useState(false);
    const [shoutoutMessage, setShoutoutMessage] = useState('');
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [dragX, setDragX] = useState(0);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isDragging = useRef(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { profiles, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDiscoveryProfiles({});
    const { like, dislike, isPending: isSwipePending } = useSwipeProfile();
    const { mutateAsync: sendShoutout, isPending: isSendingShoutout } = useSendShoutout();
    const profile = profiles[index];
    const remainingProfiles = profiles.length - index;

    const queryClient = useQueryClient();

    useEffect(() => {
        if (!profile) return;
        const timer = window.setTimeout(() => {
            queryClient.prefetchQuery(
                getUsersControllerGetUserProfileQueryOptions(profile.id, {
                    query: { staleTime: 1000 * 60 * 5 }
                })
            );
        }, 3000);
        return () => clearTimeout(timer);
    }, [queryClient, profile]);

    useEffect(() => {
        if (remainingProfiles <= 3 && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, remainingProfiles]);

    const handleSwipe = useCallback(
        (type: 'LIKE' | 'DISLIKE') => {
            if (!profile || direction) return;
            setDirection(type === 'LIKE' ? 'right' : 'left');
            setDragX(0);
            setShoutoutMessage('');
            setIsShoutoutOpen(false);
            setImageIndex(0);
            if (type === 'LIKE') {
                like(profile.id);
            } else {
                dislike(profile.id);
            }
            window.setTimeout(() => {
                setIndex((value) => value + 1);
                setDirection(null);
            }, 260);
        },
        [profile, direction, like, dislike]
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
                handleSwipe('LIKE');
            } else if (dragX < -SWIPE_THRESHOLD) {
                handleSwipe('DISLIKE');
            } else {
                setDragX(0);
            }
        }
        isDragging.current = false;
    }

    async function handleSendShoutout(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!profile || !shoutoutMessage.trim()) return;

        await sendShoutout({
            data: {
                receiverId: profile.id,
                message: shoutoutMessage.trim()
            }
        });
        setShoutoutMessage('');
        setIsShoutoutOpen(false);
    }

    if (isLoading) {
        return <EmptyState title="" body="Looking for people from the campus..." icon={'search'} bounce />;
    }

    if (isFetchingNextPage) {
        return <EmptyState title="" body="Looking for more people from the campus..." icon={'search'} bounce />;
    }

    if (!profile) {
        return (
            <EmptyState
                title="No profiles available"
                body="Check back later as more students complete their profiles."
                icon={'search'}
                bounce
            />
        );
    }

    const dragRotation = dragX * 0.06;
    const dragOpacity = Math.max(0, 1 - Math.abs(dragX) / 300);
    const showLikeStamp = direction === 'right' || (!direction && dragX > SWIPE_THRESHOLD * 0.5);
    const showPassStamp = direction === 'left' || (!direction && dragX < -SWIPE_THRESHOLD * 0.5);

    return (
        <div className="flex flex-1 flex-col overflow-hidden bg-background">
            <main className="flex flex-1 flex-col overflow-hidden px-5 pb-6 pt-5">
                <section className="relative flex min-h-0 flex-1 items-center justify-center">
                    <div
                        ref={cardRef}
                        className={cn(
                            'relative flex h-full min-h-[400px] w-full max-w-full flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm',
                            !dragX && 'transition duration-300',
                            direction === 'left' && '-translate-x-24 -rotate-6 opacity-0',
                            direction === 'right' && 'translate-x-24 rotate-6 opacity-0'
                        )}
                        style={{
                            transform: direction ? undefined : `translateX(${dragX}px) rotate(${dragRotation}deg)`,
                            opacity: direction ? undefined : dragOpacity
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="relative flex-1 overflow-hidden bg-muted">
                            {profile.gallery.length > 0 ? (
                                <Image
                                    src={profile.gallery[imageIndex].imageUrl}
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

                            {profile.gallery.length > 1 && (
                                <>
                                    <div className="absolute inset-x-0 top-3 z-10 flex justify-center gap-1.5">
                                        {profile.gallery.map((image, i) => (
                                            <div
                                                key={`${image.imageUrl}-${i}`}
                                                className={`h-1 rounded-full transition-all ${i === imageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute left-0 top-0 z-10 h-full w-1/3"
                                        aria-label="Previous photo"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageIndex((prev) => (prev > 0 ? prev - 1 : profile.gallery.length - 1));
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-0 top-0 z-10 h-full w-1/3"
                                        aria-label="Next photo"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageIndex((prev) => (prev < profile.gallery.length - 1 ? prev + 1 : 0));
                                        }}
                                    />
                                </>
                            )}

                            <div className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black/50 to-transparent" />
                            {showLikeStamp && <SwipeStamp label="LIKE" className="right-8 rotate-12 border-primary text-primary" />}
                            {showPassStamp && (
                                <SwipeStamp label="PASS" className="left-8 -rotate-12 border-muted-foreground text-muted-foreground" />
                            )}
                        </div>
                        <button
                            type="button"
                            className="w-full space-y-2 px-4 py-2 text-left cursor-pointer active:opacity-70"
                            onClick={() => setSelectedProfileId(profile.id)}
                        >
                            {/* TOOD:: remove '!' */}
                            {!profile.lastSeen && (
                                <div className="w-fit flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-500 text-sm font-medium">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <p>active recently</p>
                                </div>
                            )}

                            <div className="flex items-end gap-2">
                                <span className="text-xl line-clamp-2 font-semibold">{profile.name}</span>
                                <p className="text-sm text-muted-foreground">
                                    {' | '}
                                    {formatEnum(profile.nationality)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-primary font-medium">
                                <GraduationCap className="size-4" />
                                <p className="line-clamp-1 font-semibold text-xs">{formatFaculty(profile.faculty)}</p>
                            </div>

                            <div className="flex gap-2 overflow-x-hidden pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
                                {(profile.interests ?? []).map((interest) => (
                                    <Chip key={interest}>{formatEnum(interest)}</Chip>
                                ))}
                            </div>
                        </button>
                    </div>
                </section>
                <section className="mt-4 flex shrink-0 items-center justify-center gap-8 pb-2">
                    <ActionButton label="Pass" onClick={() => handleSwipe('DISLIKE')} disabled={isSwipePending}>
                        <X className="size-7" />
                    </ActionButton>
                    <ActionButton label="Send shoutout" compact onClick={() => setIsShoutoutOpen(true)} disabled={isSendingShoutout}>
                        <Megaphone className="size-6" />
                    </ActionButton>
                    <ActionButton label="Like" onClick={() => handleSwipe('LIKE')} disabled={isSwipePending}>
                        <Heart className="size-7 fill-primary" />
                    </ActionButton>
                </section>
            </main>
            {isShoutoutOpen && (
                <SendShoutoutSheet
                    message={shoutoutMessage}
                    name={profile.name}
                    isSending={isSendingShoutout}
                    onChange={setShoutoutMessage}
                    onClose={() => {
                        setIsShoutoutOpen(false);
                        setShoutoutMessage('');
                    }}
                    onSubmit={handleSendShoutout}
                />
            )}
            {selectedProfileId && (
                <ProfileSheet
                    userId={selectedProfileId}
                    initialProfile={profile}
                    onClose={() => setSelectedProfileId(null)}
                    onLike={() => handleSwipe('LIKE')}
                    onDislike={() => handleSwipe('DISLIKE')}
                    onShoutout={() => setIsShoutoutOpen(true)}
                    from="discovery"
                />
            )}
        </div>
    );
}

function SwipeStamp({ label, className }: { label: string; className?: string }) {
    return <div className={cn('absolute top-8 z-10 rounded-xl border-4 px-4 py-1 text-xl font-bold', className)}>{label}</div>;
}

function ActionButton({
    children,
    label,
    onClick,
    disabled,
    compact = false
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
                'grid place-items-center rounded-full border border-black/10 bg-white text-primary shadow-sm transition active:scale-90 disabled:opacity-50',
                compact ? 'size-12' : 'size-14'
            )}
        >
            {children}
        </button>
    );
}
