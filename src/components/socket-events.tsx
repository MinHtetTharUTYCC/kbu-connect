'use client';

import { useSocketEvents } from '@/hooks/use-socket-events';

export function SocketEvents() {
    useSocketEvents();
    return null;
}
