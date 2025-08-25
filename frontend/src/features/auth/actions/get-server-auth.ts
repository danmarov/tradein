import { cookies } from "next/headers";
import type { AuthState } from "../model/types";
import { cache } from "react";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

async function validateAuth(accessToken: string, refreshToken?: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.ok) {
      const userData = await response.json();
      return { user: userData, newTokens: null };
    }

    if (refreshToken) {
      const refreshResponse = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        const userResponse = await fetch(`${BACKEND_URL}/users/me`, {
          headers: { Authorization: `Bearer ${refreshData.access_token}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          return {
            user: userData,
            newTokens: {
              access_token: refreshData.access_token,
              refresh_token: refreshData.refresh_token,
            },
          };
        }
      }
    }

    return { user: null, newTokens: null };
  } catch (error) {
    return { user: null, newTokens: null };
  }
}

export async function _getServerAuth(): Promise<AuthState> {
  const defaultState: AuthState = {
    isAuthenticated: false,
    isLoading: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    error: null,
  };

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!accessToken && !refreshToken) {
      return defaultState;
    }

    if (!accessToken) {
      return defaultState;
    }

    const { user, newTokens } = await validateAuth(accessToken, refreshToken);

    if (user) {
      if (newTokens) {
        try {
          cookieStore.set("access_token", newTokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60,
            path: "/",
          });

          cookieStore.set("refresh_token", newTokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
            path: "/",
          });
        } catch (cookieError) {
          return {
            ...defaultState,
            isAuthenticated: true,
            user,
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
            error: null,
            needsCookieUpdate: newTokens,
          };
        }
      }

      return {
        isAuthenticated: true,
        isLoading: false,
        user,
        accessToken: newTokens?.access_token || accessToken,
        refreshToken: newTokens?.refresh_token || refreshToken,
        error: null,
      };
    } else {
      return {
        ...defaultState,
        error: {
          code: "INVALID_TOKEN",
          message: "Session expired",
        },
      };
    }
  } catch (error) {
    return defaultState;
  }
}

export const getServerAuth = cache(_getServerAuth);
