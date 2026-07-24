import { Suspense } from 'react';
import { ChatHomeClient } from './_components/chat-list';
import ItemsLoading from './_components/loading';

export const metadata = {
    title: 'Chats'
};

export default function ChatsPage() {
    return (
        <Suspense fallback={<ItemsLoading />}>
            <ChatHomeClient />
        </Suspense>
    );
}
