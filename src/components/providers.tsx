'use client';

import { MutationCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { handleBackendError } from '@/lib/error/error-util';
import { AuthProvider } from './auth-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        retry: 1
                    }
                },
                mutationCache: new MutationCache({
                    onError: (error, _variables, _context, mutation) => {
                        console.error(error);

                        // Check if the specific hook wants to skip global handling
                        if (mutation.meta?.skipGlobalToast) {
                            return;
                        }

                        // Fall back to your standard error toast
                        handleBackendError(error);
                    }
                })
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
