'use client';

import {
    Cake,
    Flag,
    GraduationCap,
    type LucideIcon,
    UserRound,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, Chip, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useMe } from '@/hooks/users/use-me';
import { useVisitProfile } from '@/hooks/users/use-visit-profile';
import { ageFromBirthYear, formatEnum } from '@/lib/profile-utils';

export function ProfileClient({ userId }: { userId: string }) {
    const router = useRouter();

    const { data: me, isLoading: meLoading } = useMe();

    const myId = me?.user?.id;
    const isOwnProfile = Boolean(myId && myId === userId);

    const { data: profile, isLoading } = useVisitProfile(userId, {
        enabled: !meLoading && !isOwnProfile,
    });

    useTopBar({
        title: profile?.name ?? 'Profile',
        backHref: '/matches',
    });

    useEffect(() => {
        if (isOwnProfile) {
            router.replace('/profile/me');
        }
    }, [isOwnProfile, router]);

    if (isOwnProfile || isLoading) {
        return (
            <EmptyState title="Loading profile" body="Opening this profile." />
        );
    }

    if (!profile) {
        return (
            <EmptyState
                title="Profile unavailable"
                body="This profile may have been removed or is no longer available."
            />
        );
    }

    const {
        birthYear,
        bio,
        faculty,
        gender,
        nationality,
        avatarUrl,
        gallery,
        interests,
    } = profile;

    const age = ageFromBirthYear(birthYear);
    const primaryImage = gallery[0]?.imageUrl ?? avatarUrl;

    const metadataItems = [
        gender && { icon: UserRound, label: formatEnum(gender) },
        age && { icon: Cake, label: String(age) },
        faculty && { icon: GraduationCap, label: formatEnum(faculty) },
        nationality && { icon: Flag, label: formatEnum(nationality) },
    ].filter((item): item is ProfileMetaItem => Boolean(item));

    return (
        <main className="flex-1 overflow-y-auto bg-[#fcf8f8] pb-8">
            <section className="bg-white px-5 pb-5 pt-6">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={avatarUrl}
                        name={profile.name}
                        className="size-20"
                    />
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-2xl font-bold">
                            {profile.name}
                        </h1>
                        {metadataItems.length > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {metadataItems.map((item) => (
                                    <ProfileMetaChip
                                        key={item.label}
                                        item={item}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="mt-1 text-sm text-[#6b6b6b]">
                                KBU student
                            </p>
                        )}
                    </div>
                </div>

                {bio && (
                    <p className="mt-5 text-sm leading-6 text-[#434655]">
                        {bio}
                    </p>
                )}
            </section>

            <ProfileSection title="Photos">
                {gallery.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                        {gallery.map((item, index) => (
                            <div
                                key={item.id}
                                className={
                                    index === 0
                                        ? 'relative col-span-2 aspect-square overflow-hidden rounded-lg bg-[#f0eeee]'
                                        : 'relative aspect-square overflow-hidden rounded-lg bg-[#f0eeee]'
                                }
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={`${profile.name} photo ${index + 1}`}
                                    fill
                                    sizes="(max-width: 430px) 33vw, 140px"
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                ) : primaryImage ? (
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#f0eeee]">
                        <Image
                            src={primaryImage}
                            alt={`${profile.name} profile photo`}
                            fill
                            sizes="390px"
                            unoptimized
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-[#6b6b6b]">No photos yet.</p>
                )}
            </ProfileSection>

            {interests.length > 0 && (
                <ProfileSection title="Interests">
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <Chip key={interest}>{formatEnum(interest)}</Chip>
                        ))}
                    </div>
                </ProfileSection>
            )}
        </main>
    );
}

type ProfileMetaItem = {
    icon: LucideIcon;
    label: string;
};

function ProfileMetaChip({ item }: { item: ProfileMetaItem }) {
    const Icon = item.icon;

    return (
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-black/10 bg-[#f9f9f8] px-2.5 py-1 text-xs font-medium text-[#434655]">
            <Icon className="size-3.5 shrink-0 text-primary" />
            <span className="truncate">{item.label}</span>
        </span>
    );
}

function ProfileSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mt-3 bg-white px-5 py-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#6b6b6b]">
                {title}
            </h2>
            {children}
        </section>
    );
}
