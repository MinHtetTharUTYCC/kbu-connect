"use client";

import type { UploadAvatarResponseDto } from "@services/model";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstanceFn from "@/lib/axios/axios-instance";
import { handleBackendError } from "@/lib/error/error-util";

const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/heic",
    "image/heif",
    "image/webp",
];
const maxImageSize = 20 * 1024 * 1024;

export function useUploadAvatar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            if (!validImageTypes.includes(file.type)) {
                throw new Error(
                    "Invalid file type. Only images are supported.",
                );
            }

            if (file.size > maxImageSize) {
                throw new Error("File size exceeds 20MB limit");
            }

            const formData = new FormData();
            formData.append("file", file);

            return axiosInstanceFn<UploadAvatarResponseDto>({
                url: "/users/avatar",
                method: "POST",
                data: formData,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/users/me"] });
        },
        onError: (error) => handleBackendError(error),
    });
}
