import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
    title: 'About - KBU Connect',
    description:
        'KBU Connect is a dating and social discovery platform exclusively for Kasetsart University students. Swipe, match, and connect with your campus community.',
    openGraph: {
        title: 'About - KBU Connect',
        description:
            'KBU Connect is a dating and social discovery platform exclusively for Kasetsart University students.',
        type: 'website',
    },
};

export default function AboutPage() {
    return (
        <main className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col bg-white px-5 pb-10 text-[#1c1b1b]">
            <header className="flex shrink-0 items-center gap-3 py-3">
                <Link
                    href="/"
                    className="-ml-2 grid size-10 place-items-center"
                    aria-label="Go back"
                >
                    <ArrowLeft className="size-4" />
                </Link>
                <h1 className="text-lg font-semibold">About</h1>
            </header>

            <section className="mb-10 flex flex-col items-center text-center">
                <div className="mb-6 grid size-20 place-items-center rounded-xl bg-primary text-white shadow-sm">
                    <GraduationCap className="size-10" />
                </div>
                <h2 className="text-2xl font-bold tracking-normal">
                    KBU Connect
                </h2>
                <p className="mt-2 text-sm text-[#6b6b6b]">
                    Connect with your campus community
                </p>
            </section>

            <section className="mb-8">
                <h3 className="mb-2 text-sm font-semibold">What is KBU Connect?</h3>
                <p className="text-sm leading-6 text-[#434655]">
                    KBU Connect is a dating and social discovery platform built
                    exclusively for Kasetsart University students. Swipe through
                    profiles, match with people you are interested in, and start
                    a conversation.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="mb-2 text-sm font-semibold">How it works</h3>
                <ul className="space-y-3 text-sm leading-6 text-[#434655]">
                    <li>
                        <span className="font-medium">Discover</span> - Browse
                        profiles of other KBU students on the feed.
                    </li>
                    <li>
                        <span className="font-medium">Match</span> - Swipe right
                        to like someone. If they like you back, it is a match!
                    </li>
                    <li>
                        <span className="font-medium">Chat</span> - Start a
                        conversation with your matches in real time.
                    </li>
                    <li>
                        <span className="font-medium">Shoutout</span> - Send a
                        message to someone you have not matched with yet.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="mb-2 text-sm font-semibold">Who can use it?</h3>
                <p className="text-sm leading-6 text-[#434655]">
                    KBU Connect is open to all current Kasetsart University
                    students. You need a valid @ms.kbu.ac.th email address to
                    sign up.
                </p>
            </section>

            <div className="mt-auto flex flex-col items-center py-8 text-xs text-[#a1a1a1]">
                <span>Version 1.0.0</span>
                <span className="mt-1">KBU Connect</span>
            </div>
        </main>
    );
}
