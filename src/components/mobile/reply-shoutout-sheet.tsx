'use client';

import { Send, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ShoutoutItem } from '@/hooks/chat/use-shoutouts-list';

const MAX_CHARS = 500;
const MIN_CHARS = 1;

export function ReplyShoutoutSheet({
    shoutout,
    onClose,
    onSubmit,
    isPending,
}: {
    shoutout: ShoutoutItem;
    onClose: () => void;
    onSubmit: (message: string) => void;
    isPending: boolean;
}) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const isValid = message.length >= MIN_CHARS && message.length <= MAX_CHARS;

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(message);
            setMessage('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-70 flex items-end justify-center bg-black/35"
            onClick={onClose}
            onKeyDown={(e) => {
                if (e.key === 'Escape') onClose();
            }}
            role="presentation"
            tabIndex={-1}
        >
            <div
                className="flex w-full max-w-[430px] flex-col gap-4 rounded-t-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Reply to shoutout"
                tabIndex={-1}
            >
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold">
                            Reply to {shoutout.otherUser.name}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-2 grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <div className="max-h-24 overflow-hidden rounded-lg border border-black/10 bg-muted">
                    <p className="p-3 text-sm leading-5 text-muted-foreground">
                        {shoutout.content}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <textarea
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value.slice(0, MAX_CHARS))
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Write your reply..."
                        className="min-h-[100px] resize-none rounded-lg border border-black/10 p-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isPending}
                    />
                    <div className="flex items-center justify-between">
                        <span
                            className={`text-xs ${
                                message.length > MAX_CHARS
                                    ? 'text-red-500'
                                    : 'text-muted-foreground'
                            }`}
                        >
                            {message.length}/{MAX_CHARS}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 rounded-lg border border-black/10 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isValid || isPending}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                        <Send className="size-4" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
