'use client';

import { Send, X } from 'lucide-react';
import { useState } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import type { ShoutoutItem } from '@/hooks/chat/use-shoutouts-list';

const MAX_CHARS = 500;
const MIN_CHARS = 1;

export function ReplyShoutoutSheet({
    shoutout,
    onClose,
    onSubmit,
    isPending
}: {
    shoutout: ShoutoutItem;
    onClose: () => void;
    onSubmit: (message: string) => void;
    isPending: boolean;
}) {
    const [message, setMessage] = useState('');

    const isValid = message.length >= MIN_CHARS && message.length <= MAX_CHARS;

    const handleSubmit = () => {
        if (isValid) {
            onSubmit(message);
            setMessage('');
        }
    };

    return (
        <Drawer open onOpenChange={(open) => !open && onClose()}>
            <DrawerContent className="mx-auto max-w-[430px] px-5 pb-5 gap-4 rounded-t-2xl bg-white shadow-xl">
                <DrawerHeader className="flex items-center justify-between p-0">
                    <DrawerTitle className="text-base font-semibold">Reply to {shoutout.otherUser.name}</DrawerTitle>
                    <DrawerClose asChild>
                        <button
                            type="button"
                            className="ml-2 grid size-9 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
                            aria-label="Close"
                        >
                            <X className="size-5" />
                        </button>
                    </DrawerClose>
                </DrawerHeader>

                <div className="max-h-24 overflow-hidden rounded-lg border border-black/10 bg-muted">
                    <p className="p-3 text-sm leading-5 text-muted-foreground">{shoutout.content}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
                        placeholder="Write your reply..."
                        className="min-h-[100px] resize-none rounded-lg border border-black/10 p-3 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isPending}
                    />
                    <div className="flex items-center justify-between">
                        <span className={`text-xs ${message.length > MAX_CHARS ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {message.length}/{MAX_CHARS}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    <DrawerClose asChild>
                        <button
                            type="button"
                            disabled={isPending}
                            className="flex-1 rounded-lg border border-black/10 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </DrawerClose>
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
            </DrawerContent>
        </Drawer>
    );
}
