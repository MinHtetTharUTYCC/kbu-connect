'use client';

import { useState } from 'react';

export function useChatState() {
    const [showChatDeleteConfirm, setShowChatDeleteConfirm] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [deleteMessageTargetId, setDeleteMessageTargetId] = useState<string | null>(null);

    const isEditing = editingMessageId !== null;

    function handleStartEdit(messageId: string, content: string) {
        setEditingMessageId(messageId);
        setEditingContent(content);
    }

    function handleCancelEdit() {
        setEditingMessageId(null);
        setEditingContent('');
    }

    return {
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
    };
}
