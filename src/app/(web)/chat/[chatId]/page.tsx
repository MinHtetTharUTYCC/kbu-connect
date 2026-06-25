import { redirect } from 'next/navigation';

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default async function ChatIdPage({ params }: ChatPageProps) {
    const { chatId } = await params;
    redirect(`/chats/${chatId}`);
}
