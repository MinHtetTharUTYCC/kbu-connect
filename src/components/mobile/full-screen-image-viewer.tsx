'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

export function FullScreenImageViewer({
    images,
    initialIndex = 0,
    onClose,
}: {
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    const goTo = useCallback(
        (index: number) => {
            setCurrentIndex(Math.max(0, Math.min(index, images.length - 1)));
        },
        [images.length],
    );

    const goPrev = useCallback(
        () => goTo(currentIndex - 1),
        [currentIndex, goTo],
    );
    const goNext = useCallback(
        () => goTo(currentIndex + 1),
        [currentIndex, goTo],
    );

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        }
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose, goPrev, goNext]);

    function handleTouchStart(e: React.TouchEvent) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    }

    function handleTouchEnd(e: React.TouchEvent) {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        const dy = e.changedTouches[0].clientY - touchStartY.current;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx > 0) goPrev();
            else goNext();
        }
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col bg-black"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex shrink-0 items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-white">
                    {currentIndex + 1} / {images.length}
                </span>
                <button
                    type="button"
                    onClick={onClose}
                    className="grid size-10 place-items-center rounded-full text-white"
                    aria-label="Close"
                >
                    <X className="size-6" />
                </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
                {images.length > 1 && currentIndex > 0 && (
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-2 z-10 grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="size-6" />
                    </button>
                )}

                <div className="relative h-full w-full max-w-[430px]">
                    <Image
                        src={images[currentIndex]}
                        alt={`Photo ${currentIndex + 1}`}
                        fill
                        sizes="100vw"
                        unoptimized
                        className="object-contain"
                        draggable={false}
                    />
                </div>

                {images.length > 1 && currentIndex < images.length - 1 && (
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-2 z-10 grid size-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm"
                        aria-label="Next image"
                    >
                        <ChevronRight className="size-6" />
                    </button>
                )}
            </div>

            {images.length > 1 && (
                <div className="flex shrink-0 justify-center gap-1.5 px-4 pb-4 pt-2">
                    {images.map((img, index) => (
                        <button
                            key={`${img}-${index}`}
                            type="button"
                            onClick={() => goTo(index)}
                            className={`size-2 rounded-full transition-colors ${
                                index === currentIndex
                                    ? 'bg-white'
                                    : 'bg-white/40'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
