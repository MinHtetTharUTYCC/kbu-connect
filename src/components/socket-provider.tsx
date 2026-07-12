'use client';

import { createContext, type ReactNode, useContext } from 'react';
import { useSocket } from '@/hooks/use-socket';

interface SocketContextType {
    socket: import('socket.io-client').Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export function SocketProvider({ children }: { children: ReactNode }) {
    const { socket, isConnected } = useSocket();

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
}

export function useSocketContext() {
    return useContext(SocketContext);
}
