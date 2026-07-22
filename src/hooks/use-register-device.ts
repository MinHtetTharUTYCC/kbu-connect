'use client';

import { useAppControllerRegisterDevice } from '@services/generated/app/app';

export function useRegisterDevice() {
    const { mutateAsync } = useAppControllerRegisterDevice();

    return {
        registerDevice: (token: string) =>
            mutateAsync({ data: { token } }).catch(() => {
                // Non-critical — silently ignore
            })
    };
}
