'use client';

import { Bell, Heart, Home, MessageCircle, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { userLinks } from '@/lib/constants/links';
import { publicRoutes } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { useAuthContext } from '../auth-provider';

const iconMap = {
    search: Search,
    heart: Heart,
    message: MessageCircle,
    bell: Bell,
    user: User,
    home: Home
};

const HIDDEN_ON_PATHS = [...publicRoutes.slice(1), '/chats/', '/profile-setup', '/profile/me/blocked'];

export default function BottomNav() {
    const pathname = usePathname();

    const { user, isLoading } = useAuthContext();
    // const { unreadCount } = useChatUnreadCount(!!user && !isLoading);

    const navItems = !isLoading && user ? userLinks : [];

    const isHidden = HIDDEN_ON_PATHS.some((path) => pathname.startsWith(path) || pathname === '/');

    if (isHidden || isLoading || !user) return null;

    return (
        <nav className="sticky bottom-0 z-50 h-16 border-t border-black/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
            <ul className="flex h-full items-center justify-around">
                {navItems.map(({ label, href, icon }) => {
                    const IconComponent = iconMap[icon];
                    return (
                        <li key={href}>
                            <Link
                                href={href}
                                className={cn(
                                    'flex min-w-12 flex-col items-center gap-1 px-2 py-2 text-[10px] font-medium transition-colors',
                                    pathname === href || (href !== '/discover' && pathname.startsWith(href))
                                        ? 'text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                <div className="relative">
                                    <IconComponent size={22} strokeWidth={pathname === href ? 2.5 : 2} />
                                </div>
                                <span>{label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
