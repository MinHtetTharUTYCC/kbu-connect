'use client';

import { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Socket } from 'socket.io-client';
import { useSocket } from '@/hooks/use-socket';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const { socket, isConnected } = useSocket();

    const value = useMemo(() => ({ socket, isConnected }), [socket, isConnected]);

    return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
    return useContext(SocketContext);
}
