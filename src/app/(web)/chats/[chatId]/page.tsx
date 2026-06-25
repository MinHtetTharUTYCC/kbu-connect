import { ChatClient } from '../../chat/_components/chat-client';

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default async function ChatIdPage({ params }: ChatPageProps) {
    const { chatId } = await params;
    return <ChatClient chatId={chatId} />;
}
