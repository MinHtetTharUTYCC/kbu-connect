'use client';

import type { MatchItemDto } from '@services/model';
import { MessageCircle } from 'lucide-react';
import { Avatar } from '@/components/mobile/app-chrome';
import { useMarkMatchSeen } from '@/hooks/matches/use-mark-match-seen';
import { getFormattedDate } from '@/lib/date/format-date';

export function MatchRow({
    match,
    onSelectProfile,
    onOpenChat
}: {
    match: MatchItemDto;
    onSelectProfile: (userId: string) => void;
    onOpenChat: (chatId: string) => void;
}) {
    const { mutate: markAsSeen } = useMarkMatchSeen();

    function handleSelect() {
        if (match.isNew) markAsSeen({ matchId: match.id });
        onSelectProfile(match.matcher.id);
    }

    function handleOpenChat(e: React.MouseEvent) {
        e.stopPropagation();
        if (match.isNew) markAsSeen({ matchId: match.id });
        if (match.conversationId) onOpenChat(match.conversationId);
    }

    return (
        <button
            type="button"
            onClick={handleSelect}
            className="flex w-full items-center border-b border-black/10 px-5 py-4 text-left active:bg-black/5"
        >
            <div className="relative shrink-0">
                <Avatar src={match.matcher.avatarUrl} name={match.matcher.name} className="size-12" />
                {match.isNew && <span className="absolute right-0 top-0 size-3 rounded-full border-2 border-white bg-primary" />}
            </div>
            <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate font-semibold">{match.matcher.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{getFormattedDate(match.matchedAt)}</span>
                </div>
                <p className="text-sm text-muted-foreground">You matched{match.isNew ? ' — new!' : ''}</p>
            </div>
            {match.conversationId && (
                // biome-ignore lint/a11y/useKeyWithClickEvents: inside <button>, keyboard handled by parent
                // biome-ignore lint/a11y/noStaticElementInteractions: inside <button>, keyboard handled by parent
                <span
                    onClick={handleOpenChat}
                    className="ml-3 grid size-10 shrink-0 place-items-center rounded-full bg-primary text-white transition active:scale-90"
                >
                    <MessageCircle className="size-5" />
                </span>
            )}
        </button>
    );
}
