'use client';

import type { SubmitEvent } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';

export function SendShoutoutSheet({
    name,
    message,
    isSending,
    onChange,
    onClose,
    onSubmit
}: {
    name: string;
    message: string;
    isSending: boolean;
    onChange: (value: string) => void;
    onClose: () => void;
    onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}) {
    const isOpen = !!name;

    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent aria-describedby={undefined} className="mx-auto w-full max-w-[398px]">
                <form onSubmit={onSubmit} className="rounded-t-2xl bg-white p-5 shadow-xl flex flex-col">
                    <DrawerHeader className="mb-4 flex items-start justify-between gap-4 p-0">
                        <DrawerTitle className="text-left">
                            <span className="block text-xs font-medium text-primary tracking-widest mb-0.5">Write to</span>
                            <span className="block text-lg font-semibold text-foreground">{name}</span>
                        </DrawerTitle>
                    </DrawerHeader>

                    <textarea
                        value={message}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Say something short..."
                        rows={4}
                        className="w-full resize-none rounded-xl bg-muted border border-black/10 p-3 text-sm leading-6 outline-none focus:border-primary text-foreground"
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || isSending}
                        className="mt-4 h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-50"
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </DrawerContent>
        </Drawer>
    );
}
