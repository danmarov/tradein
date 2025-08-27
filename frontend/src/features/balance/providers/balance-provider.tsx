// features/balance/providers/balance-provider.tsx
"use client";
import { createContext, useContext } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { BalanceData } from "../model";

export const balanceQueryKeys = {
  all: ["balance"] as const,
  current: () => [...balanceQueryKeys.all, "current"] as const,
} as const;

interface CreateInvoiceData {
  amount: number;
  payment_method: "card" | "crypto" | "paypal";
  currency?: string;
}

interface DepositResponse {
  id: string;
  amount: number;
  currency: string;
  payment_url: string;
  status: string;
  created_at: string;
}

interface BalanceContextType {
  balance: BalanceData | null;
  isLoading: boolean;
  error: Error | null;
  refetchBalance: () => Promise<void>;
  invalidateBalance: () => Promise<void>;
  createInvoice: (data: CreateInvoiceData) => Promise<DepositResponse>;
  isCreatingInvoice: boolean;
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

async function createDepositInvoice(
  data: CreateInvoiceData,
): Promise<DepositResponse> {
  const response = await fetch("/api/balance/deposit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(errorData.error || "Failed to create invoice");
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
    enabled: !!initialBalance,
    staleTime: 30 * 1000,
    retry: 2,
    refetchOnWindowFocus: "always",
  });

  const createInvoiceMutation = useMutation({
    mutationFn: createDepositInvoice,
    onSuccess: () => {
      // После успешного создания инвойса можно обновить баланс
      queryClient.invalidateQueries({
        queryKey: balanceQueryKeys.all,
      });
    },
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
    createInvoice: async (data: CreateInvoiceData) => {
      return createInvoiceMutation.mutateAsync(data);
    },
    isCreatingInvoice: createInvoiceMutation.isPending,
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
