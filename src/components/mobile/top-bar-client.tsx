'use client';

import { useTopBar } from './top-bar-provider';

export default function TopBarClient({
    title,
    canBack = true,
}: {
    title: string;
    canBack?: boolean;
}) {
    useTopBar({
        title: title,
        canBack: canBack,
    });

    return null;
}
