'use client';

import Link from 'next/link';
import { Avatar } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useMatchesList } from '@/hooks/matches/use-matches-list';

export function MatchesClient() {
    const { matches, isLoading: matchesLoading } = useMatchesList({});

    useTopBar({ title: 'Matches' });

    return (
        <main className="flex-1 overflow-y-auto pb-5">
            <section className="bg-white py-2">
                <div className="mb-4 flex items-end justify-between px-5">
                    <h1 className="text-xl font-semibold">Matches</h1>
                </div>
                <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {matchesLoading ? (
                        <p className="py-4 text-sm text-muted-foreground">Loading matches...</p>
                    ) : matches.length ? (
                        matches.map((match, idx) => {
                            const content = (
                                <div key={`${match.id}-${idx}`} className="flex min-w-16 flex-col items-center gap-2 active:scale-95">
                                    <div className="relative">
                                        <Avatar src={match.matcher.avatarUrl} name={match.matcher.name} className="size-14" />
                                        {match.isNew && (
                                            <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-primary" />
                                        )}
                                    </div>
                                    <span className="max-w-16 truncate text-xs font-medium">{match.matcher.name.split(' ')[0]}</span>
                                </div>
                            );

                            return match.conversationId ? (
                                <Link key={match.id} href={`/chats/${match.conversationId}`}>
                                    {content}
                                </Link>
                            ) : (
                                <div key={match.id}>{content}</div>
                            );
                        })
                    ) : (
                        <p className="w-full px-5 py-10 text-center text-sm text-muted-foreground">
                            No matches yet. When someone likes you back, they will show here.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
