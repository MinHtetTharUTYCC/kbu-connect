import { Suspense } from 'react';
import { ChatHomeClient } from './_components/chat-list';

export default function ChatsPage() {
    return (
        <Suspense fallback="Loading...">
            <ChatHomeClient />
        </Suspense>
    );
}
