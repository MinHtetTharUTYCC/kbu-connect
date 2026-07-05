'use client';

import type { MessageItemDto } from '@services/model/messageItemDto';
import { ArrowLeft, MoreVertical, Send, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthContext } from '@/components/auth-provider';
import { LoadMoreRow } from '@/components/load-more-row';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { DeleteConfirmSheet } from '@/components/mobile/delete-confirm-sheet';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useConversation } from '@/hooks/chat/use-conversation';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useDeleteConversation } from '@/hooks/chat/use-delete-conversation';
import { useDeleteMessage } from '@/hooks/chat/use-delete-message';
import { useEditMessage } from '@/hooks/chat/use-edit-message';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import { useSendMessage } from '@/hooks/chat/use-send-message';
import { formatDateToNow } from '@/lib/date/format-date';
import { useChatState } from '../[chatId]/_hooks/use-chat-state';
import Message from './message';

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
    const editInputRef = useRef<HTMLTextAreaElement | null>(null);

    const [draft, setDraft] = useState('');
    const {
        showChatDeleteConfirm,
        setShowChatDeleteConfirm,
        selectedProfileId,
        setSelectedProfileId,
        editingMessageId,
        editingContent,
        setEditingContent,
        deleteMessageTargetId,
        setDeleteMessageTargetId,
        isEditing,
        handleStartEdit,
        handleCancelEdit,
    } = useChatState();

    const [showDeleteMessageConfirm, setShowDeleteMessageConfirm] =
        useState(false);

    const myId = user?.user?.id;

    const { mutateAsync: sendMessage, isPending: isSendingMessage } =
        useSendMessage(chatId, myId, () => setDraft(''));

    const { mutate: deleteConversation, isPending: isDeleting } =
        useDeleteConversation();
    const { mutate: editMessage, isPending: isEditingMessage } =
        useEditMessage(chatId);
    const { mutate: deleteMessage, isPending: isDeletingMessage } =
        useDeleteMessage(chatId, () => {
            setShowDeleteMessageConfirm(false);
            setDeleteMessageTargetId(null);
        });

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, []);

    useEffect(() => {
        if (chatId && conversation) {
            markSeen({ conversationId: chatId });
        }
    }, [chatId, conversation, markSeen]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages.length, scrollToBottom]);

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

    function handleSubmitEdit() {
        if (!editingMessageId || !editingContent.trim()) return;
        editMessage(
            {
                messageId: editingMessageId,
                data: { content: editingContent.trim() },
            },
            { onSuccess: () => handleCancelEdit(editInputRef) },
        );
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
          ? `Active ${formatDateToNow(conversation.lastOnline)}`
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
                    type="button"
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
                            onClick={() => setShowChatDeleteConfirm(true)}
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
                            return (
                                <Message
                                    key={message.id}
                                    message={message}
                                    myId={myId}
                                    onEdit={handleStartEdit}
                                    onDeleteTrigger={(id) => {
                                        setDeleteMessageTargetId(id);
                                        setShowDeleteMessageConfirm(true);
                                    }}
                                    showTimestamp={shouldShowTimestamp(
                                        messages,
                                        messages.indexOf(message),
                                    )}
                                    isEditing={editingMessageId === message.id}
                                />
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

            {isEditing && (
                <div className="flex shrink-0 items-center gap-3 border-t border-primary/30 bg-primary/5 px-5 py-3">
                    <textarea
                        ref={editInputRef}
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmitEdit();
                            }
                            if (e.key === 'Escape')
                                handleCancelEdit(editInputRef);
                        }}
                        placeholder="Edit message..."
                        rows={1}
                        className="h-11 min-w-0 flex-1 resize-none rounded-xl border border-primary/30 bg-white px-4 text-sm outline-none focus:border-primary"
                    />
                    <button
                        type="button"
                        onClick={() => handleCancelEdit(editInputRef)}
                        className="grid size-11 place-items-center rounded-xl border border-black/10 transition active:scale-95"
                        aria-label="Cancel edit"
                    >
                        <X className="size-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmitEdit}
                        disabled={isEditingMessage || !editingContent.trim()}
                        className="grid size-11 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
                        aria-label="Save edit"
                    >
                        <Send className="size-5" />
                    </button>
                </div>
            )}

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

            {showChatDeleteConfirm && (
                <DeleteConfirmSheet
                    title="Delete chat"
                    message="Are you sure you want to delete this chat? This action cannot be undone."
                    isPending={isDeleting}
                    onClose={() => setShowChatDeleteConfirm(false)}
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
            {showDeleteMessageConfirm && deleteMessageTargetId && (
                <DeleteConfirmSheet
                    title="Delete message"
                    message="Are you sure you want to delete this message? This action cannot be undone."
                    isPending={isDeletingMessage}
                    onClose={() => {
                        setShowDeleteMessageConfirm(false);
                        setDeleteMessageTargetId(null);
                    }}
                    onConfirm={() =>
                        deleteMessage({ messageId: deleteMessageTargetId })
                    }
                />
            )}
        </div>
    );
}

function shouldShowTimestamp(
    messages: MessageItemDto[],
    index: number,
): boolean {
    if (index === messages.length - 1) return true; // always show on last
    if (index % 5 === 0) return true; // every 5 messages

    const current = new Date(messages[index].timestamp).getTime();
    const next = new Date(messages[index + 1].timestamp).getTime();
    return next - current > 5 * 60 * 1000; // 5 min gap
}
