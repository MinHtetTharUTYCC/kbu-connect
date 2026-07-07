'use client';

import type { NewGalleryImageDto } from '@services/model';
import { Camera, GripVertical, LoaderCircle, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useRef } from 'react';
import { type ItemInterface, ReactSortable } from 'react-sortablejs';
import { Avatar } from '@/components/mobile/app-chrome';
import { useUploadAvatar } from '@/hooks/profile/use-upload-avatar';
import { useUploadGalleryImages } from '@/hooks/profile/use-upload-gallery-images';

type GalleryItem = NewGalleryImageDto & { id: string };

export function AvatarUploadStep({
    name,
    avatarUrl,
    onAvatarChange
}: {
    name: string;
    avatarUrl?: string;
    onAvatarChange: (avatarUrl: string) => void;
}) {
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();

    async function handleAvatarFile(file?: File) {
        if (!file) return;

        const response = await uploadAvatar(file);
        onAvatarChange(response.avatarUrl);
        if (avatarInputRef.current) {
            avatarInputRef.current.value = '';
        }
    }

    return (
        <section className="space-y-5">
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <Avatar src={avatarUrl} name={name} className="size-24" />
                    {isUploadingAvatar && (
                        <div className="absolute inset-0 grid place-items-center rounded-full bg-black/35 text-white">
                            <LoaderCircle className="size-6 animate-spin" />
                        </div>
                    )}
                </div>
                <div className="flexf flex-col items-center gap-2 mx-auto">
                    <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="w-full inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
                    >
                        <Camera className="size-4" /> Upload profile photo
                    </button>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">Use a clear campus-friendly profile photo.</p>
                </div>
                <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => handleAvatarFile(event.target.files?.[0])}
                />
            </div>
        </section>
    );
}

export function GalleryUploadStep({
    gallery,
    onGalleryChange,
    onImageClick
}: {
    gallery: NewGalleryImageDto[];
    onGalleryChange: (gallery: NewGalleryImageDto[]) => void;
    onImageClick?: (index: number) => void;
}) {
    const galleryInputRef = useRef<HTMLInputElement | null>(null);
    const uploadGallery = useUploadGalleryImages();
    const items = useMemo(() => toGalleryItems(gallery), [gallery]);
    const remainingSlots = Math.max(0, 10 - items.length);

    async function handleGalleryFiles(files: FileList | null) {
        const selected = Array.from(files ?? []).slice(0, remainingSlots);
        if (!selected.length) return;
        const response = await uploadGallery.mutateAsync(selected);
        const uploadedGallery = response.images.map((item, index) => ({
            key: item.key,
            imageUrl: item.url,
            order: gallery.length + index
        }));
        onGalleryChange(
            [...gallery, ...uploadedGallery].map((item, order) => ({
                ...item,
                order
            }))
        );
        if (galleryInputRef.current) {
            galleryInputRef.current.value = '';
        }
    }

    function removeImage(id: string) {
        onGalleryChange(
            items
                .filter((item) => item.id !== id)
                .map((item, order) => ({
                    key: item.key,
                    imageUrl: item.imageUrl,
                    order
                }))
        );
    }

    function handleSort(newItems: GalleryItem[]) {
        if (uploadGallery.isPending) return;
        onGalleryChange(
            newItems.map((item, order) => ({
                key: item.key,
                imageUrl: item.imageUrl,
                order
            }))
        );
    }

    return (
        <section>
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Gallery</div>
                    <p className="mt-1 text-xs text-muted-foreground">Drag photos to reorder. Add up to 10.</p>
                </div>
                <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadGallery.isPending || remainingSlots === 0}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-black/10 bg-muted px-3 text-xs font-semibold disabled:opacity-50"
                >
                    {uploadGallery.isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Add
                </button>
                <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => handleGalleryFiles(event.target.files)}
                />
            </div>

            {items.length > 0 ? (
                <ReactSortable
                    list={items as (GalleryItem & ItemInterface)[]}
                    setList={(newItems) => handleSort(newItems as GalleryItem[])}
                    disabled={uploadGallery.isPending}
                    animation={150}
                    className="grid grid-cols-3 gap-2"
                >
                    {items.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="relative aspect-square overflow-hidden rounded-xl border border-black/10 bg-muted"
                        >
                            <button type="button" onClick={() => onImageClick?.(index)} className="absolute inset-0">
                                <Image
                                    src={item.imageUrl}
                                    alt={`Gallery photo ${index + 1}`}
                                    fill
                                    sizes="33vw"
                                    unoptimized
                                    className="object-cover"
                                />
                            </button>
                            <div className="absolute left-1 top-1 grid size-7 place-items-center rounded-full bg-white/85 text-foreground">
                                <GripVertical className="size-4" />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeImage(item.id)}
                                className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-white/90 text-foreground"
                                aria-label="Remove gallery photo"
                            >
                                <X className="size-4" />
                            </button>
                        </div>
                    ))}
                </ReactSortable>
            ) : (
                <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadGallery.isPending}
                    className="grid min-h-36 w-full place-items-center rounded-xl border border-dashed border-black/20 bg-muted px-6 text-center text-sm text-muted-foreground disabled:opacity-50"
                >
                    {uploadGallery.isPending ? 'Uploading gallery...' : 'Upload gallery photos'}
                </button>
            )}
        </section>
    );
}

function toGalleryItems(gallery: NewGalleryImageDto[]): GalleryItem[] {
    return gallery
        .map((item, index) => ({
            ...item,
            id: item.key || item.imageUrl || `gallery-${index}`,
            order: item.order ?? index
        }))
        .sort((a, b) => a.order - b.order);
}
