'use client';

import { createContext, useContext, ReactNode } from 'react';
import { ProfileStatusResponseDto } from '../../services/model';
import { useMe } from '@/hooks/users/use-me';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
    user: ProfileStatusResponseDto | null | undefined;
    isLoading: boolean;
    error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    const { data: user, isLoading, error } = useMe(pathname === '/login');

    if (!isLoading && !error && user && !user.isComplete) {
        router.replace('/profile-setup');
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, error: error as Error | null }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
}
