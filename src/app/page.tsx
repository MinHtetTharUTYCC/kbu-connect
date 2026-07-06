import { GraduationCap, Heart, Mail, Megaphone, MessageCircle, School, ShieldCheck, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopBarClient from '@/components/mobile/top-bar-client';

export const metadata: Metadata = {
    title: 'KBU Connect - Your Exclusive Campus Network',
    description:
        'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students. Swipe, match, and connect with your campus community.',
    openGraph: {
        title: 'KBU Connect - Your Exclusive Campus Network',
        description: 'KBU Connect is a dating and social discovery platform exclusively for Kasem Bundit University students.',
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
            {/* <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col overflow-y-auto bg-background px-5 pb-10 text-foreground"> */}
            <main className="bg-background px-5 pb-10 text-foreground">
                <section className="flex flex-col items-center py-8 text-center">
                    <div className="mb-5 grid size-[72px] place-items-center rounded-[18px] bg-primary text-primary-foreground">
                        <School className="size-8" />
                    </div>
                    <h1 className="text-[22px] font-medium tracking-tight">KBU Connect</h1>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">Campus community · Kasem Bundit University</p>
                </section>

                <div className="mb-8 flex flex-col gap-3">
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
                    >
                        Join the Community &rarr;
                    </Link>
                    <div className="flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
                        <ShieldCheck className="size-3.5 text-green-600" />
                        100% KBU-Mail Verified Environment
                    </div>
                </div>

                <section className="mb-8">
                    <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">About</p>
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
                                    backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80')"
                                }}
                            />
                        </div>
                        <div className="overflow-hidden rounded-2xl bg-muted">
                            <div
                                className="h-[120px] bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80')"
                                }}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-background p-4">
                            <GraduationCap className="mb-1 size-8 text-primary" />
                            <span className="text-lg font-bold">5,000+</span>
                            <span className="text-[11px] text-muted-foreground">Active Students</span>
                        </div>
                    </div>
                </section>

                <section className="mb-8">
                    <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">How it works</p>
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
                    <p className="mb-3 text-[13px] font-medium uppercase tracking-[0.06em] text-muted-foreground">Who can join</p>
                    <div className="flex items-center gap-2.5 rounded-xl border border-border px-4 py-3.5">
                        <Mail className="size-[18px] shrink-0 text-primary" />
                        <p className="text-[13px] leading-[1.6] text-muted-foreground">
                            All current KBU students with a valid{' '}
                            <code className="rounded border border-border bg-muted px-1.5 py-px font-mono text-[12px]">@ms.kbu.ac.th</code>{' '}
                            email address.
                        </p>
                    </div>
                </section>

                <div className="mt-auto flex flex-col items-center gap-3 pt-8">
                    <span className="text-xs text-muted-foreground">Version 1.0.0</span>
                    <span className="text-xs text-muted-foreground">KBU Connect</span>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy-policy" className="text-[12px] text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-muted-foreground">.</span>
                        <Link
                            href="/terms-and-conditions"
                            className="text-[12px] text-muted-foreground hover:text-primary transition-colors"
                        >
                            Terms & Conditions
                        </Link>
                    </div>
                </div>
            </main>
        </>
    );
}
