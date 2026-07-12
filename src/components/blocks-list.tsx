'use client';

import { UserX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import ItemsLoading from '@/app/chats/_components/loading';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { Button } from '@/components/ui/button';
import { useBlockedUsers } from '@/hooks/block/use-blocked-users';
import { useUnblockUser } from '@/hooks/block/use-unblock-user';
import { LoadMoreRow } from './load-more-row';
import { ActionConfirmDialog } from './mobile/action-confirm-dialog';

type UnblockTarget = {
    id: string;
    name: string;
};

export function BlocksList() {
    const [unblockTarget, setUnblockTarget] = useState<UnblockTarget | null>(null);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const { blocks, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useBlockedUsers();
    const { mutateAsync: unblockUser, isPending: isUnblocking } = useUnblockUser();

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

    return isLoading ? (
        <ItemsLoading />
    ) : blocks.length > 0 ? (
        <div className="space-y-2">
            {blocks.map((block, idx) => (
                <div
                    key={`${block.id}-${idx}`}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4"
                >
                    <div className="flex items-center gap-3">
                        <Avatar src={block.blockedUserAvatarUrl} name={block.blockedUserName} className="size-10" />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{block.blockedUserName}</p>
                            {block.reason && <p className="truncate text-xs text-muted-foreground">{block.reason}</p>}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUnblockTarget({ id: block.blockedId, name: block.blockedUserName })}
                    >
                        <UserX className="mr-1 h-4 w-4" />
                        Unblock
                    </Button>
                </div>
            ))}

            <LoadMoreRow
                ref={loadMoreRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                endLabel="No More Blocked Users"
            />

            {unblockTarget && (
                <ActionConfirmDialog
                    action="Unblock"
                    title="Unblock User"
                    message={`Are you sure you want to unblock ${unblockTarget.name}? They will be able to see your profile again.`}
                    isPending={isUnblocking}
                    onClose={() => setUnblockTarget(null)}
                    onConfirm={async () => {
                        if (unblockTarget) {
                            await unblockUser(
                                { data: { blockedId: unblockTarget.id } },
                                {
                                    onSuccess: () => {
                                        setUnblockTarget(null);
                                        toast.success('Unblocked successfully');
                                    }
                                }
                            );
                        }
                    }}
                />
            )}
        </div>
    ) : (
        <EmptyState title="No blocked users" body="You haven't blocked any users yet" icon={'users'} />
    );
}

/*
 <>
            <div className="space-y-2">
                {blocks.map((block, idx) => (
                    <div
                        key={`${block.id}-${idx}`}
                        className="flex items-center justify-between rounded-xl border border-black/10 bg-white p-4"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar src={block.blockedUserAvatarUrl} name={block.blockedUserName} className="size-10" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{block.blockedUserName}</p>
                                {block.reason && <p className="truncate text-xs text-muted-foreground">{block.reason}</p>}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setUnblockTarget({ id: block.blockedId, name: block.blockedUserName })}
                        >
                            <UserX className="mr-1 h-4 w-4" />
                            Unblock
                        </Button>
                    </div>
                ))}
            </div>

            <LoadMoreRow
                ref={loadMoreRef}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                endLabel="No More Blocked Users"
            />

            {unblockTarget && (
                <ActionConfirmDialog
                    action="Unblock"
                    title="Unblock User"
                    message={`Are you sure you want to unblock ${unblockTarget.name}? They will be able to see your profile again.`}
                    isPending={isUnblocking}
                    onClose={() => setUnblockTarget(null)}
                    onConfirm={async () => {
                        if (unblockTarget) {
                            await unblockUser(
                                { data: { blockedId: unblockTarget.id } },
                                {
                                    onSuccess: () => {
                                        setUnblockTarget(null);
                                        toast.success('Unblocked successfully');
                                    }
                                }
                            );
                        }
                    }}
                />
            )}
        </>
*/
