'use client';

import { ArrowLeft, MoreVertical, PlusCircle, Send, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { DeleteConfirmSheet } from '@/components/mobile/delete-confirm-sheet';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import { relativeTime } from '@/lib/profile-utils';
import { cn } from '@/lib/utils';
import { useConversation } from '@/hooks/chat/use-conversation';
import { useSendMessage } from '@/hooks/chat/use-send-message';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteConversation } from '@/hooks/chat/use-delete-conversation';
import { LoadMoreRow } from '@/components/load-more-row';
import { ProfileSheet } from '@/components/mobile/profile-sheet';

export function ChatClient({ chatId }: { chatId: string }) {
    const { user } = useAuthContext();

    const {
        messages,
        isLoading: isLoadingMessages,
        fetchNextPage: fetchNextPageMessages,
        hasNextPage: hasNextPageMessages,
        isFetchingNextPage: isFetchingNextPageMessages,
    } = useConversationMessages(chatId);
    const { data: conversation, isLoading: conversationLoading } =
        useConversation(chatId);
    const { mutate: markSeen } = useMarkConversationSeen();

    const loadMoreMessagesRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const [draft, setDraft] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
        null,
    );

    const myId = user?.user?.id;

    const { mutateAsync: sendMessage, isPending: isSendingMessage } =
        useSendMessage(chatId, myId, () => setDraft(''));

    const { mutate: deleteConversation, isPending: isDeleting } =
        useDeleteConversation();

    function scrollToBottom(behavior: ScrollBehavior = 'auto') {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }

    useEffect(() => {
        if (chatId && conversation) {
            markSeen({ conversationId: chatId });
        }
    }, [chatId, conversation, markSeen]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length]);

    useEffect(() => {
        const target = loadMoreMessagesRef.current;
        if (!target || !hasNextPageMessages) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPageMessages) {
                    fetchNextPageMessages();
                }
            },
            { rootMargin: '180px 0px' },
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [
        fetchNextPageMessages,
        hasNextPageMessages,
        isFetchingNextPageMessages,
    ]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const content = draft.trim();
        if (!content || !myId) return;

        await sendMessage({ data: { conversationId: chatId, content } });
        scrollToBottom();
    }

    if (conversationLoading || (!conversation && hasNextPageMessages)) {
        return (
            <EmptyState
                title="Loading conversation"
                body="Opening your conversation."
            />
        );
    }

    if (!conversation) {
        return (
            <EmptyState
                title="Conversation unavailable"
                body="This chat may have been deleted or is no longer available."
            />
        );
    }

    if (!myId) {
        return (
            <EmptyState
                title="Authentication required"
                body="Please sign in to view this conversation."
            />
        );
    }

    const statusText = conversation.isOnline
        ? 'Active now'
        : conversation.lastOnline
          ? `Active ${relativeTime(conversation.lastOnline)}`
          : '';

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <header className="flex shrink-0 items-center gap-3 border-b border-black/10 bg-white px-5 py-3">
                <Link
                    href="/chats"
                    className="-ml-2 grid place-items-center"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <button
                    onClick={() =>
                        setSelectedProfileId(conversation.participant.id)
                    }
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                    <Avatar
                        src={conversation.participant.avatarUrl}
                        name={conversation.participant.name}
                        className="size-10"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">
                            {conversation.participant.name}
                        </p>
                        {statusText && (
                            <p className="text-xs text-muted-foreground">
                                {statusText}
                            </p>
                        )}
                    </div>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger className="grid size-10 place-items-center text-primary">
                        <MoreVertical className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-red-500"
                            onClick={() => setShowDeleteConfirm(true)}
                        >
                            <Trash className="size-4" />
                            Delete chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6">
                {isLoadingMessages ? (
                    <EmptyState
                        title="Loading messages"
                        body="Opening your messages."
                    />
                ) : messages.length ? (
                    <div className="flex flex-col gap-3">
                        <LoadMoreRow
                            ref={loadMoreMessagesRef}
                            hasNextPage={hasNextPageMessages}
                            isFetchingNextPage={isFetchingNextPageMessages}
                            endLabel=""
                        />
                        {messages.map((message) => {
                            const mine = message.senderId === myId;
                            return (
                                <div
                                    key={message.id}
                                    className={cn(
                                        'flex max-w-[85%] flex-col',
                                        mine
                                            ? 'self-end items-end'
                                            : 'items-start',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'rounded-xl p-3 text-sm leading-6',
                                            mine
                                                ? 'rounded-tr-none bg-primary text-white'
                                                : 'rounded-tl-none border border-black/10 bg-[#f9f9f8]',
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                    <span className="mt-1 px-1 text-[10px] text-[#6b6b6b]">
                                        {relativeTime(message.timestamp)}
                                    </span>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <EmptyState
                        title="No messages yet"
                        body="Send the first message to start the conversation."
                    />
                )}
            </main>

            <form
                onSubmit={handleSubmit}
                className="flex shrink-0 items-center gap-3 border-t border-black/10 bg-white px-5 py-3"
            >
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type here..."
                    aria-label="Message"
                    className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f9f9f8] px-4 text-sm outline-none focus:border-primary"
                />
                <button
                    type="submit"
                    disabled={isSendingMessage || !draft.trim()}
                    className="grid size-11 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
                    aria-label="Send message"
                >
                    <Send className="size-5" />
                </button>
            </form>

            {showDeleteConfirm && (
                <DeleteConfirmSheet
                    title="Delete chat"
                    message="Are you sure you want to delete this chat? This action cannot be undone."
                    isPending={isDeleting}
                    onClose={() => setShowDeleteConfirm(false)}
                    onConfirm={() =>
                        deleteConversation({ conversationId: chatId })
                    }
                />
            )}
            {selectedProfileId && (
                <ProfileSheet
                    userId={selectedProfileId}
                    onClose={() => setSelectedProfileId(null)}
                    from="visit"
                />
            )}
        </div>
    );
}
