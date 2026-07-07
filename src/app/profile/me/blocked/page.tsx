'use client';

import { BlocksList } from '@/components/blocks-list';
import { useTopBar } from '@/components/mobile/top-bar-provider';

export default function BlockedUsersPage() {
    useTopBar({ title: 'Blocked' });

    return (
        <div className="p-4">
            <BlocksList />
        </div>
    );
}
