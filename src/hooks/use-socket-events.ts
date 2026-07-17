'use client';

import {
    getChatControllerGetConversationMessagesInfiniteQueryKey,
    getChatControllerGetConversationsInfiniteQueryKey,
    getChatControllerGetShoutoutsInfiniteQueryKey,
    getChatControllerGetUnreadCountQueryKey
} from '@services/generated/chat/chat';
import { getMatchesControllerGetMatchesInfiniteQueryKey } from '@services/generated/matches/matches';
import { getNotificationsControllerGetUnreadCountQueryKey } from '@services/generated/notifications/notifications';
import type {
    ChatUnreadCountResponseDto,
    ConversationItemDto,
    ConversationsListResponseDto,
    MatchItemDto,
    MatchListResponseDto,
    MessageItemDto,
    MessagesListResponseDto,
    NotificationsUnreadCountResponseDto,
    ShoutoutItemDto,
    ShoutoutsListResponseDto
} from '@services/model';
import type { InfiniteData, QueryKey } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '@/components/auth-provider';
import { useSocketContext } from '@/components/socket-provider';

interface MessageNewEvent {
    type: 'NEW_MESSAGE';
    conversationId: string;
    message: MessageItemDto;
}

interface MessageEditedEvent {
    type: 'MESSAGE_EDITED';
    conversationId: string;
    message: MessageItemDto;
}

interface MessageDeletedEvent {
    type: 'MESSAGE_DELETED';
    conversationId: string;
    messageId: string;
}

interface MatchNewEvent {
    type: 'NEW_MATCH';
    match: {
        id: string;
        createdAt: string;
        matcher: { id: string; name: string; avatarUrl: string | null };
        conversationId: string;
    };
}

interface ShoutoutReceivedEvent {
    type: 'SHOUTOUT_RECEIVED';
    senderId: string;
    shoutout: {
        id: string;
        content: string;
        createdAt: string;
        sender: { id: string; name: string; avatarUrl: string | null };
    };
}

interface ShoutoutRepliedEvent {
    type: 'SHOUTOUT_REPLIED';
    conversationId: string;
    shoutout: {
        id: string;
        content: string;
        createdAt: string;
        replier: { id: string; name: string; avatarUrl: string | null };
    };
}

type SocketEvent =
    | MessageNewEvent
    | MessageEditedEvent
    | MessageDeletedEvent
    | MatchNewEvent
    | ShoutoutReceivedEvent
    | ShoutoutRepliedEvent;

export function useSocketEvents() {
    const queryClient = useQueryClient();
    const { socket } = useSocketContext();
    const { user } = useAuthContext();
    const pathname = usePathname();

    const myId = user?.user?.id;
    const myIdRef = useRef(myId);
    myIdRef.current = myId;

    const activeConversationIdRef = useRef<string | null>(null);
    const isOnShoutoutsTabRef = useRef(false);

    useEffect(() => {
        const match = pathname.match(/^\/chats\/([^/]+)$/);
        activeConversationIdRef.current = match?.[1] ?? null;

        const tab = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tab') : null;

        isOnShoutoutsTabRef.current = pathname === '/chats' && tab === 'shoutouts';
    }, [pathname]);

    useEffect(() => {
        if (!socket || !myId) return;

        function handleMessageNew(data: MessageNewEvent) {
            const { conversationId, message } = data;

            const isActive = activeConversationIdRef.current === conversationId;
            const currentMyId = myIdRef.current;

            const messagesKey = getChatControllerGetConversationMessagesInfiniteQueryKey(conversationId);

            queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(messagesKey, (old) => {
                if (!old?.pages) return old;

                const existingIds = new Set(old.pages.flatMap((p) => p.messages.map((m) => m.id)));
                if (existingIds.has(message.id)) return old;

                const tempIndex = old.pages[0].messages.findIndex(
                    (m) => m.id.startsWith('temp-') && m.senderId === message.senderId && m.content === message.content
                );

                if (tempIndex !== -1) {
                    const messages = [...old.pages[0].messages];
                    messages[tempIndex] = message;
                    return {
                        ...old,
                        pages: old.pages.map((page, idx) => (idx === 0 ? { ...page, messages } : page))
                    };
                }

                return {
                    ...old,
                    pages: old.pages.map((page, idx) => (idx === 0 ? { ...page, messages: [message, ...page.messages] } : page))
                };
            });
            const conversationsKey = getChatControllerGetConversationsInfiniteQueryKey();

            queryClient.setQueryData<InfiniteData<ConversationsListResponseDto>>(conversationsKey, (old) => {
                if (!old?.pages) return old;

                let found = false;
                const pages = old.pages.map((page) => {
                    const idx = page.conversations.findIndex((c) => c.id === conversationId);
                    if (idx === -1) return page;

                    found = true;
                    const convo = page.conversations[idx];
                    const updated: ConversationItemDto = {
                        ...convo,
                        lastMessage: message,
                        updatedAt: message.timestamp,
                        isRead: false
                    };
                    const filtered = page.conversations.filter((c) => c.id !== conversationId);
                    return { ...page, conversations: [updated, ...filtered] };
                });

                if (!found) return old;
                return { ...old, pages };
            });

            if (!isActive && message.senderId !== currentMyId) {
                increaseUnreadCount(queryClient, getChatControllerGetUnreadCountQueryKey());
                toast(message.content, {
                    action: {
                        label: 'View Conversation',
                        onClick: () => {
                            window.location.href = `/chats/${conversationId}`;
                        }
                    }
                });
            }
        }

        function handleMessageEdited(data: MessageEditedEvent) {
            const conversationsKey = getChatControllerGetConversationsInfiniteQueryKey();

            queryClient.setQueryData<InfiniteData<ConversationsListResponseDto>>(conversationsKey, (old) => {
                if (!old?.pages) return old;

                let found = false;
                const pages = old.pages.map((page) => {
                    const idx = page.conversations.findIndex((c) => c.id === data.conversationId && c.lastMessage?.id === data.message.id);
                    if (idx === -1) return page;

                    found = true;
                    return {
                        ...page,
                        conversations: page.conversations.map((c) =>
                            c.id === data.conversationId ? { ...c, lastMessage: data.message } : c
                        )
                    };
                });

                if (!found) return old;
                return { ...old, pages };
            });

            const messagesKey = getChatControllerGetConversationMessagesInfiniteQueryKey(data.conversationId);

            queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(messagesKey, (old) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        messages: page.messages.map((msg) => (msg.id === data.message.id ? data.message : msg))
                    }))
                };
            });
        }

        function handleMessageDeleted(data: MessageDeletedEvent) {
            const conversationsKey = getChatControllerGetConversationsInfiniteQueryKey();
            const messagesKey = getChatControllerGetConversationMessagesInfiniteQueryKey(data.conversationId);

            queryClient.setQueryData<InfiniteData<ConversationsListResponseDto>>(conversationsKey, (old) => {
                if (!old?.pages) return old;

                let found = false;
                const pages = old.pages.map((page) => {
                    const idx = page.conversations.findIndex((c) => c.id === data.conversationId && c.lastMessage?.id === data.messageId);
                    if (idx === -1) return page;

                    found = true;
                    return {
                        ...page,
                        conversations: page.conversations.map((c) => (c.id === data.conversationId ? { ...c, lastMessage: null } : c))
                    };
                });

                if (!found) return old;
                return { ...old, pages };
            });

            queryClient.setQueryData<InfiniteData<MessagesListResponseDto>>(messagesKey, (old) => {
                if (!old?.pages) return old;

                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        messages: page.messages.filter((msg) => msg.id !== data.messageId)
                    }))
                };
            });
        }

        function handleMatchNew(data: MatchNewEvent) {
            console.log('Received new match event:', data);
            const match: MatchItemDto = {
                id: data.match.id,
                matchedAt: data.match.createdAt,
                isNew: true,
                conversationId: data.match.conversationId,
                matcher: data.match.matcher
            };

            const matchesKey = getMatchesControllerGetMatchesInfiniteQueryKey();

            queryClient.setQueryData<InfiniteData<MatchListResponseDto>>(matchesKey, (old) => {
                if (!old?.pages) return old;

                const existingIds = new Set(old.pages.flatMap((p) => p.matches.map((m) => m.id)));
                if (existingIds.has(match.id)) return old;

                return {
                    ...old,
                    pages: old.pages.map((page, idx) => (idx === 0 ? { ...page, matches: [match, ...page.matches] } : page))
                };
            });

            window.dispatchEvent(new CustomEvent('new-match', { detail: match }));
        }

        function handleShoutoutReceived(data: ShoutoutReceivedEvent) {
            const { shoutout } = data;

            const shoutoutReceived: ShoutoutItemDto = {
                id: shoutout.id,
                content: shoutout.content,
                type: 'received',
                createdAt: shoutout.createdAt,
                otherUser: {
                    id: shoutout.sender.id,
                    name: shoutout.sender.name,
                    avatarUrl: shoutout.sender.avatarUrl
                }
            };

            const shoutoutsKey = getChatControllerGetShoutoutsInfiniteQueryKey({ type: 'received' });

            queryClient.setQueryData<InfiniteData<ShoutoutsListResponseDto>>(shoutoutsKey, (old) => {
                if (!old?.pages) return old;

                const existingIds = new Set(old.pages.flatMap((p) => p.shoutouts.map((s) => s.id)));
                if (existingIds.has(shoutoutReceived.id)) return old;

                return {
                    ...old,
                    pages: old.pages.map((page, idx) => (idx === 0 ? { ...page, shoutouts: [shoutoutReceived, ...page.shoutouts] } : page))
                };
            });

            increaseUnreadCount(queryClient, getNotificationsControllerGetUnreadCountQueryKey());

            if (!isOnShoutoutsTabRef.current) {
                toast(`New shoutout from ${shoutoutReceived.otherUser.name}`, {
                    action: {
                        label: 'View',
                        onClick: () => {
                            window.location.href = '/chats?tab=shoutouts';
                        }
                    }
                });
            }
        }

        function handleShoutoutReplied(data: ShoutoutRepliedEvent) {
            const { shoutout } = data;

            const shoutoutsKey = getChatControllerGetShoutoutsInfiniteQueryKey({ type: 'received' });

            queryClient.setQueryData<InfiniteData<ShoutoutsListResponseDto>>(shoutoutsKey, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        shoutouts: page.shoutouts.filter((s) => s.id !== shoutout.id)
                    }))
                };
            });

            const conversationsKey = getChatControllerGetConversationsInfiniteQueryKey();

            queryClient.setQueryData<InfiniteData<ConversationsListResponseDto>>(conversationsKey, (old) => {
                if (!old) return old;

                const newConvo: ConversationItemDto = {
                    id: data.conversationId,
                    otherUser: {
                        id: shoutout.replier.id,
                        name: shoutout.replier.name,
                        avatarUrl: shoutout.replier.avatarUrl
                    },
                    isOnline: false,
                    lastOnline: null,
                    lastMessage: {
                        id: shoutout.id,
                        content: shoutout.content,
                        senderId: shoutout.replier.id,
                        timestamp: shoutout.createdAt
                    },
                    isRead: false,
                    updatedAt: shoutout.createdAt
                };

                const pages = old.pages.map((page) => ({
                    ...page,
                    conversations: page.conversations.filter((c) => c.id !== data.conversationId)
                }));

                pages[0] = {
                    ...pages[0],
                    conversations: [newConvo, ...pages[0].conversations]
                };

                return { ...old, pages };
            });

            increaseUnreadCount(queryClient, getChatControllerGetUnreadCountQueryKey());
            increaseUnreadCount(queryClient, getNotificationsControllerGetUnreadCountQueryKey());

            if (!isOnShoutoutsTabRef.current) {
                toast(`${shoutout.replier.name} replied your shoutout`, {
                    action: {
                        label: 'View',
                        onClick: () => {
                            window.location.href = `/chats/${data.conversationId}`;
                        }
                    }
                });
            }
        }

        function handleEvent(data: SocketEvent) {
            switch (data.type) {
                case 'NEW_MESSAGE':
                    handleMessageNew(data);
                    break;
                case 'MESSAGE_EDITED':
                    handleMessageEdited(data);
                    break;
                case 'MESSAGE_DELETED':
                    handleMessageDeleted(data);
                    break;
                case 'NEW_MATCH':
                    handleMatchNew(data);
                    break;
                case 'SHOUTOUT_RECEIVED':
                    handleShoutoutReceived(data);
                    break;
                case 'SHOUTOUT_REPLIED':
                    handleShoutoutReplied(data);
                    break;
            }
        }

        socket.on('message:new', handleEvent);
        socket.on('message:edited', handleEvent);
        socket.on('message:deleted', handleEvent);
        socket.on('match:new', handleEvent);
        socket.on('shoutout:received', handleEvent);
        socket.on('shoutout:replied', handleEvent);

        return () => {
            socket.off('message:new', handleEvent);
            socket.off('message:edited', handleEvent);
            socket.off('message:deleted', handleEvent);
            socket.off('match:new', handleEvent);
            socket.off('shoutout:received', handleEvent);
            socket.off('shoutout:replied', handleEvent);
        };
    }, [socket, myId, queryClient]);
}

function increaseUnreadCount(queryClient: ReturnType<typeof useQueryClient>, queryKey: QueryKey) {
    queryClient.setQueryData<NotificationsUnreadCountResponseDto | ChatUnreadCountResponseDto>(queryKey, (old) => ({
        unreadCount: (old?.unreadCount ?? 0) + 1
    }));
}
