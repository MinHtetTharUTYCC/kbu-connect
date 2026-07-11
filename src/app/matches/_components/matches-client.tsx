'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LoadMoreRow } from '@/components/load-more-row';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { useTopBar } from '@/components/mobile/top-bar-provider';
import { useMarkMatchSeen } from '@/hooks/matches/use-mark-match-seen';
import { useMatchesList } from '@/hooks/matches/use-matches-list';
import MatchesLoading from './loading';
import { MatchRow } from './match-row';

export function MatchesClient() {
    const router = useRouter();

    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { matches, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useMatchesList({});
    const { mutate: markAsSeen } = useMarkMatchSeen();

    useTopBar({ title: 'Matches' });

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target || !hasNextPage) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { rootMargin: '180px 0px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const newMatches = matches.filter((m) => m.isNew);

    if (isLoading) return <MatchesLoading />;

    if (!matches.length) {
        return (
            <main className="flex-1 overflow-y-auto pb-5">
                <EmptyState title="No matches yet" body="Matches will show here when you have them." icon="users" />
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-y-auto pb-5">
            {newMatches.length > 0 && (
                <section className="bg-white py-2">
                    <div className="flex gap-4 overflow-x-auto px-5 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
                        {newMatches.map((match, idx) => (
                            <button
                                key={`${match.id}-${idx}`}
                                type="button"
                                onClick={() => {
                                    markAsSeen({ matchId: match.id });
                                    setSelectedProfileId(match.matcher.id);
                                }}
                                className="flex min-w-16 flex-col items-center gap-2 active:scale-95"
                            >
                                <div className="relative">
                                    <Avatar src={match.matcher.avatarUrl} name={match.matcher.name} className="size-14" />
                                    <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-primary" />
                                </div>
                                <span className="max-w-16 truncate text-xs font-medium">{match.matcher.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section className="mt-2">
                {matches.map((match, idx) => (
                    <MatchRow
                        key={`${match.id}-${idx}`}
                        match={match}
                        onSelectProfile={(userId) => setSelectedProfileId(userId)}
                        onOpenChat={(chatId) => router.push(`/chats/${chatId}`)}
                    />
                ))}
                <LoadMoreRow
                    ref={loadMoreRef}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    endLabel="No more matches"
                />
            </section>

            {selectedProfileId && <ProfileSheet userId={selectedProfileId} onClose={() => setSelectedProfileId(null)} from="visit" />}
        </main>
    );
}
