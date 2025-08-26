// features/auth/hooks/use-auth.ts
"use client";

import { useAuthContext } from "../components/auth-provider";
import { UserProfile } from "@/entities/user/model";

/**
 * Основной хук для работы с авторизацией
 * Предоставляет все необходимые данные и методы
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Хук для получения только пользовательских данных
 * Полезен когда нужен только user объект
 */
export function useUser(): UserProfile | null {
  const { user } = useAuthContext();
  return user;
}

/**
 * Хук для проверки статуса авторизации
 * Возвращает булевы значения для удобной проверки
 */
export function useAuthStatus() {
  const { isAuthenticated, isLoading, error } = useAuthContext();

  return {
    isAuthenticated,
    isLoading,
    hasError: !!error,
    error,
    // Комбинированные состояния
    isAuthenticating: isLoading,
    isUnauthenticated: !isAuthenticated && !isLoading,
    isReady: !isLoading, // данные загружены (авторизован или нет)
  };
}

/**
 * Хук для управления авторизацией
 * Содержит только действия, без состояния
 */
export function useAuthActions() {
  const { login, logout, clearError, loginWithSteam } = useAuthContext();

  return {
    login,
    logout,
    loginWithSteam,
    clearError,
  };
}

/**
 * Хук для работы с балансом пользователя
 */
export function useUserBalance() {
  const { user } = useAuthContext();

  return {
    balance: user?.balance || 0,
    currency: "USD",

    // Форматирование
    formatBalance: (amount?: number) => {
      const balance = amount ?? user?.balance ?? 0;
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(balance);
    },
  };
}

/**
 * Хук для условного рендеринга в зависимости от авторизации
 */
export function useAuthRender() {
  const { isAuthenticated, isLoading, user } = useAuthContext();

  return {
    whenAuthenticated: (component: React.ReactNode) =>
      isAuthenticated && !isLoading ? component : null,

    whenUnauthenticated: (component: React.ReactNode) =>
      !isAuthenticated && !isLoading ? component : null,

    whenLoading: (component: React.ReactNode) => (isLoading ? component : null),

    // Функциональный подход с типизацией
    render: (options: {
      authenticated?: (user: UserProfile) => React.ReactNode;
      unauthenticated?: () => React.ReactNode;
      loading?: () => React.ReactNode;
    }) => {
      if (isLoading && options.loading) {
        return options.loading();
      }

      if (isAuthenticated && user && options.authenticated) {
        return options.authenticated(user);
      }

      if (!isAuthenticated && !isLoading && options.unauthenticated) {
        return options.unauthenticated();
      }

      return null;
    },
  };
}

/**
 * Хук для проверки ролей/разрешений
 */
export function usePermissions() {
  const { isAuthenticated, user } = useAuthContext();

  return {
    canTrade: isAuthenticated && user?.balance !== undefined,
    canWithdraw: isAuthenticated && (user?.balance || 0) > 0,
    canDeposit: isAuthenticated,

    // Функция для проверки кастомных разрешений
    hasPermission: (permission: string) => {
      // Здесь можно добавить логику проверки ролей
      return isAuthenticated;
    },
  };
}
