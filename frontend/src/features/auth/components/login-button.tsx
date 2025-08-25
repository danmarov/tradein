"use client";

import React from "react";
import { useAuth } from "../hooks/use-auth";
import type { LoginRequest } from "../model/types";

interface LoginButtonProps {
  children: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;

  steamId?: string;
  steamTicket?: string;

  onLoginStart?: () => void;
  onLoginSuccess?: () => void;
  onLoginError?: (error: Error) => void;

  disabled?: boolean;
  showLoadingState?: boolean;
}

export function LoginButton({
  children,
  steamId = "76561198000000000",
  steamTicket = "test_ticket_123",
  onLoginStart,
  onLoginSuccess,
  onLoginError,
  disabled = false,
  showLoadingState = true,
}: LoginButtonProps) {
  const { login, isLoading, isAuthenticated } = useAuth();

  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const originalOnClick = children.props.onClick;
    originalOnClick?.(e);

    if (isAuthenticated) {
      return;
    }

    if (disabled || isLoading) {
      return;
    }

    try {
      onLoginStart?.();

      const loginRequest: LoginRequest = {
        steam_id: steamId,
        steam_ticket: steamTicket,
      };

      await login(loginRequest);

      onLoginSuccess?.();
    } catch (error) {
      const loginError =
        error instanceof Error ? error : new Error("Login failed");
      onLoginError?.(loginError);
    }
  };

  const isButtonDisabled = disabled || isLoading || isAuthenticated;
  const buttonText = React.useMemo(() => {
    if (isAuthenticated) return "Already logged in";
    if (isLoading && showLoadingState) return "Logging in...";
    return children.props.children || "Login";
  }, [isAuthenticated, isLoading, showLoadingState, children.props.children]);

  const buttonWithHandlers = React.cloneElement(children, {
    onClick: handleLogin,
    disabled: isButtonDisabled,

    ...(showLoadingState && {
      children: buttonText,
    }),

    className: `${children.props.className || ""} ${
      isLoading ? "opacity-75 cursor-not-allowed" : ""
    } ${isAuthenticated ? "opacity-50" : ""}`.trim(),
  });

  return buttonWithHandlers;
}

/**
 * Простая кнопка логина с дефолтным стилем
 */
export function SimpleLoginButton({
  className = "",
  ...props
}: Omit<LoginButtonProps, "children"> & { className?: string }) {
  return (
    <LoginButton {...props}>
      <button
        className={`rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 ${className}`}
      >
        Login via Steam
      </button>
    </LoginButton>
  );
}

/**
 * Кнопка логина с иконкой Steam
 */
export function SteamLoginButton({
  className = "",
  ...props
}: Omit<LoginButtonProps, "children"> & { className?: string }) {
  return (
    <LoginButton {...props}>
      <button
        className={`flex items-center gap-2 rounded bg-[#1b2838] px-4 py-2 text-white transition-colors hover:bg-[#2a475e] ${className}`}
      >
        <i className="fab fa-steam" />
        Sign in through Steam
      </button>
    </LoginButton>
  );
}
