import { useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import { useAuthStore } from '@/stores/auth-store';

export function useSocket() {
    const token = useAuthStore((s) => s.accessToken);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!token) {
            disconnectSocket();
            socketRef.current = null;
            setIsConnected(false);
            return;
        }

        const s = connectSocket(token);
        socketRef.current = s;

        function onConnect() {
            setIsConnected(true);
        }
        function onDisconnect() {
            setIsConnected(false);
        }

        s.on('connect', onConnect);
        s.on('disconnect', onDisconnect);

        if (s.connected) setIsConnected(true);

        return () => {
            s.off('connect', onConnect);
            s.off('disconnect', onDisconnect);
            disconnectSocket();
            socketRef.current = null;
            setIsConnected(false);
        };
    }, [token]);

    return { socket: socketRef.current, isConnected };
}
