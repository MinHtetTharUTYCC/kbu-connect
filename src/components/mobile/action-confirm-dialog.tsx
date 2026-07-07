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
import { cn } from '@/lib/utils';

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
    action: 'Delete' | 'Block' | 'Unblock' | 'Reset';
}) {
    return (
        <AlertDialog open onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent aria-describedby={undefined}>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className={cn(
                            'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40'
                        )}
                        disabled={isPending}
                        onClick={onConfirm}
                    >
                        {action}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
