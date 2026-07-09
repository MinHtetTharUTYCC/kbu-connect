'use client';

import { type NotificationItemDto, NotificationItemDtoType } from '@services/model';
import { Bell, Heart, Megaphone, MessageCircle, X } from 'lucide-react';
import { VisuallyHidden } from 'radix-ui';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { getFormattedDate } from '@/lib/date/format-date';

export function NotificationDetailSheet({ notification, onClose }: { notification: NotificationItemDto | null; onClose: () => void }) {
    const Icon = getDetailIcon(notification?.type);

    return (
        <Drawer open={!!notification} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent
                aria-describedby={undefined}
                aria-hidden="false"
                className="mx-auto max-h-[85vh] w-full max-w-[430px] flex-col overflow-hidden"
            >
                <VisuallyHidden.Root>
                    <DrawerTitle>Notification Details</DrawerTitle>
                </VisuallyHidden.Root>
                <div className="flex items-center justify-between px-5 py-2">
                    <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/20 text-primary">
                            <Icon className="size-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold">{notification?.title}</h2>
                            <span className="text-xs text-muted-foreground">
                                {notification?.createdAt ? getFormattedDate(notification.createdAt) : ''}
                            </span>
                        </div>
                    </div>
                    <DrawerClose asChild>
                        <button
                            type="button"
                            className="shrink-0 grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-black/5"
                            aria-label="Close"
                        >
                            <X className="size-5" />
                        </button>
                    </DrawerClose>
                </div>
                <div className="flex-1 overflow-y-auto px-5 pt-2 py-6">
                    {notification?.body && (
                        <p className="text-sm leading-6 text-foreground border-b border-black/10">{notification.body}</p>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function getDetailIcon(type?: NotificationItemDto['type']) {
    if (type === NotificationItemDtoType.NEW_MATCH) return Heart;
    if (type === NotificationItemDtoType.NEW_MESSAGE) return MessageCircle;
    if (type === NotificationItemDtoType.SHOUTOUT_RECEIVED || type === NotificationItemDtoType.SHOUTOUT_REPLIED) return Megaphone;
    return Bell;
}
