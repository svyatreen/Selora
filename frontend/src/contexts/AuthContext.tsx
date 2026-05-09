import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetMe, getGetMeQueryKey } from "@/api";
import { setAuthTokenGetter } from "@/api/custom-fetch";
import type { User } from "@/api/generated/api.schemas";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem("token");
    if (saved) setAuthTokenGetter(() => saved);
    return saved;
  });
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(!localStorage.getItem("token"));
  const queryClient = useQueryClient();

  const { data: meData, isLoading, isError } = useGetMe({
    query: {
      enabled: !!token,
      queryKey: getGetMeQueryKey(),
      retry: false,
    },
  });

  useEffect(() => {
    if (meData) {
      setUser(meData);
      setIsInitialized(true);
    }
  }, [meData]);

  useEffect(() => {
    if (isError) {
      setIsInitialized(true);
    }
  }, [isError]);

  useEffect(() => {
    if (!token) {
      setIsInitialized(true);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setAuthTokenGetter(() => token);
    } else {
      localStorage.removeItem("token");
      setAuthTokenGetter(null);
    }
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setAuthTokenGetter(() => newToken);
    setToken(newToken);
    setUser(newUser);
    setIsInitialized(true);
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthTokenGetter(null);
    setToken(null);
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "ADMIN",
        isLoading: !isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
