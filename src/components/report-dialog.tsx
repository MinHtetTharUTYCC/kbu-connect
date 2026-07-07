'use client';

import { CreateReportDtoReason } from '@services/model';
import { useEffect, useState } from 'react';
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
import { Label } from '@/components/ui/label';

const reasonLabels: Record<string, string> = {
    INAPPROPRIATE_BEHAVIOR: 'Inappropriate Behavior',
    FAKE_PROFILE: 'Fake Profile',
    SCAM: 'Scam',
    HARASSMENT: 'Harassment',
    OTHER: 'Other'
};

export function ReportDialog({
    open,
    onOpenChange,
    onSubmit,
    isPending,
    userName
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (reason: CreateReportDtoReason, description?: string) => void;
    isPending: boolean;
    userName: string;
}) {
    const [reason, setReason] = useState<CreateReportDtoReason>(CreateReportDtoReason.INAPPROPRIATE_BEHAVIOR);
    const [description, setDescription] = useState('');

    function handleSubmit() {
        onSubmit(reason, description.trim() || undefined);
    }

    useEffect(() => {
        if (!open) {
            setReason(CreateReportDtoReason.INAPPROPRIATE_BEHAVIOR);
            setDescription('');
        }
    }, [open]);

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Report {userName}</AlertDialogTitle>
                    <AlertDialogDescription>Select a reason and provide details about the issue.</AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Reason</Label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value as CreateReportDtoReason)}
                            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm"
                        >
                            {Object.entries(reasonLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Additional details (optional)</Label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe the issue..."
                            maxLength={1000}
                            rows={3}
                            className="w-full resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-primary"
                        />
                        <p className="text-xs text-muted-foreground">{description.length} / 1000</p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isPending} onClick={handleSubmit}>
                        Submit Report
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
