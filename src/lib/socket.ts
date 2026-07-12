import { io, type Socket } from 'socket.io-client';
import { publicApiUrl } from './constants/app.config';

let socket: Socket | null = null;

export function connectSocket(token: string): Socket {
    if (socket?.connected) return socket;

    socket = io(publicApiUrl ?? '', {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        autoConnect: false
    });

    socket.on('connect', () => {
        console.log('[WS] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('[WS] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
        console.error('[WS] Connection error:', err.message);
    });

    socket.connect();
    return socket;
}

export function disconnectSocket() {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}

export function getSocket(): Socket | null {
    return socket;
}
