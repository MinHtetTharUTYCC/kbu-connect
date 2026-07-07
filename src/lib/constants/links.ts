export type NavItem = {
    href: string;
    label: string;
    icon: 'search' | 'heart' | 'message' | 'bell' | 'user' | 'home';
};

export const userLinks: NavItem[] = [
    { href: '/discover', label: 'Discover', icon: 'search' },
    { href: '/matches', label: 'Matches', icon: 'heart' },
    { href: '/chats', label: 'Chats', icon: 'message' },
    { href: '/notifications', label: 'Notifications', icon: 'bell' },
    { href: '/profile/me', label: 'Profile', icon: 'user' }
];

export const adminLinks: NavItem[] = [
    { href: '/admin', label: 'Dashboard', icon: 'home' },
    { href: '/admin/users', label: 'Users', icon: 'user' }
];
