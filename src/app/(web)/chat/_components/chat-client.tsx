"use client";

import { PlusCircle, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/components/auth-provider";
import {
  Avatar,
  EmptyState,
  MobileScreen,
  TopBar,
} from "@/components/mobile/app-chrome";
import { useConversationMessages } from "@/hooks/chat/use-conversation-messages";
import { useConversationsList } from "@/hooks/chat/use-conversations-list";
import { useMarkConversationSeen } from "@/hooks/chat/use-mark-conversation-seen";
import { relativeTime } from "@/lib/profile-utils";
import { cn } from "@/lib/utils";
import type { MessageItemDto } from "../../../../../services/model";

export function ChatListClient() {
  const { conversations, isLoading } = useConversationsList(30);

  return (
    <MobileScreen>
      <TopBar title="Messages" />
      <main className="flex-1 overflow-y-auto">
        {isLoading ? (
          <EmptyState
            title="Loading messages"
            body="Fetching your conversations."
          />
        ) : conversations.length ? (
          conversations.map((conversation) => (
            <a
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className="flex items-center border-b border-black/10 px-5 py-4"
            >
              <Avatar
                src={conversation.otherUser.avatarUrl as string | null}
                name={conversation.otherUser.name}
                className="size-12"
              />
              <div className="ml-3 min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate font-semibold">
                    {conversation.otherUser.name}
                  </span>
                  <span className="text-xs text-[#6b6b6b]">
                    {relativeTime(conversation.updatedAt)}
                  </span>
                </div>
                <p className="truncate text-sm text-[#6b6b6b]">
                  {conversation.lastMessage?.content ?? "No messages yet."}
                </p>
              </div>
            </a>
          ))
        ) : (
          <EmptyState
            title="No conversations"
            body="Your real conversations will appear here after you match and message."
          />
        )}
      </main>
    </MobileScreen>
  );
}

export function ChatClient({ chatId }: { chatId: string }) {
  const { user } = useAuthContext();
  const messagesQuery = useConversationMessages(chatId);
  const { conversations, isLoading: conversationsLoading } =
    useConversationsList(30);
  const markSeen = useMarkConversationSeen();
  const [draft, setDraft] = useState("");
  const [localMessages, setLocalMessages] = useState<MessageItemDto[]>([]);
  const conversation = conversations.find((item) => item.id === chatId);
  const apiMessages = messagesQuery.messages;
  const messages = useMemo(
    () => [...apiMessages, ...localMessages],
    [apiMessages, localMessages],
  );
  const myId = user?.user?.id ?? "me";

  useEffect(() => {
    if (chatId && conversation && !conversation.isRead) {
      markSeen.mutate({ conversationId: chatId });
    }
  }, [chatId, conversation, markSeen.mutate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setLocalMessages((items) => [
      ...items,
      {
        id: `local-${Date.now()}`,
        content,
        senderId: myId,
        timestamp: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  if (conversationsLoading) {
    return (
      <MobileScreen>
        <TopBar title="Messages" backHref="/matches" />
        <EmptyState
          title="Loading conversation"
          body="Fetching the latest messages."
        />
      </MobileScreen>
    );
  }

  if (!conversation) {
    return (
      <MobileScreen>
        <TopBar title="Messages" backHref="/matches" />
        <EmptyState
          title="Conversation unavailable"
          body="This conversation was not returned by the API."
        />
      </MobileScreen>
    );
  }

  return (
    <MobileScreen>
      <TopBar
        title={conversation.otherUser.name}
        backHref="/matches"
        action={
          <Avatar
            src={conversation.otherUser.avatarUrl as string | null}
            name={conversation.otherUser.name}
            className="size-10"
          />
        }
      />
      <main className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-5 py-6">
        {messagesQuery.isLoading ? (
          <EmptyState
            title="Loading messages"
            body="Fetching message history."
          />
        ) : messages.length ? (
          messages.map((message) => {
            const mine = message.senderId === myId || message.senderId === "me";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-[85%] flex-col",
                  mine ? "self-end items-end" : "items-start",
                )}
              >
                <div
                  className={cn(
                    "rounded-xl p-3 text-sm leading-6",
                    mine
                      ? "rounded-tr-none bg-primary text-white"
                      : "rounded-tl-none border border-black/10 bg-[#f9f9f8]",
                  )}
                >
                  {message.content}
                </div>
                <span className="mt-1 px-1 text-[10px] text-[#6b6b6b]">
                  {relativeTime(message.timestamp)}
                </span>
              </div>
            );
          })
        ) : (
          <EmptyState
            title="No messages yet"
            body="Messages returned by the API will appear here."
          />
        )}
      </main>
      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-3 border-t border-black/10 bg-white px-5 py-3"
      >
        <button
          type="button"
          className="grid size-11 place-items-center text-primary"
          aria-label="Add attachment"
        >
          <PlusCircle className="size-6" />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message..."
          className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-[#f9f9f8] px-4 text-sm outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="grid size-11 place-items-center rounded-xl bg-primary text-white transition active:scale-95"
          aria-label="Send message"
        >
          <Send className="size-5" />
        </button>
      </form>
    </MobileScreen>
  );
}
