'use client';

import { cn } from '@/lib/utils';
import Link from 'next/dist/client/link';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '../auth-provider';
import { userLinks } from '@/lib/constants/links';

const HIDDEN_ON_PATHS = ['/login', '/chats/'];

export default function BottomNav() {
    const pathname = usePathname();

    const { user, isLoading } = useAuthContext();
    // const { unreadCount } = useChatUnreadCount(!!user && !isLoading);

    const navItems = !isLoading && user ? userLinks : [];

    const isHidden = HIDDEN_ON_PATHS.some((path) => pathname.startsWith(path));

    if (isHidden || isLoading) return null;

    return (
        <nav className="h-16 border-t bg-muted md:hidden pb-[env(safe-area-inset-bottom)]">
            <ul className="flex h-full items-center justify-around">
                {navItems.map(({ label, href, icon: Icon }) => (
                    <li key={href}>
                        <Link
                            href={href}
                            className={cn(
                                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                                pathname === href ? 'text-purple-500' : 'text-gray-400',
                            )}
                        >
                            <div className="relative">
                                <Icon size={22} />

                                {/* TODO: handle count */}
                                {href === '/chats' && (
                                    <span className="absolute -top-1.5 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white leading-none">
                                        {0}
                                    </span>
                                )}
                            </div>
                            <span>{label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
