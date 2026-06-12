"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, type ReactNode, useContext, useEffect } from "react";
import { useMe } from "@/hooks/users/use-me";
import type { ProfileStatusResponseDto } from "../../services/model";

interface AuthContextType {
  user: ProfileStatusResponseDto | null | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: user, isLoading, error } = useMe(pathname === "/login");

  useEffect(() => {
    if (isLoading || error || !user) return;

    if (!user.isComplete && pathname !== "/profile-setup") {
      router.replace("/profile-setup");
      return;
    }
  }, [user, isLoading, error, pathname, router]);
  return (
    <AuthContext.Provider
      value={{ user, isLoading, error: error as Error | null }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
