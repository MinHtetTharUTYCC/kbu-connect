type LoadMoreRowProps = {
    ref: React.Ref<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    endLabel: string;
};

export function LoadMoreRow({ ref, hasNextPage, isFetchingNextPage, endLabel }: LoadMoreRowProps) {
    return (
        <div ref={ref} className="px-5 py-4 text-center text-xs text-muted-foreground">
            {!hasNextPage ? (
                endLabel
            ) : isFetchingNextPage ? (
                'Loading more...'
            ) : (
                // Keep an empty space or a microscopic height so the observer can still target it
                <span className="inline-block h-1" />
            )}
        </div>
    );
}
