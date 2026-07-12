'use client';

import type { DiscoveryUserItemDto } from '@services/model';
import {
    Cake,
    Flag,
    Globe,
    GraduationCap,
    Heart,
    LoaderCircle,
    type LucideIcon,
    Megaphone,
    MessageCircle,
    Search,
    UserRound,
    X
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { Chip } from '@/components/mobile/app-chrome';
import { FullScreenImageViewer } from '@/components/mobile/full-screen-image-viewer';
import { ReportDialog } from '@/components/report-dialog';
import { Drawer, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { useReportUser } from '@/hooks/reports/use-report-user';
import { useUserStatus } from '@/hooks/use-user-status';
import { useVisitProfile } from '@/hooks/users/use-visit-profile';
import { ageFromBirthYear, formatEnum } from '@/lib/utils';
import { useSocketContext } from '@/components/socket-provider';

export function ProfileSheet({
    userId,
    initialProfile,
    onClose,
    onLike,
    onDislike,
    onShoutout,
    from
}: {
    userId: string;
    initialProfile?: DiscoveryUserItemDto;
    onClose: () => void;
    onLike?: () => void;
    onDislike?: () => void;
    onShoutout?: () => void;
    from: 'discovery' | 'visit';
}) {
    const router = useRouter();

    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [showReportConfirm, setShowReportConfirm] = useState(false);

    const { data: fetchedProfile, isLoading } = useVisitProfile(userId);
    const { mutateAsync: reportUser, isPending: isReporting } = useReportUser();
    const { socket } = useSocketContext();
    const { getOnlineStatus } = useUserStatus(socket);

    const profile = fetchedProfile ?? (initialProfile as unknown as typeof fetchedProfile);

    const galleryImages = (profile?.gallery ?? []).toSorted((a, b) => a.order - b.order).map((item) => item.imageUrl);

    const age = profile?.birthYear ? ageFromBirthYear(profile.birthYear) : null;

    const metadataItems = profile
        ? [
              profile.gender && {
                  icon: UserRound,
                  label: formatEnum(profile.gender)
              },
              age && { icon: Cake, label: String(age) },
              profile.faculty && {
                  icon: GraduationCap,
                  label: formatEnum(profile.faculty)
              },
              profile.nationality && {
                  icon: Globe,
                  label: formatEnum(profile.nationality)
              },
              profile.lookingFor && {
                  icon: Search,
                  label: `Looking for: ${formatEnum(profile.lookingFor)}`
              }
          ].filter((item): item is ProfileMetaItem => Boolean(item))
        : [];

    return (
        <Drawer open={!!userId} onOpenChange={(open) => !open && viewerIndex === null && onClose()}>
            <DrawerContent
                aria-describedby={undefined}
                className="mx-auto max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-xl"
            >
                <VisuallyHidden.Root>
                    <DrawerTitle>Profile</DrawerTitle>
                </VisuallyHidden.Root>

                <div className="flex-1 overflow-y-auto">
                    {isLoading && !profile ? (
                        <div className="flex items-center justify-center py-16">
                            <LoaderCircle className="size-6 animate-spin text-primary" />
                        </div>
                    ) : !profile ? (
                        <p className="py-16 text-center text-sm text-muted-foreground">Profile unavailable.</p>
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
                                            <h1 className="truncate text-xl font-bold">{profile.name}</h1>
                                            {profile.isMatched && (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                                    <Heart className="size-3 fill-primary" />
                                                    Matched
                                                </span>
                                            )}
                                            {getOnlineStatus(userId) && (
                                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                                                    <span className="size-1.5 rounded-full bg-green-500" />
                                                    Online
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setShowReportConfirm(true)}
                                                className="shrink-0 text-muted-foreground transition hover:text-destructive"
                                                aria-label="Report user"
                                            >
                                                <Flag className="size-4" />
                                            </button>
                                        </div>
                                        {metadataItems.length > 0 ? (
                                            <div className="mt-2 flex flex-wrap gap-1.5">
                                                {metadataItems.map((item) => (
                                                    <ProfileMetaChip key={item.label} item={item} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">KBU student</p>
                                        )}
                                    </div>
                                </div>

                                {profile.bio && <p className="mt-4 text-sm leading-6 text-foreground">{profile.bio}</p>}
                            </section>

                            {galleryImages.length > 0 && (
                                <section className="bg-white px-5 py-4">
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Photos</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {galleryImages.map((imageUrl, index) => (
                                            <button
                                                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                                                key={`${imageUrl}-${index}`}
                                                type="button"
                                                onClick={() => setViewerIndex(index)}
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
                                        ))}
                                    </div>
                                </section>
                            )}

                            {profile.interests && profile.interests.length > 0 && (
                                <section className="bg-white px-5 py-4">
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.interests.map((interest) => (
                                            <Chip key={interest}>{formatEnum(interest)}</Chip>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </div>

                {/* Footer Interaction Controls */}
                {profile && (
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
                                {!profile.isMatched && onShoutout && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onShoutout?.();
                                            onClose();
                                        }}
                                        className="grid size-12 place-items-center rounded-full border border-black/10 bg-white text-primary shadow-sm transition active:scale-90"
                                        aria-label="Send shoutout"
                                    >
                                        <Megaphone className="size-5" />
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
                        {from === 'visit' && (profile.isMatched || !!profile.conversationId) && (
                            <button
                                type="button"
                                onClick={() => {
                                    router.push(`/chats/${profile.conversationId}`);
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
            </DrawerContent>

            {/* Floating Image Viewer portal completely decoupled from drawer layouts */}
            {viewerIndex !== null &&
                galleryImages.length > 0 &&
                createPortal(
                    <FullScreenImageViewer images={galleryImages} initialIndex={viewerIndex} onClose={() => setViewerIndex(null)} />,
                    document.body
                )}

            {profile && (
                <ReportDialog
                    open={showReportConfirm}
                    onOpenChange={setShowReportConfirm}
                    userName={profile.name}
                    isPending={isReporting}
                    onSubmit={async (reason, description) => {
                        await reportUser(
                            {
                                data: {
                                    reportedId: userId,
                                    reason,
                                    description
                                }
                            },
                            {
                                onSuccess: () => {
                                    setShowReportConfirm(false);
                                    toast.success('Report submitted');
                                }
                            }
                        );
                    }}
                />
            )}
        </Drawer>
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
