'use client';

import { ArrowLeft, Ban, Bell, GraduationCap, Loader2, type LucideIcon, Megaphone, MessageCircle, Search, User, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn, initials } from '@/lib/utils';

export function MobileScreen({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cn('mx-auto flex w-full max-w-[430px] flex-col bg-white text-foreground', 'flex-1 min-h-0', className)}>
            {children}
        </div>
    );
}

export function TopBar({ title = 'UniMatch', action, canBack = true }: { title?: string; action?: ReactNode; canBack: boolean }) {
    const router = useRouter();

    const onBackClick = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white/90 px-5 backdrop-blur">
            <div className="flex min-w-0 items-center gap-2">
                {canBack ? (
                    <button
                        type="button"
                        onClick={onBackClick}
                        className="-ml-2 grid size-10 place-items-center text-primary"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="size-4" />
                    </button>
                ) : (
                    <GraduationCap className="size-6 text-primary" />
                )}
                <span className="truncate text-lg font-bold text-primary">{title}</span>
            </div>
            {action && action}
        </header>
    );
}

export function Avatar({ src, name, className }: { src?: string | null; name?: string | null; className?: string }) {
    return (
        <div
            className={cn(
                'relative grid shrink-0 place-items-center overflow-hidden rounded-full border border-black/10 bg-primary/10 text-sm font-bold text-primary',
                className
            )}
        >
            {src ? <Image src={src} alt={name || 'Profile'} fill sizes="96px" unoptimized className="object-cover" /> : initials(name)}
        </div>
    );
}

export function Chip({ children, active = false }: { children: ReactNode; active?: boolean }) {
    return (
        <span
            className={cn(
                'inline-flex h-7 shrink-0 items-center rounded-full border px-3 text-xs font-medium',
                active ? 'border-primary bg-primary text-white' : 'border-black/10 bg-muted text-muted-foreground'
            )}
        >
            {children}
        </span>
    );
}

const iconMap: Record<string, LucideIcon> = {
    graduation: GraduationCap,
    blocked: Ban,
    message: MessageCircle,
    search: Search,
    user: User,
    bell: Bell,
    shoutout: Megaphone,
    users: Users,
    loader: Loader2
};

export function EmptyState({ title, body, icon }: { title: string; body: string; icon: string }) {
    const Icon = iconMap[icon];

    return (
        <div className="mt-8 flex flex-1 flex-col items-center justify-center px-8 text-center">
            {Icon && (
                <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className={`size-6 ${icon === 'loader' ? 'animate-spin' : ''}`} />
                </div>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
        </div>
    );
}
