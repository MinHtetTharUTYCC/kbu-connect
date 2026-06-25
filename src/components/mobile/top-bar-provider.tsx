'use client';

import {
    createContext,
    type ReactNode,
    useContext,
    useLayoutEffect,
    useRef,
    useState,
} from 'react';
import { TopBar } from './app-chrome';

type TopBarConfig = {
    title?: string;
    action?: ReactNode;
    backHref?: string;
};

const TopBarContext = createContext<React.Dispatch<
    React.SetStateAction<TopBarConfig>
> | null>(null);

export function TopBarProvider({ children }: { children: ReactNode }) {
    const [config, setConfig] = useState<TopBarConfig>({});

    return (
        <TopBarContext.Provider value={setConfig}>
            <TopBar {...config} />
            {children}
        </TopBarContext.Provider>
    );
}

export function useTopBar(config: TopBarConfig) {
    const setConfig = useContext(TopBarContext);
    if (!setConfig)
        throw new Error('useTopBar must be used within TopBarProvider');

    const actionRef = useRef(config.action);
    actionRef.current = config.action;

    useLayoutEffect(() => {
        setConfig({
            title: config.title,
            backHref: config.backHref,
            action: actionRef.current,
        });
        return () => setConfig({});
    }, [config.title, config.backHref, setConfig]);
}
