'use client';

import Link from 'next/link';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import Skeleton from '@/components/skeleton';
import { useMatchesList } from '@/hooks/matches/use-matches-list';

export function MatchesClient() {
    const { matches, isLoading } = useMatchesList({});

    useTopBar({ title: 'Matches' });

    return (
        <main className="flex-1 overflow-y-auto pb-5">
            <section className="bg-white py-2">
                <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
                    {isLoading ? (
                        <Skeleton />
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
                        <EmptyState title="No matches yet" body="Matches will show here when you have them." icon="users" />
                    )}
                </div>
            </section>
        </main>
    );
}
