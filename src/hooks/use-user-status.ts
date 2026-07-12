import { useCallback, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';

interface UserStatus {
    isOnline: boolean;
}

export function useUserStatus(socket: Socket | null) {
    const [statuses, setStatuses] = useState<Map<string, UserStatus>>(new Map());
    const statusesRef = useRef(statuses);
    statusesRef.current = statuses;

    useEffect(() => {
        if (!socket) return;

        function handleStatusChange(data: { type: 'USER_ONLINE' | 'USER_OFFLINE'; userId: string }) {
            setStatuses((prev) => {
                const next = new Map(prev);
                next.set(data.userId, { isOnline: data.type === 'USER_ONLINE' });
                return next;
            });
        }

        socket.on('userStatusChanged', handleStatusChange);

        return () => {
            socket.off('userStatusChanged', handleStatusChange);
        };
    }, [socket]);

    const getOnlineStatus = useCallback((userId: string): boolean => {
        return statusesRef.current.get(userId)?.isOnline ?? false;
    }, []);

    const onlineUserIds = useCallback(() => {
        const ids: string[] = [];
        statusesRef.current.forEach((status, userId) => {
            if (status.isOnline) ids.push(userId);
        });
        return ids;
    }, []);

    return { statuses, getOnlineStatus, onlineUserIds };
}
