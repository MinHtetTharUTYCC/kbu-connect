'use client';

import { Send, Trash, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/mobile/app-chrome';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose,
} from '@/components/ui/drawer';
import type { ShoutoutItem } from '@/hooks/chat/use-shoutouts-list';
import { getFormattedDate } from '@/lib/date/format-date';

const MAX_CHARS = 500;

export function ShoutoutDetailSheet({
    shoutout,
    onClose,
    onDelete,
    onReply,
    onProfileClick,
    isDeleting,
    isReplying,
}: {
    shoutout: ShoutoutItem;
    onClose: () => void;
    onDelete: () => void;
    onReply: (message: string) => void;
    onProfileClick: (userId: string) => void;
    isDeleting: boolean;
    isReplying: boolean;
}) {
    const [message, setMessage] = useState('');
    const isReceived = shoutout.type === 'received';

    const handleReply = () => {
        if (message.trim()) {
            onReply(message);
            setMessage('');
        }
    };

    return (
        <Drawer open={!!shoutout} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="mx-auto max-w-[430px] px-4 pb-4 gap-4 rounded-t-2xl bg-white shadow-xl">
                {/* <DrawerHeader className="flex items-center justify-between p-0">
                    <DrawerTitle className="text-base font-semibold">
                        {isReceived ? 'Received shoutout' : 'Sent shoutout'}
                    </DrawerTitle>
                </DrawerHeader> */}

                <button
                    type="button"
                    onClick={() => onProfileClick(shoutout.otherUser.id)}
                    className="flex items-center gap-3 text-left w-full"
                >
                    <Avatar
                        src={shoutout.otherUser.avatarUrl}
                        name={shoutout.otherUser.name}
                        className="size-12"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {shoutout.otherUser.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {getFormattedDate(shoutout.createdAt)}
                        </p>
                    </div>
                </button>

                <div className="rounded-lg border border-black/10 bg-muted p-3">
                    <p className="text-sm leading-5 text-foreground">
                        {shoutout.type === 'sent'
                            ? `You: ${shoutout.content}`
                            : shoutout.content}
                    </p>
                </div>

                {isReceived && (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value.slice(0, MAX_CHARS))
                            }
                            placeholder="Write your reply..."
                            className="min-h-[80px] resize-none rounded-lg border border-black/10 p-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            disabled={isReplying}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                {message.length}/{MAX_CHARS}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-around gap-2 w-full">
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 px-4 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                    >
                        <Trash className="size-4" />
                        Delete
                    </button>
                    {isReceived && (
                        <button
                            type="button"
                            onClick={handleReply}
                            disabled={!message.trim() || isReplying}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white disabled:opacity-50"
                        >
                            <Send className="size-4" />
                            Reply
                        </button>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}
