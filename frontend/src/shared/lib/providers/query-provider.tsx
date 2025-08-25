"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Создаем QueryClient с оптимальными настройками для auth
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Уменьшаем количество автоматических refetch для auth данных
        staleTime: 5 * 60 * 1000, // 5 минут
        gcTime: 10 * 60 * 1000, // 10 минут в кэше

        // Настройки для стабильности
        refetchOnWindowFocus: true, // обновляем при возврате в окно
        refetchOnReconnect: true, // обновляем при восстановлении интернета

        // Retry настройки
        retry: (failureCount, error) => {
          // Не ретраим auth ошибки
          if (
            error.message?.includes("401") ||
            error.message?.includes("UNAUTHORIZED")
          ) {
            return false;
          }
          return failureCount < 2;
        },

        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // Настройки для мутаций
        retry: 1,
        retryDelay: 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Сервер: всегда создаем новый query client
    return makeQueryClient();
  } else {
    // Браузер: создаем query client один раз
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools только в development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
        />
      )}
    </QueryClientProvider>
  );
}
