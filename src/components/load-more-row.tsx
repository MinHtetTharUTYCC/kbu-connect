type LoadMoreRowProps = {
    ref: React.Ref<HTMLDivElement>;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    endLabel?: string;
};

export function LoadMoreRow({ ref, hasNextPage, isFetchingNextPage, endLabel = 'No more shoutouts' }: LoadMoreRowProps) {
    return (
        <div ref={ref} className="px-5 py-4 text-center text-xs text-muted-foreground">
            {isFetchingNextPage ? 'Loading more...' : hasNextPage ? '' : endLabel}
        </div>
    );
}
