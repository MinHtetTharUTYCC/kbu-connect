import { MobileScreen } from '@/components/mobile/app-chrome';
import { TopBarProvider } from '@/components/mobile/top-bar-provider';

export default function WebLayout({ children }: { children: React.ReactNode }) {
    return (
        <TopBarProvider>
            <MobileScreen className="flex-1 min-h-0 overflow-hidden">
                {children}
            </MobileScreen>
        </TopBarProvider>
    );
}
