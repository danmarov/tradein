import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

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

export async function GET(request: NextRequest) {
  const defaultState = {
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
      return NextResponse.json(defaultState);
    }

    if (!accessToken) {
      return NextResponse.json(defaultState);
    }

    const { user, newTokens } = await validateAuth(accessToken, refreshToken);

    if (user) {
      const response = NextResponse.json({
        isAuthenticated: true,
        isLoading: false,
        user,
        accessToken: newTokens?.access_token || accessToken,
        refreshToken: newTokens?.refresh_token || refreshToken,
        error: null,
      });

      if (newTokens) {
        response.cookies.set("access_token", newTokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge:
            parseInt(process.env.ACCESS_MAX_AGE_SECONDS || "0") || 24 * 60 * 60,
          path: "/",
        });

        response.cookies.set("refresh_token", newTokens.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge:
            parseInt(process.env.REFRESH_MAX_AGE_SECONDS || "0") ||
            7 * 24 * 60 * 60,
          path: "/",
        });
      }

      return response;
    } else {
      const response = NextResponse.json({
        ...defaultState,
        error: {
          code: "INVALID_TOKEN",
          message: "Session expired",
        },
      });

      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");

      return response;
    }
  } catch (error) {
    return NextResponse.json({
      ...defaultState,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });
  }
}
