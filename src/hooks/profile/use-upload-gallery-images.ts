'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import axiosInstanceFn from '@/lib/axios/axios-instance';

type UploadedGalleryImage = {
    url: string;
    key: string;
};

type UploadGalleryImagesResponse = {
    images: UploadedGalleryImage[];
};

const validImageTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp'];
const maxImageSize = 20 * 1024 * 1024;

export function useUploadGalleryImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (files: File[]) => {
            if (files.length === 0) {
                throw new Error('Please select at least one image');
            }

            for (const file of files) {
                if (!validImageTypes.includes(file.type)) {
                    throw new Error(`${file.name}: invalid file type`);
                }

                if (file.size > maxImageSize) {
                    throw new Error(`${file.name}: exceeds 20MB limit`);
                }
            }

            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });

            return axiosInstanceFn<UploadGalleryImagesResponse>({
                url: '/gallery/upload',
                method: 'POST',
                data: formData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/users/me'] });
        },
        onError: (error) => {
            const message = error instanceof Error ? error.message : 'Gallery upload failed';
            toast.error(message);
        },
    });
}
