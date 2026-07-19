'use client';

import type { MessageItemDto } from '@services/model/messageItemDto';
import { ArrowLeft, Ban, Check, Flag, MoreVertical, Send, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/components/auth-provider';
import { ActionConfirmDialog } from '@/components/mobile/action-confirm-dialog';
import { Avatar, EmptyState } from '@/components/mobile/app-chrome';
import { ProfileSheet } from '@/components/mobile/profile-sheet';
import { ReportDialog } from '@/components/report-dialog';
import { useSocketContext } from '@/components/socket-provider';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useBlockUser } from '@/hooks/block/use-block-user';
import { useConversation } from '@/hooks/chat/use-conversation';
import { useConversationMessages } from '@/hooks/chat/use-conversation-messages';
import { useDeleteConversation } from '@/hooks/chat/use-delete-conversation';
import { useDeleteMessage } from '@/hooks/chat/use-delete-message';
import { useEditMessage } from '@/hooks/chat/use-edit-message';
import { useMarkConversationSeen } from '@/hooks/chat/use-mark-conversation-seen';
import { useSendMessage } from '@/hooks/chat/use-send-message';
import { useReportUser } from '@/hooks/reports/use-report-user';
import { useUserStatus } from '@/hooks/use-user-status';
import { formatDateToNow } from '@/lib/date/format-date';
import { useChatState } from '../[chatId]/_hooks/use-chat-state';
import ItemsLoading from './loading';
import Message from './message';

export function ChatClient({ chatId }: { chatId: string }) {
    const router = useRouter();

    const { user } = useAuthContext();
    const { socket } = useSocketContext();
    const { getOnlineStatus } = useUserStatus(socket);

    const {
        messages,
        isLoading: isLoadingMessages,
        fetchNextPage: fetchNextPageMessages,
        hasNextPage: hasNextPageMessages,
        isFetchingNextPage: isFetchingNextPageMessages
    } = useConversationMessages(chatId);
    const { data: conversation, isLoading: conversationLoading } = useConversation(chatId);
    const { mutate: markSeen } = useMarkConversationSeen();

    const inputRef = useRef<HTMLTextAreaElement | null>(null);

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
        handleCancelEdit
    } = useChatState();

    const [showDeleteMessageConfirm, setShowDeleteMessageConfirm] = useState(false);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);
    const [showReportConfirm, setShowReportConfirm] = useState(false);

    const myId = user?.user?.id;

    const { mutateAsync: sendMessage, isPending: isSendingMessage } = useSendMessage(chatId, myId, () => {
        setDraft('');
        scrollToBottom();
    });

    const { mutate: deleteConversation, isPending: isDeleting } = useDeleteConversation();
    const { mutate: editMessage, isPending: isEditingMessage } = useEditMessage(chatId, () => {
        handleCancelEdit();
    });
    const { mutate: deleteMessage, isPending: isDeletingMessage } = useDeleteMessage(chatId);
    const { mutateAsync: blockUser, isPending: isBlocking } = useBlockUser(chatId);
    const { mutateAsync: reportUser, isPending: isReporting } = useReportUser();

    const mainRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const prevScrollHeight = useRef(0);
    const hasScrolledInitially = useRef(false);

    const scrollToBottom = useCallback(() => {
        // Double rAF ensures layout is fully committed before we scroll.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ block: 'end' });
                const el = mainRef.current;
                if (el) {
                    el.scrollTop = el.scrollHeight;
                }
            });
        });
    }, []);

    useEffect(() => {
        if (chatId && conversation) {
            markSeen({ conversationId: chatId });
        }
    }, [chatId, conversation, markSeen]);

    useLayoutEffect(() => {
        if (!isLoadingMessages && messages.length > 0 && !hasScrolledInitially.current) {
            scrollToBottom();
            hasScrolledInitially.current = true;
        }
    }, [isLoadingMessages, messages.length, scrollToBottom]);

    useEffect(() => {
        if (!isFetchingNextPageMessages && mainRef.current && prevScrollHeight.current) {
            const newScrollHeight = mainRef.current.scrollHeight;

            mainRef.current.scrollTop = newScrollHeight - prevScrollHeight.current;

            prevScrollHeight.current = 0;
        }
    }, [isFetchingNextPageMessages]);

    const handleLoadOlder = () => {
        if (mainRef.current) {
            prevScrollHeight.current = mainRef.current.scrollHeight;
        }

        fetchNextPageMessages();
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <>
    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }, [draft, editingContent]);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const content = draft.trim();
        if (!content || !myId) return;

        await sendMessage({ data: { conversationId: chatId, content } });
    }

    function handleSubmitEdit() {
        if (!editingMessageId || !editingContent.trim()) return;
        editMessage(
            {
                messageId: editingMessageId,
                data: { content: editingContent.trim() }
            },
            { onSuccess: () => handleCancelEdit() }
        );
    }

    if (conversationLoading) return <ItemsLoading />;

    if (!conversation) {
        return (
            <EmptyState title="Conversation unavailable" body="This chat may have been deleted or is no longer available." icon="message" />
        );
    }

    if (!myId) {
        return <EmptyState title="Login required" body="Please sign in to view this conversation." icon="user" />;
    }

    const isOnline = getOnlineStatus(conversation.participant.id) || conversation.isOnline;

    const statusText = isOnline ? 'Active now' : conversation.lastOnline ? `Active ${formatDateToNow(conversation.lastOnline)}` : '';

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <header className="flex shrink-0 items-center gap-3 border-b border-black/10 bg-white px-5 py-3">
                <Link href="/chats" className="-ml-2 grid place-items-center" aria-label="Go back">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <button
                    type="button"
                    onClick={() => setSelectedProfileId(conversation.participant.id)}
                    className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                    <Avatar src={conversation.participant.avatarUrl} name={conversation.participant.name} className="size-10" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{conversation.participant.name}</p>
                        {statusText && <p className={`text-xs ${isOnline ? 'text-green-500' : 'text-muted-foreground'}`}>{statusText}</p>}
                    </div>
                </button>
                <DropdownMenu>
                    <DropdownMenuTrigger className="grid size-10 place-items-center text-primary">
                        <MoreVertical className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowReportConfirm(true)}>
                            <Flag className="size-4" />
                            Report user
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowBlockConfirm(true)}>
                            <Ban className="size-4" />
                            Block user
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => setShowChatDeleteConfirm(true)}>
                            <Trash className="size-4" />
                            Delete chat
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-6">
                {isLoadingMessages ? (
                    <ItemsLoading />
                ) : messages.length ? (
                    <div className="flex flex-col gap-3">
                        {hasNextPageMessages && (
                            <button
                                type="button"
                                onClick={handleLoadOlder}
                                disabled={isFetchingNextPageMessages}
                                className="w-full py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {isFetchingNextPageMessages ? 'Loading...' : 'View older messages'}
                            </button>
                        )}

                        {messages.map((message, index) => {
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
                                    showTimestamp={shouldShowTimestamp(messages, index)}
                                    isEditing={editingMessageId === message.id}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                    <EmptyState title="No messages yet" body="Send the first message to start the conversation." icon="message-circle" />
                )}
            </main>

            <form
                onSubmit={
                    isEditing
                        ? (e) => {
                              e.preventDefault();
                              handleSubmitEdit();
                          }
                        : handleSubmit
                }
                className="flex shrink-0 items-center gap-3 border-t border-black/10 bg-white px-5 py-3"
            >
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="grid size-11 shrink-0 place-items-center rounded-xl border border-black/10 transition active:scale-95"
                        aria-label="Cancel edit"
                    >
                        <X className="size-5" />
                    </button>
                )}
                <textarea
                    ref={inputRef}
                    value={isEditing ? editingContent : draft}
                    onChange={(e) => (isEditing ? setEditingContent(e.target.value) : setDraft(e.target.value))}
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (isEditing) {
                                handleSubmitEdit();
                            } else {
                                handleSubmit(e as unknown as React.SubmitEvent<HTMLFormElement>);
                            }
                        }
                        if (isEditing && e.key === 'Escape') {
                            handleCancelEdit();
                        }
                    }}
                    placeholder={isEditing ? 'Edit message...' : 'Type here...'}
                    aria-label={isEditing ? 'Edit message' : 'Message'}
                    rows={1}
                    className="h-11 min-h-[44px] max-h-[120px] min-w-0 flex-1 resize-none overflow-y-auto rounded-xl border border-black/10 bg-[#f9f9f8] px-4 py-2.5 text-sm leading-6 outline-none focus:border-primary scrollbar-none [&::-webkit-scrollbar]:hidden"
                />
                <button
                    type="submit"
                    disabled={isEditing ? isEditingMessage || !editingContent.trim() : isSendingMessage || !draft.trim()}
                    className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
                    aria-label={isEditing ? 'Save edit' : 'Send message'}
                >
                    {isEditing ? <Check className="size-5" /> : <Send className="size-5" />}
                </button>
            </form>

            {showChatDeleteConfirm && (
                <ActionConfirmDialog
                    action="Delete"
                    title="Delete chat"
                    message="Are you sure you want to delete this chat? This action cannot be undone."
                    isPending={isDeleting}
                    onClose={() => setShowChatDeleteConfirm(false)}
                    onConfirm={() => deleteConversation({ conversationId: chatId })}
                />
            )}
            {selectedProfileId && <ProfileSheet userId={selectedProfileId} onClose={() => setSelectedProfileId(null)} from="visit" />}
            {showDeleteMessageConfirm && deleteMessageTargetId && (
                <ActionConfirmDialog
                    action="Delete"
                    title="Delete message"
                    message="Are you sure you want to delete this message? This action cannot be undone."
                    isPending={isDeletingMessage}
                    onClose={() => {
                        setShowDeleteMessageConfirm(false);
                        setDeleteMessageTargetId(null);
                    }}
                    onConfirm={() =>
                        deleteMessage(
                            { messageId: deleteMessageTargetId },
                            {
                                onSuccess: () => {
                                    setShowDeleteMessageConfirm(false);
                                    setDeleteMessageTargetId(null);
                                    toast.success('Message deleted successfully');
                                }
                            }
                        )
                    }
                />
            )}
            {showBlockConfirm && (
                <ActionConfirmDialog
                    action="Block"
                    title="Block user"
                    message={`Are you sure you want to block ${conversation.participant.name}? They won't be able to message you or see your profile.`}
                    isPending={isBlocking}
                    onClose={() => setShowBlockConfirm(false)}
                    onConfirm={() => {
                        blockUser(
                            { data: { blockedId: conversation.participant.id } },
                            {
                                onSuccess: () => {
                                    setShowBlockConfirm(false);
                                    toast.success('Block scuccessfully');
                                    router.replace('/chats');
                                }
                            }
                        );
                    }}
                />
            )}
            <ReportDialog
                open={showReportConfirm}
                onOpenChange={setShowReportConfirm}
                userName={conversation.participant.name}
                isPending={isReporting}
                onSubmit={async (reason, description) => {
                    await reportUser(
                        {
                            data: {
                                reportedId: conversation.participant.id,
                                reason,
                                description
                            }
                        },
                        { onSuccess: () => setShowReportConfirm(false) }
                    );
                }}
            />
        </div>
    );
}

function shouldShowTimestamp(messages: MessageItemDto[], index: number): boolean {
    if (index === messages.length - 1) return true;
    if (index % 5 === 0) return true;

    const current = new Date(messages[index].timestamp).getTime();
    const next = new Date(messages[index + 1].timestamp).getTime();
    return next - current > 5 * 60 * 1000;
}
