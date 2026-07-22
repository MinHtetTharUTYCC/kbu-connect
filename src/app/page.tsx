import { Heart, Mail, Megaphone, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import TopBarClient from '@/components/mobile/top-bar-client';

export const metadata: Metadata = {
    title: 'KBU Connect - Exclusive Campus Network',
    description:
        'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students in Thailand. Swipe, match, and connect with your campus community.',
    openGraph: {
        title: 'KBU Connect - Exclusive Campus Network',
        description: 'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students in Thailand.',
        type: 'website'
    }
};

const HOW_IT_WORKS = [
    {
        icon: Users,
        title: 'Discover',
        description: 'Browse profiles of other KBU students on the feed.'
    },
    {
        icon: Heart,
        title: 'Match',
        description: 'Swipe right to like someone. If they like you back, it is a match.'
    },
    {
        icon: MessageCircle,
        title: 'Chat',
        description: 'Start a real-time conversation with your matches.'
    },
    {
        icon: Megaphone,
        title: 'Shoutout',
        description: 'Send a message to someone before you have matched.'
    }
];

export default function HomePage() {
    return (
        <>
            <TopBarClient title="KBU Connect" canBack={false} />
            <main className="bg-background px-5 pb-10 text-foreground">
                <section className="flex h-fit flex-col items-center py-8 text-center">
                    <div className="relative w-40 h-40 overflow-hidden">
                        <Image src="/pwa/logo.png" alt="KBU Connect" fill className="object-cover" />
                    </div>
                    <h1 className="-mt-8 text-3xl text-primary font-bold tracking-wide">KBU Connect</h1>
                    <p className="mt-1.5 text-sm text-muted-foreground">Campus Community · Kasem Bundit University</p>
                </section>

                <div className="mb-8 flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                    >
                        Join the Community &rarr;
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        100% KBU-Mail Verified Environment
                    </div>
                </div>

                <section className="mb-8">
                    <p className="mb-3 text-[13px] font-medium tracking-widest text-muted-foreground">About</p>
                    <p className="text-sm leading-[1.75] text-muted-foreground">
                        KBU Connect is a dating and social discovery platform built exclusively for Kasem Bundit University students. Swipe
                        through profiles, match with people you are interested in, and start a conversation.
                    </p>
                </section>

                <section className="mb-8">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2 overflow-hidden rounded-2xl bg-muted">
                            <div
                                className="h-[180px] bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('/images/kbu.webp')"
                                }}
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl bg-muted">
                            <div
                                className="h-[120px] bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('/images/library.webp')"
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center text-primary rounded-2xl border border-border bg-background p-4">
                            <Users className="mb-1 size-8" />
                            <span className="text-lg font-bold">5,000+</span>
                            <span className="text-[11px]">Active Students</span>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <p className="mb-3 text-[13px] font-medium tracking-widest text-muted-foreground">How it works</p>
                    <div className="divide-y divide-border rounded-xl border border-border">
                        {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
                            <div key={title} className="flex items-start gap-3.5 px-4 py-3.5">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                                    <Icon className="size-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{title}</p>
                                    <p className="mt-0.5 text-[13px] leading-[1.6] text-muted-foreground">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-8">
                    <p className="mb-3 text-[13px] font-medium tracking-widest text-muted-foreground">Who can join</p>
                    <div className="flex items-center gap-2.5 rounded-xl border border-border px-4 py-3.5">
                        <Mail className="size-[18px] shrink-0 text-primary" />
                        <p className="text-[13px] leading-[1.6] text-muted-foreground">
                            All current KBU students with a valid{' '}
                            <code className="rounded border border-border bg-muted px-1.5 py-px font-mono text-[12px]">@ms.kbu.ac.th</code>{' '}
                            email address.
                        </p>
                    </div>
                </section>

                <div className="mt-auto flex flex-col items-center gap-3 pt-8 text-xs">
                    <span className="text-muted-foreground">KBU Connect . Version 1.0.0</span>
                    <div className="flex items-center gap-4">
                        <Link href="/terms-and-conditions" className="text-primary hover:underline">
                            Terms of Service
                        </Link>
                        <span className="text-muted-foreground">.</span>
                        <Link href="/privacy-policy" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
