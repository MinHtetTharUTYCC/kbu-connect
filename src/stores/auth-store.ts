import { create } from 'zustand';

interface AuthStore {
    accessToken: string | null;
    pendingEmail: string | null; // holds email between OTP steps

    setToken: (accessToken: string) => void;

    setPendingEmail: (email: string) => void;
    clearPendingEmail: () => void;

    logout: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
    accessToken: null,
    pendingEmail: null,

    setToken: (accessToken) =>
        set(() => ({
            accessToken,
        })),

    setPendingEmail: (email) => set({ pendingEmail: email }),
    clearPendingEmail: () => set({ pendingEmail: null }),

    logout: () => set({ accessToken: null, pendingEmail: null }),
}));
