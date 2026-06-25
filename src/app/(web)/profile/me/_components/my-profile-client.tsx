"use client";

import { LogOut, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/auth-provider";
import { Avatar } from "@/components/mobile/app-chrome";
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

            <SettingsSection title="Privacy">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <span className="text-sm">Discoverable</span>
                    <button
                        type="button"
                        onClick={() =>
                            toggleDiscoverable.mutate({
                                data: { isDiscoverable: true },
                            })
                        }
                        className="flex h-6 w-10 items-center rounded-full bg-primary p-1 transition active:scale-95"
                        aria-label="Toggle discoverable"
                    >
                        <span className="ml-auto size-4 rounded-full bg-white shadow-sm" />
                    </button>
                </div>
                <div className="flex items-center justify-between px-5 py-4">
                    <span className="text-sm">Push notifications</span>
                    <span className="flex h-6 w-10 items-center rounded-full bg-[#e5e2e1] p-1">
                        <span className="size-4 rounded-full bg-white shadow-sm" />
                    </span>
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
