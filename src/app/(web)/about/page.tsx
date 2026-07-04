import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, School, Users, Heart, MessageCircle, Megaphone, Mail } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About - KBU Connect',
    description:
        'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students. Swipe, match, and connect with your campus community.',
    openGraph: {
        title: 'About - KBU Connect',
        description:
            'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students.',
        type: 'website',
    },
};

const HOW_IT_WORKS = [
    {
        icon: Users,
        title: 'Discover',
        description: 'Browse profiles of other KBU students on the feed.',
    },
    {
        icon: Heart,
        title: 'Match',
        description: 'Swipe right to like someone. If they like you back, it is a match.',
    },
    {
        icon: MessageCircle,
        title: 'Chat',
        description: 'Start a real-time conversation with your matches.',
    },
    {
        icon: Megaphone,
        title: 'Shoutout',
        description: 'Send a message to someone before you have matched.',
    },
];

export default function AboutPage() {
    return (
        <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white px-5 pb-10 text-[#1c1b1b]">
            <header className="flex shrink-0 items-center gap-3 py-3">
                <Link
                    href="/"
                    className="-ml-2 grid size-10 place-items-center rounded-lg transition-colors hover:bg-[#f5f5f5]"
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-[18px]" />
                </Link>
                <span className="text-base font-medium">About</span>
            </header>

            <section className="flex flex-col items-center py-8 text-center">
                <div className="mb-5 grid size-[72px] place-items-center rounded-[18px] bg-primary text-white">
                    <School className="size-8" />
                </div>
                <h1 className="text-[22px] font-medium tracking-tight">KBU Connect</h1>
                <p className="mt-1.5 text-[13px] text-muted-foreground">
                    Campus community · Kasem Bundit University
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    About
                </p>
                <p className="text-sm leading-[1.75] text-[#6b6b6b]">
                    KBU Connect is a dating and social discovery platform built exclusively for
                    Kasem Bundit University students. Swipe through profiles, match with people you
                    are interested in, and start a conversation.
                </p>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    How it works
                </p>
                <div className="divide-y divide-[#f0f0f0] rounded-xl border border-[#f0f0f0]">
                    {HOW_IT_WORKS.map(({ icon: Icon, title, description }) => (
                        <div key={title} className="flex items-start gap-3.5 px-4 py-3.5">
                            <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                                <Icon className="size-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">{title}</p>
                                <p className="mt-0.5 text-[13px] leading-[1.6] text-[#6b6b6b]">
                                    {description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mb-8">
                <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                    Who can join
                </p>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#f0f0f0] px-4 py-3.5">
                    <Mail className="size-[18px] shrink-0 text-primary" />
                    <p className="text-[13px] leading-[1.6] text-[#6b6b6b]">
                        All current KBU students with a valid{' '}
                        <code className="rounded border border-[#e8e8e8] bg-[#f5f5f5] px-1.5 py-px font-mono text-[12px]">
                            @ms.kbu.ac.th
                        </code>{' '}
                        email address.
                    </p>
                </div>
            </section>

            <div className="mt-auto flex flex-col items-center gap-1 pt-8">
                <span className="text-xs text-[#a1a1a1]">Version 1.0.0</span>
                <span className="text-xs text-[#a1a1a1]">KBU Connect</span>
            </div>
        </main>
    );
}
