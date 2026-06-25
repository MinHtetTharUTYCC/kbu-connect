import Link from 'next/link';
import { Button } from '../ui/button';

const links: Array<{ href: string; label: string }> = [
    {
        href: '/login',
        label: 'Login',
    },
    {
        href: '/profile/me',
        label: 'My Profile',
    },
    {
        href: '/profile/123',
        label: 'Profile Id Page',
    },
    {
        href: '/chats/123',
        label: 'Chat Id Page',
    },
    {
        href: '/chats',
        label: 'Chat Page',
    },
    {
        href: '/discover',
        label: 'Discover Page',
    },
    {
        href: '/profilesetup',
        label: 'Profile Setup Page',
    },
    {
        href: '/matches',
        label: 'Matches Page',
    },
    {
        href: '/notification',
        label: 'Notification Page',
    },
    {
        href: '/demo',
        label: 'Demo Page',
    },
];

export default function AllLinks() {
    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col">
            {links.map((link) => (
                <Button key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                </Button>
            ))}
        </div>
    );
}
