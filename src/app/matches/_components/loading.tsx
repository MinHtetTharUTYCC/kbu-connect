import { Skeleton } from '@/components/ui/skeleton';

export default function MatchesLoading() {
    return (
        <main className="flex-1 overflow-y-auto p-3 space-y-3">
            <div className="flex items-center flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_i, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <>
                    <Skeleton key={idx} className="h-16 w-16 rounded-full" />
                ))}
            </div>
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_i, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <>
                    <Skeleton key={idx} className="h-16" />
                ))}
            </div>
        </main>
    );
}
