'use client';

import type { MatchItemDto } from '@services/model';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ProfileSheet } from './mobile/profile-sheet';

export function MatchCelebration() {
    const router = useRouter();

    const [match, setMatch] = useState<MatchItemDto | null>(null);
    const [profileSheetId, setProfileSheetId] = useState<string | null>(null);

    useEffect(() => {
        function handleNewMatch(e: CustomEvent<MatchItemDto>) {
            const newMatch = e.detail;
            setMatch(newMatch);
        }

        window.addEventListener('new-match', handleNewMatch as EventListener);
        return () => window.removeEventListener('new-match', handleNewMatch as EventListener);
    }, []);

    if (!match) return null;

    if (profileSheetId) {
        return createPortal(<ProfileSheet userId={profileSheetId} onClose={() => setProfileSheetId(null)} from={'visit'} />, document.body);
    }

    return createPortal(
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70"
            onClick={() => setMatch(null)}
            onKeyDown={(e) => {
                if (e.key === 'Escape') setMatch(null);
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Match celebration"
        >
            <div
                className="mx-8 flex flex-col items-center gap-6 rounded-3xl bg-primary p-10 text-center text-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="document"
            >
                <h1 className="text-3xl font-bold tracking-tight">It&apos;s a Match!</h1>

                {match.matcher.avatarUrl ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white">
                        <Image src={match.matcher.avatarUrl} alt={match.matcher.name} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white/20 text-5xl">
                        {match.matcher.name.charAt(0)}
                    </div>
                )}

                <p className="text-lg">
                    You and <span className="font-semibold">{match.matcher.name}</span> matched!
                </p>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            setProfileSheetId(match.matcher.id);
                        }}
                        className="rounded-full border border-white/50 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
                    >
                        View Profile
                    </button>
                    {match.conversationId && (
                        <button
                            type="button"
                            onClick={() => {
                                setMatch(null);
                                router.push(`/chats/${match.conversationId}`);
                            }}
                            className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                        >
                            Send Message
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
