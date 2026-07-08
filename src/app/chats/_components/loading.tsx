import { Skeleton } from '@/components/ui/skeleton';

export default function ItemsLoading({ className = 'h-16' }: { className?: string }) {
    return (
        <main className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="space-y-2">
                {Array.from({ length: 6 }).map((_i, idx) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: <>
                    <Skeleton key={idx} className={className} />
                ))}
            </div>
        </main>
    );
}
