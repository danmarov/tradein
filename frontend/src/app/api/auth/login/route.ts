import { NextRequest, NextResponse } from "next/server";
import type { LoginRequest, LoginResponse } from "@/features/auth/model/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const loginData: LoginRequest = await request.json();

    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(
        {
          error: {
            code: errorData.error?.code || "STEAM_AUTH_FAILED",
            message: errorData.error?.message || "Login failed",
          },
        },
        { status: response.status },
      );
    }

    const data: LoginResponse = await response.json();

    const nextResponse = NextResponse.json({
      user: data.user,
    });

    nextResponse.cookies.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:
        parseInt(process.env.ACCESS_MAX_AGE_SECONDS || "0") || 24 * 60 * 60,
      path: "/",
    });

    nextResponse.cookies.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:
        parseInt(process.env.REFRESH_MAX_AGE_SECONDS || "0") ||
        7 * 24 * 60 * 60,
      path: "/",
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "NETWORK_ERROR",
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
      },
      { status: 500 },
    );
  }
}
