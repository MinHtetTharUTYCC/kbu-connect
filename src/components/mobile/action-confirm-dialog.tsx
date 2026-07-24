'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';

export function ActionConfirmDialog({
    title,
    message,
    onConfirm,
    onClose,
    isPending,
    action
}: {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose: () => void;
    isPending: boolean;
    action: 'Delete' | 'Block' | 'Unblock' | 'Reset' | 'Logout';
}) {
    return (
        <AlertDialog open onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="grid grid-cols-2 gap-2">
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                        >
                            {isPending ? '...' : action}
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
