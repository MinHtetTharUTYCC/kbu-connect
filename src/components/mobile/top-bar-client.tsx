'use client';

import { useRouter } from 'next/navigation';
import { useTopBar } from './top-bar-provider';

export default function TopBarClient({ title }: { title: string }) {
    const router = useRouter();

    useTopBar({
        title: title,
        onBackClick: () => {
            if (window.history.length > 1) {
                router.back();
            }

            router.push('/');
        },
    });

    return null;
}
