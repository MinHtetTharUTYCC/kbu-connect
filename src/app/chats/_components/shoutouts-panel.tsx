'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { LoadMoreRow } from '@/components/load-more-row';
import { ActionConfirmDialog } from '@/components/mobile/action-confirm-dialog';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { ShoutoutDetailSheet } from '@/components/mobile/shoutout-detail-sheet';
import { useDeleteShoutout } from '@/hooks/chat/use-delete-shoutout';
import { useReplyShoutout } from '@/hooks/chat/use-reply-shoutout';
import { type ShoutoutItem, type ShoutoutType, useShoutoutsList } from '@/hooks/chat/use-shoutouts-list';
import { getFormattedDate } from '@/lib/date/format-date';
import { cn } from '@/lib/utils';
import ItemsLoading from './loading';

export function ShoutoutsPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const activeSubTab: ShoutoutType = searchParams.get('shoutouts') === 'sent' ? 'sent' : 'received';
    const loadMoreRef = useRef<HTMLDivElement | null>(null);
    const [selectedShoutoutId, setSelectedShoutoutId] = useState<string | null>(null);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

    const { shoutouts, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useShoutoutsList({ type: activeSubTab });
    const { mutate: replyToShoutout, isPending: isReplying } = useReplyShoutout();
    const { mutate: deleteShoutout, isPending: isDeleting } = useDeleteShoutout();

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

    return (
        <section>
            <div className="px-5 pb-4">
                <div className="flex border-b border-black/10">
                    <Link
                        href="/chats?tab=shoutouts&shoutouts=received"
                        className={cn(
                            'flex-1 border-b-2 pb-3 text-center text-sm font-medium',
                            activeSubTab === 'received' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                        )}
                    >
                        Received
                    </Link>
                    <Link
                        href="/chats?tab=shoutouts&shoutouts=sent"
                        className={cn(
                            'flex-1 border-b-2 pb-3 text-center text-sm font-medium',
                            activeSubTab === 'sent' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
                        )}
                    >
                        Sent
                    </Link>
                </div>
            </div>
            {isLoading ? (
                <ItemsLoading />
            ) : shoutouts.length ? (
                <div>
                    {shoutouts.map((item, index) => (
                        <ShoutoutRow key={`${item.id}-${index}`} shoutout={item} onClick={() => setSelectedShoutoutId(item.id)} />
                    ))}
                    <LoadMoreRow
                        ref={loadMoreRef}
                        hasNextPage={hasNextPage}
                        isFetchingNextPage={isFetchingNextPage}
                        endLabel="No More Sent Shoutouts"
                    />
                </div>
            ) : (
                <div>
                    <EmptyState
                        title={activeSubTab === 'received' ? 'No received shoutouts' : 'No sent shoutouts'}
                        body={
                            activeSubTab === 'received' ? 'Shoutouts people send you will show here.' : 'Shoutouts you send will show here.'
                        }
                        icon="shoutout"
                    />
                </div>
            )}

            <LoadMoreRow
                ref={loadMoreRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                endLabel="No More Received Shoutouts"
            />
            {selectedProfileId && (
                <ProfileSheet
                    userId={selectedProfileId}
                    onClose={() => setSelectedProfileId(null)}
                    onMessage={() => router.push(`/chats/${selectedProfileId}`)}
                    from="visit"
                />
            )}
            {selectedShoutoutId && (
                <ShoutoutDetailSheet
                    // biome-ignore lint/style/noNonNullAssertion: <>
                    shoutout={shoutouts.find((s) => s.id === selectedShoutoutId)!}
                    onClose={() => setSelectedShoutoutId(null)}
                    onDelete={() => {
                        setDeleteTargetId(selectedShoutoutId);
                        setSelectedShoutoutId(null);
                    }}
                    onProfileClick={(userId) => {
                        setSelectedShoutoutId(null);
                        setSelectedProfileId(userId);
                    }}
                    onReply={(message) =>
                        replyToShoutout(
                            {
                                // biome-ignore lint/style/noNonNullAssertion: <>
                                shoutoutId: selectedShoutoutId!,
                                data: { message }
                            },
                            {
                                onSuccess: () => {
                                    setSelectedShoutoutId(null);
                                    toast.success('Replied to shoutout.');
                                }
                            }
                        )
                    }
                    isDeleting={isDeleting}
                    isReplying={isReplying}
                />
            )}
            {deleteTargetId && (
                <ActionConfirmDialog
                    action="Delete"
                    title="Delete shoutout"
                    message="Are you sure you want to delete this shoutout? Receiver will no longer be able to see it."
                    isPending={isDeleting}
                    onClose={() => setDeleteTargetId(null)}
                    onConfirm={() =>
                        deleteShoutout(
                            { shoutoutId: deleteTargetId },
                            {
                                onSuccess: () => {
                                    setDeleteTargetId(null);
                                    toast.success('Shoutout deleted');
                                }
                            }
                        )
                    }
                />
            )}
        </section>
    );
}

function ShoutoutRow({ shoutout, onClick }: { shoutout: ShoutoutItem; onClick: () => void }) {
    return (
        <button type="button" className="block w-full border-b border-black/10 bg-white p-5 text-left active:bg-black/5" onClick={onClick}>
            <div className="flex items-start gap-3">
                <Avatar src={shoutout.otherUser.avatarUrl} name={shoutout.otherUser.name} className="size-12" />
                <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="truncate text-xs font-bold">{shoutout.otherUser.name}</span>
                        <span className="text-xs text-muted-foreground">{getFormattedDate(shoutout.createdAt)}</span>
                    </div>
                    <p className="line-clamp-1 text-sm leading-6">
                        {shoutout.type === 'sent' ? `You: ${shoutout.content}` : shoutout.content}
                    </p>
                </div>
            </div>
        </button>
    );
}
