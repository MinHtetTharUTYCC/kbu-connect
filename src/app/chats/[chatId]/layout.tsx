import type { ReactNode } from 'react';

export default function ChatLayout({ children }: { children: ReactNode }) {
    return <div className="flex flex-1 flex-col min-h-0 overflow-hidden">{children}</div>;
}
