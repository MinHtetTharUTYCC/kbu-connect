import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';
import { MobileScreen } from '@/components/mobile/app-chrome';
import { TopBarProvider } from '@/components/mobile/top-bar-provider';
import Providers from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import BottomNav from '@/components/web/bottom-nav';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono'
});

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn('antialiased', jetbrainsMono.variable, 'font-sans', inter.variable)}>
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
