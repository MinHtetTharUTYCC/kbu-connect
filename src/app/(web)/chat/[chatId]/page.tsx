interface ChatPageProps {
  params: Promise<{ chatId: string }>;
}

export default async function ChatIdPage({ params }: ChatPageProps) {
  const { chatId } = await params;
  return <div>Chat Page Id - {chatId}</div>;
}
