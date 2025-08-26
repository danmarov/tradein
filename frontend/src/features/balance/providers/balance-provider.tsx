// features/balance/providers/balance-provider.tsx
"use client";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BalanceData } from "../model";

export const balanceQueryKeys = {
  all: ["balance"] as const,
  current: () => [...balanceQueryKeys.all, "current"] as const,
} as const;

interface BalanceContextType {
  balance: BalanceData | null;
  isLoading: boolean;
  error: Error | null;
  refetchBalance: () => Promise<void>;
  invalidateBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
  children: React.ReactNode;
  initialBalance: BalanceData | null;
}

async function fetchBalance(): Promise<BalanceData> {
  const response = await fetch("/api/balance", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch balance");
  }

  return response.json();
}

export function BalanceProvider({
  children,
  initialBalance,
}: BalanceProviderProps) {
  const queryClient = useQueryClient();

  const {
    data: balance,
    isLoading,
    error,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: balanceQueryKeys.current(),
    queryFn: fetchBalance,
    initialData: initialBalance,
    enabled: !!initialBalance, // запрашиваем только если есть изначальные данные
    staleTime: 30 * 1000, // 30 секунд - баланс может меняться
    retry: 2,
  });

  const contextValue: BalanceContextType = {
    balance: balance || initialBalance,
    isLoading,
    error,
    refetchBalance: async () => {
      await refetchBalance();
    },
    invalidateBalance: async () => {
      await queryClient.invalidateQueries({
        queryKey: balanceQueryKeys.all,
      });
    },
  };

  return (
    <BalanceContext.Provider value={contextValue}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance(): BalanceContextType {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
}
