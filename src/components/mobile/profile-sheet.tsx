'use client';

import {
    Cake,
    Flag,
    GraduationCap,
    Heart,
    LoaderCircle,
    type LucideIcon,
    MessageCircle,
    UserRound,
    X,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Chip } from '@/components/mobile/app-chrome';
import { FullScreenImageViewer } from '@/components/mobile/full-screen-image-viewer';
import { useVisitProfile } from '@/hooks/users/use-visit-profile';
import { ageFromBirthYear, formatEnum } from '@/lib/utils';

export function ProfileSheet({
    userId,
    onClose,
    onLike,
    onDislike,
    onShoutout,
    onMessage,
    from,
}: {
    userId: string;
    onClose: () => void;
    onLike?: () => void;
    onDislike?: () => void;
    onShoutout?: () => void;
    onMessage?: () => void;
    from: 'discovery' | 'visit';
}) {
    const { data: profile, isLoading } = useVisitProfile(userId);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const galleryImages = (profile?.gallery ?? [])
        .toSorted((a, b) => a.order - b.order)
        .map((item) => item.imageUrl);

    const age = profile?.birthYear ? ageFromBirthYear(profile.birthYear) : null;

    const metadataItems = profile
        ? [
              profile.gender && {
                  icon: UserRound,
                  label: formatEnum(profile.gender),
              },
              age && { icon: Cake, label: String(age) },
              profile.faculty && {
                  icon: GraduationCap,
                  label: formatEnum(profile.faculty),
              },
              profile.nationality && {
                  icon: Flag,
                  label: formatEnum(profile.nationality),
              },
          ].filter((item): item is ProfileMetaItem => Boolean(item))
        : [];

    return (
        <div
            className="fixed inset-0 z-70 flex items-end justify-center bg-black/35"
            onClick={onClose}
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
        >
            <div
                className="flex max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Profile"
            >
                <div className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-3">
                    <h2 className="text-base font-semibold">
                        {profile?.name ?? 'Profile'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 place-items-center rounded-full bg-muted text-muted-foreground"
                        aria-label="Close profile"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <LoaderCircle className="size-6 animate-spin text-primary" />
                        </div>
                    ) : !profile ? (
                        <p className="py-16 text-center text-sm text-muted-foreground">
                            Profile unavailable.
                        </p>
                    ) : (
                        <>
                            <section className="bg-white px-5 pb-5 pt-5">
                                <div className="flex items-center gap-4">
                                    {profile.avatarUrl ? (
                                        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                                            <Image
                                                src={profile.avatarUrl}
                                                alt={profile.name}
                                                fill
                                                sizes="64px"
                                                unoptimized
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="grid size-16 shrink-0 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                                            {profile.name?.[0]}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h1 className="truncate text-xl font-bold">
                                                {profile.name}
                                            </h1>
                                            {profile.isMatched && (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                    <Heart className="size-3 fill-primary" />
                                                    Matched
                                                </span>
                                            )}
                                        </div>
                                        {metadataItems.length > 0 ? (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {metadataItems.map((item) => (
                                                    <ProfileMetaChip
                                                        key={item.label}
                                                        item={item}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                KBU student
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {profile.bio && (
                                    <p className="mt-4 text-sm leading-6 text-foreground">
                                        {profile.bio}
                                    </p>
                                )}
                            </section>

                            {galleryImages.length > 0 && (
                                <section className="bg-white px-5 py-4">
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Photos
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {galleryImages.map(
                                            (imageUrl, index) => (
                                                <button
                                                    key={`${imageUrl}-${index}`} //TODO: can remove idex cuz index is tempo fix for development
                                                    type="button"
                                                    onClick={() =>
                                                        setViewerIndex(index)
                                                    }
                                                    className={
                                                        index === 0
                                                            ? 'relative col-span-2 aspect-square overflow-hidden rounded-lg bg-muted'
                                                            : 'relative aspect-square overflow-hidden rounded-lg bg-muted'
                                                    }
                                                >
                                                    <Image
                                                        src={imageUrl}
                                                        alt={`Photo ${index + 1}`}
                                                        fill
                                                        sizes="(max-width: 430px) 33vw, 140px"
                                                        unoptimized
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ),
                                        )}
                                    </div>
                                </section>
                            )}

                            {profile.interests &&
                                profile.interests.length > 0 && (
                                    <section className="bg-white px-5 py-4">
                                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                            Interests
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests.map(
                                                (interest) => (
                                                    <Chip key={interest}>
                                                        {formatEnum(interest)}
                                                    </Chip>
                                                ),
                                            )}
                                        </div>
                                    </section>
                                )}
                        </>
                    )}
                </div>

                {!isLoading && profile && (
                    <div className="flex shrink-0 items-center justify-center gap-6 border-t border-black/10 px-5 py-4">
                        {from === 'discovery' && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onDislike?.();
                                        onClose();
                                    }}
                                    className="grid size-12 place-items-center rounded-full border border-black/10 bg-white text-muted-foreground shadow-sm transition active:scale-90"
                                    aria-label="Pass"
                                >
                                    <X className="size-6" />
                                </button>
                                {profile.isMatched && onMessage ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onMessage();
                                            onClose();
                                        }}
                                        className="grid size-12 place-items-center rounded-full border border-black/10 bg-primary text-white shadow-sm transition active:scale-90"
                                        aria-label="Message"
                                    >
                                        <MessageCircle className="size-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onShoutout?.();
                                            onClose();
                                        }}
                                        className="grid size-12 place-items-center rounded-full border border-black/10 bg-white text-primary shadow-sm transition active:scale-90"
                                        aria-label="Send shoutout"
                                    >
                                        <MessageCircle className="size-5" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        onLike?.();
                                        onClose();
                                    }}
                                    className="grid size-12 place-items-center rounded-full border border-black/10 bg-white text-primary shadow-sm transition active:scale-90"
                                    aria-label="Like"
                                >
                                    <Heart className="size-6 fill-primary" />
                                </button>
                            </>
                        )}
                        {from === 'visit' && profile.isMatched && onMessage && (
                            <button
                                type="button"
                                onClick={() => {
                                    onMessage();
                                    onClose();
                                }}
                                className="grid size-12 place-items-center rounded-full border border-black/10 bg-primary text-white shadow-sm transition active:scale-90"
                                aria-label="Message"
                            >
                                <MessageCircle className="size-5" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {viewerIndex !== null && galleryImages.length > 0 && (
                <FullScreenImageViewer
                    images={galleryImages}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}
        </div>
    );
}

type ProfileMetaItem = {
    icon: LucideIcon;
    label: string;
};

function ProfileMetaChip({ item }: { item: ProfileMetaItem }) {
    const Icon = item.icon;

    return (
        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-black/10 bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            <Icon className="size-3 shrink-0 text-primary" />
            <span className="truncate">{item.label}</span>
        </span>
    );
}
