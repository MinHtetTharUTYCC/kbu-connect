export default function Skeleton({ length, height, space }: { length?: number; height?: number; space?: number }) {
    return (
        <div className={`space-y-${space || 2}`}>
            {Array.from({ length: length || 6 }).map((_, idx) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <>
                <div key={idx} className={`h-${height || 16} animate-pulse rounded-xl bg-muted`} />
            ))}
        </div>
    );
}
