"use client";

import { LogOut, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar } from "@/components/mobile/app-chrome";
import { FullScreenImageViewer } from "@/components/mobile/full-screen-image-viewer";
import { useTopBar } from "@/components/mobile/top-bar-provider";
import { useToggleDiscoverable } from "@/hooks/profile/use-toggle-discoverable";
import { ageFromBirthYear, formatEnum } from "@/lib/profile-utils";
import { useAuthStore } from "@/stores/auth-store";

export function MyProfileClient() {
    const { user } = useAuthContext();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const toggleDiscoverable = useToggleDiscoverable();
    const profile = user?.user;

    const dummyDiscoverable = false; // TODO: Replace with actual discoverable state from user profile
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);

    const galleryImages = (profile?.gallery ?? [])
        .toSorted((a, b) => a.order - b.order)
        .map((item) => item.imageUrl);

    useTopBar({});

    return (
        <main className="flex-1 overflow-y-auto pb-8">
            <section className="flex flex-col items-center px-5 pb-6 pt-8 text-center">
                <div className="relative mb-4">
                    <Avatar
                        src={profile?.avatarUrl as string | null}
                        name={profile?.name}
                        className="size-24"
                    />
                    <Link
                        href="/profile-setup"
                        className="absolute bottom-0 right-0 grid size-8 place-items-center rounded-full border-2 border-white bg-primary text-white shadow-sm"
                        aria-label="Edit profile"
                    >
                        <Pencil className="size-4" />
                    </Link>
                </div>
                <h1 className="text-xl font-semibold">
                    {profile?.name ?? "KBU Student"}
                </h1>
                <p className="mt-1 max-w-[300px] text-sm leading-6 text-[#6b6b6b]">
                    {profile?.faculty
                        ? `${formatEnum(profile.faculty as string)} student`
                        : "KBU student"}
                    {profile?.birthYear
                        ? ` • ${ageFromBirthYear(Number(profile.birthYear))}`
                        : ""}
                    {profile?.bio ? ` • ${profile.bio}` : ""}
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
                                        ? "relative col-span-2 aspect-square overflow-hidden rounded-lg bg-[#f0eeee]"
                                        : "relative aspect-square overflow-hidden rounded-lg bg-[#f0eeee]"
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
                            <p className="mt-0.5 text-xs leading-5 text-[#6b6b6b]">
                                {dummyDiscoverable
                                    ? "Your profile is visible to others on the feed."
                                    : "Your profile is hidden from the feed."}
                            </p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={dummyDiscoverable}
                            onClick={() =>
                                toggleDiscoverable.mutate({
                                    data: {
                                        isDiscoverable: !dummyDiscoverable,
                                    },
                                })
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                                dummyDiscoverable
                                    ? "bg-primary"
                                    : "bg-[#e5e2e1]"
                            }`}
                        >
                            <span
                                className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                                    dummyDiscoverable
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Account">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <span className="text-sm">Email address</span>
                    <span className="max-w-[190px] truncate text-sm text-[#6b6b6b]">
                        {profile?.email ?? "student@ms.kbu.ac.th"}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        logout();
                        router.replace("/login");
                    }}
                    className="flex w-full items-center justify-between px-5 py-4 text-left text-primary active:bg-[#fff1ed]"
                >
                    <span className="text-sm">Logout</span>
                    <LogOut className="size-5 opacity-70" />
                </button>
            </SettingsSection>

            <div className="flex flex-col items-center py-8 text-xs text-[#a1a1a1]">
                <span>Version 1.0.0</span>
                <span className="mt-1">KBU Connect</span>
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
            <h2 className="mb-2 px-5 text-xs font-semibold uppercase tracking-wide text-[#6b6b6b]">
                {title}
            </h2>
            <div className="border-y border-black/10 bg-white">{children}</div>
        </section>
    );
}
