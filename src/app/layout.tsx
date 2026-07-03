import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import BottomNav from '@/components/web/bottom-nav';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                'antialiased',
                fontMono.variable,
                'font-sans',
                geist.variable,
            )}
        >
            <body className="flex flex-col h-dvh">
                <Providers>
                    <main className="flex-1 flex flex-col overflow-hidden min-h-0">
                        {children}
                    </main>
                    <BottomNav />
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
