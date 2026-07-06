'use client';

import type { MessageItemDto } from '@services/model';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getFormattedDate } from '@/lib/date/format-date';
import { cn } from '@/lib/utils';

type MessageProps = {
    message: MessageItemDto;
    myId: string;
    onEdit: (id: string, content: string) => void;
    onDeleteTrigger: (id: string) => void;
    showTimestamp: boolean;
    isEditing?: boolean;
};

export default function Message({ message, myId, onEdit, onDeleteTrigger, showTimestamp, isEditing = false }: MessageProps) {
    const mine = message.senderId === myId;
    const [menuOpen, setMenuOpen] = useState(false);

    function handleDelete() {
        setMenuOpen(false);
        onDeleteTrigger(message.id);
    }

    return (
        <div className={cn('flex max-w-[85%] flex-col', mine ? 'self-end items-end' : 'items-start')}>
            <div className="flex items-end gap-1">
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                    <DropdownMenuTrigger
                        disabled={isEditing}
                        className="grid size-6 shrink-0 place-items-center rounded-full bg-white shadow-md hover:bg-black/5 mb-1"
                    >
                        <MoreVertical className="size-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {mine && (
                            <DropdownMenuItem onClick={() => onEdit(message.id, message.content)} disabled={isEditing}>
                                <Pencil className="size-4" />
                                Edit
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-500" onClick={handleDelete}>
                            <Trash className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div
                    className={cn(
                        'rounded-xl p-3 text-sm leading-6 whitespace-pre-wrap',
                        mine ? 'rounded-tr-none bg-primary text-white' : 'rounded-tl-none border border-black/10 bg-muted',
                        isEditing && 'ring-2 ring-primary/50'
                    )}
                >
                    {message.content}
                </div>
            </div>
            {showTimestamp && <span className="mt-1 px-1 text-[10px] text-muted-foreground">{getFormattedDate(message.timestamp)}</span>}
        </div>
    );
}
