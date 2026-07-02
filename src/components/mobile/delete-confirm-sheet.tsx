'use client';

import { Trash, X } from 'lucide-react';
import { useEffect } from 'react';

export function DeleteConfirmSheet({
    title,
    message,
    onConfirm,
    onClose,
    isPending,
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    isPending: boolean;
}) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-70 flex items-end justify-center bg-black/35"
            onClick={onClose}
        >
            <div
                className="flex w-full max-w-[430px] flex-col gap-4 rounded-t-2xl bg-white p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-label="Confirm delete"
            >
                <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-semibold">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-2 grid size-9 shrink-0 place-items-center rounded-full bg-[#f9f9f8] text-[#6b6b6b]"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <p className="text-sm leading-5 text-[#6b6b6b]">{message}</p>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        className="flex-1 rounded-lg border border-black/10 py-2 text-sm font-semibold text-[#6b6b6b] hover:bg-[#f9f9f8] disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isPending}
                        className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                    >
                        <Trash className="size-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
