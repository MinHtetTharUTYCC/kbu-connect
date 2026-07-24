'use client';

import { createContext, type ReactNode, useContext, useLayoutEffect, useState } from 'react';
import { TopBar } from './app-chrome';

type TopBarConfig = {
    title?: string;
    action?: ReactNode;
    canBack?: boolean;
};

const TopBarContext = createContext<React.Dispatch<React.SetStateAction<TopBarConfig>> | null>(null);

export function TopBarProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<TopBarConfig>({});

    const hasConfig = config.title || config.action || config.canBack !== undefined;

    return (
        <TopBarContext.Provider value={setConfig}>
            {hasConfig && <TopBar title={config.title} action={config.action} canBack={config.canBack ?? true} />}
            {children}
        </TopBarContext.Provider>
    );
}

export function useTopBar(config: TopBarConfig) {
    const setConfig = useContext(TopBarContext);
    if (!setConfig) throw new Error('useTopBar must be used within TopBarProvider');

    useLayoutEffect(() => {
        setConfig({
            title: config.title,
            action: config.action,
            canBack: config.canBack
        });
        return () => setConfig({});
    }, [config.title, config.action, config.canBack, setConfig]);
}
