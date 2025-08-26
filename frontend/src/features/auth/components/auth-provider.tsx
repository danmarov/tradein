"use client";

import React, { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AuthState, LoginRequest, AuthError } from "../model/types";
import { UserProfile } from "@/entities/user/model";
import { useRouter } from "next/navigation";

export const authQueryKeys = {
  all: ["auth"] as const,
  user: () => [...authQueryKeys.all, "user"] as const,
} as const;

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  isLoading: boolean;
  error: AuthError | null;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  invalidateAuth: () => Promise<void>;
  clearError: () => void;
  loginWithSteam: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  initialAuthData: AuthState;
}

const authApi = {
  async getCurrentUser(): Promise<UserProfile> {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("UNAUTHORIZED");
      }
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data.user;
  },

  async login(request: LoginRequest): Promise<{ user: UserProfile }> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Login failed");
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }
  },
};

export function AuthProvider({ children, initialAuthData }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  React.useEffect(() => {
    if (initialAuthData.needsCookieUpdate) {
      fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialAuthData.needsCookieUpdate),
        credentials: "include",
      })
        .then((response) => {
          if (response.ok) {
          }
        })
        .catch((err) => {});
    }
  }, [initialAuthData.needsCookieUpdate]);

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authQueryKeys.user(),
    queryFn: authApi.getCurrentUser,
    enabled: false,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.message === "UNAUTHORIZED") return false;
      return failureCount < 2;
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      router.refresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      router.refresh();
    },
  });

  const currentUser = user || initialAuthData.user;
  const isAuthenticated = !!currentUser && !userError;
  const isLoading =
    isUserLoading || loginMutation.isPending || logoutMutation.isPending;

  const error: AuthError | null = React.useMemo(() => {
    if (loginMutation.error) {
      return {
        code: "STEAM_AUTH_FAILED",
        message: loginMutation.error.message,
      };
    }

    if (logoutMutation.error) {
      return {
        code: "NETWORK_ERROR",
        message: logoutMutation.error.message,
      };
    }

    if (userError) {
      if (userError.message === "UNAUTHORIZED") {
        return {
          code: "INVALID_TOKEN",
          message: "Session expired",
        };
      }

      return {
        code: "NETWORK_ERROR",
        message: userError.message,
      };
    }

    return null;
  }, [loginMutation.error, logoutMutation.error, userError]);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user: currentUser,
    isLoading,
    error,

    login: async (request: LoginRequest) => {
      await loginMutation.mutateAsync(request);
    },

    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    loginWithSteam: () => {
      // router.push("/api/auth/steam/login");
      window.location.href = "/api/auth/steam/login";
    },

    refetchUser: async () => {
      await refetchUser();
    },

    invalidateAuth: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
    },

    clearError: () => {
      loginMutation.reset();
      logoutMutation.reset();
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
