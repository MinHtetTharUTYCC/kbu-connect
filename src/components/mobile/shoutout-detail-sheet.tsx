'use client';

import { Send, Trash, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Avatar } from '@/components/mobile/app-chrome';
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

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleReply = () => {
        if (message.trim()) {
            onReply(message);
            setMessage('');
        }
    };

    return (
        <div
            className="fixed inset-0 z-70 flex items-end justify-center bg-black/35"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-[430px] flex-col gap-4 rounded-t-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Shoutout details"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">
                        {isReceived ? 'Received shoutout' : 'Sent shoutout'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => onProfileClick(shoutout.otherUser.id)}
                    className="flex items-center gap-3 text-left"
                >
                    <Avatar
                        src={shoutout.otherUser.avatarUrl}
                        name={shoutout.otherUser.name}
                        className="size-12"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
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

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
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
            </div>
        </div>
    );
}
