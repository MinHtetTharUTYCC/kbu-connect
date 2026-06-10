import { Home, User, Bookmark, Send, Search, LucideIcon, Bell } from 'lucide-react';

export type NavItem = {
    href: string;
    label: string;
    icon: LucideIcon;
};

export const userLinks: NavItem[] = [
    { href: '/', label: 'Discover', icon: Search },
    { href: '/matches', label: 'Saved', icon: Bookmark },
    { href: '/chats', label: 'Chats', icon: Send },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/profile', label: 'Profile', icon: User },
];

export const adminLinks: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: User },
];
