'use client';

import { LogOut, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { FullScreenImageViewer } from '@/components/mobile/full-screen-image-viewer';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useLogout } from '@/hooks/auth/use-logout';
import { useToggleDiscoverable } from '@/hooks/profile/use-toggle-discoverable';
import { ageFromBirthYear, formatEnum } from '@/lib/utils';

export function MyProfileClient() {
    const { user, isLoading } = useAuthContext();
    const profile = user?.user;

    const { mutate: logout } = useLogout();

    const {
        mutate: toggleDiscoverable,
        isPending: isToggleDiscoverablePending,
    } = useToggleDiscoverable();

    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    useTopBar({
        title: profile?.name ?? 'My Profile',
    });

    if (isLoading || !profile) {
        return (
            <EmptyState
                title="Loading profile"
                body="Setting up your account..."
            />
        );
    }

    const {
        avatarUrl,
        name,
        bio,
        faculty,
        birthYear,
        gallery,
        isDiscoverable,
    } = profile;
    const galleryImages = gallery.map((item) => item.imageUrl);

    return (
        <main className="flex-1 overflow-y-auto pb-8">
            <section className="flex flex-col items-center px-5 pb-6 pt-8 text-center">
                <div className="relative mb-4">
                    <Avatar src={avatarUrl} name={name} className="size-24" />
                    <Link
                        href="/profile-setup"
                        className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-2 border-white bg-primary text-white shadow-sm"
                        aria-label="Edit profile"
                    >
                        <Pencil className="size-4" />
                    </Link>
                </div>
                <h1 className="text-xl font-semibold">{name}</h1>
                <p className="mt-1 max-w-[300px] text-sm leading-6 text-muted-foreground">
                    {faculty
                        ? `${formatEnum(faculty as string)} student`
                        : 'KBU student'}
                    {birthYear ? ` • ${ageFromBirthYear(birthYear)}` : ''}
                    {bio ? ` • ${bio}` : ''}
                </p>
            </section>

            <section className="px-5 pb-6">
                <Link
                    href="/profile-setup"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-white transition active:scale-[0.99]"
                >
                    <Pencil className="size-4" />
                    Edit profile
                </Link>
            </section>

            {galleryImages.length > 0 && (
                <SettingsSection title="Photos">
                    <div className="grid grid-cols-3 gap-2 p-4">
                        {galleryImages.map((imageUrl, index) => (
                            <button
                                key={imageUrl}
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
                </SettingsSection>
            )}

            {viewerIndex !== null && (
                <FullScreenImageViewer
                    images={galleryImages}
                    initialIndex={viewerIndex}
                    onClose={() => setViewerIndex(null)}
                />
            )}

            <SettingsSection title="Privacy">
                <div className="border-b border-black/10 px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium">
                                Discoverable
                            </span>
                            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                                {isDiscoverable
                                    ? 'Your profile is visible to others on the feed.'
                                    : 'Your profile is hidden from the feed.'}
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={isDiscoverable}
                            disabled={isToggleDiscoverablePending}
                            onClick={() =>
                                toggleDiscoverable({
                                    data: {
                                        isDiscoverable: !isDiscoverable,
                                    },
                                })
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                                isDiscoverable ? 'bg-primary' : 'bg-muted'
                            }`}
                        >
                            <span
                                className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                                    isDiscoverable
                                        ? 'translate-x-6'
                                        : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Account">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <span className="text-sm">Email address</span>
                    <span className="max-w-[190px] truncate text-sm text-muted-foreground">
                        {profile?.email ?? 'student@ms.kbu.ac.th'}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => logout()}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-primary active:bg-primary/10"
                >
                    <span className="text-sm">Logout</span>
                    <LogOut className="size-5 opacity-70" />
                </button>
            </SettingsSection>

            <div className="flex flex-col items-center py-8 text-xs text-muted-foreground">
                <span className="mt-1">KBU Connect | Version 1.0.0</span>
                <Link href="/about" className="mt-2 font-medium text-primary">
                    About KBU Connect
                </Link>
                <div className="mt-2 flex gap-3">
                    <Link
                        href="/privacy-policy"
                        className="font-medium text-primary"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms-and-conditions"
                        className="font-medium text-primary"
                    >
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </main>
    );
}

function SettingsSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="mb-6">
            <h2 className="mb-2 px-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {title}
            </h2>
            <div className="border-y border-black/10 bg-white">{children}</div>
        </section>
    );
}
