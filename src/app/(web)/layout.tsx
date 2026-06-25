import { MobileScreen } from "@/components/mobile/app-chrome";
import { TopBarProvider } from "@/components/mobile/top-bar-provider";

export default function WebLayout({ children }: { children: React.ReactNode }) {
    return (
        <TopBarProvider>
            <MobileScreen className="h-full min-h-0">{children}</MobileScreen>
        </TopBarProvider>
    );
}
