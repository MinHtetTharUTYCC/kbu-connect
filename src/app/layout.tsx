import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import BottomNav from '@/components/bottom-nav';
import { MobileScreen } from '@/components/mobile/app-chrome';
import { TopBarProvider } from '@/components/mobile/top-bar-provider';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono'
});

export const metadata: Metadata = {
    title: 'KBU Connect',
    description: 'Connect with KBU students',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'KBU Connect'
    },
    formatDetection: {
        telephone: false
    }
};

export const viewport: Viewport = {
    themeColor: '#1a1a1a',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn('antialiased', jetbrainsMono.variable, 'font-sans', inter.variable)}>
            <head>
                <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
            </head>
            <body className="flex flex-col h-dvh">
                <Providers>
                    <MobileScreen>
                        <TopBarProvider>
                            <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-white">{children}</main>
                        </TopBarProvider>
                        <BottomNav />
                    </MobileScreen>
                </Providers>
                <Toaster />
            </body>
        </html>
    );
}
