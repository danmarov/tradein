import { NextRequest, NextResponse } from "next/server";
import { steam } from "@/features/auth/lib/steam-auth";
import type {
  LoginResponse,
  SteamLoginRequest,
} from "@/features/auth/model/types";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000/api/v1";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const mockReq = {
      query,
      url: url.pathname + url.search,
      method: "GET",
      headers: Object.fromEntries(request.headers.entries()),
    };

    const steamUser = await steam.authenticate(mockReq);

    const steamLoginData: SteamLoginRequest = {
      steamId: steamUser.steamid,
      username: steamUser.username,
      avatar: steamUser.avatar.large,
      profileUrl: steamUser._json.profileurl,
    };
    console.log(steamLoginData);
    const response = await fetch(`${BACKEND_URL}/auth/steam-openid`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(steamLoginData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Backend error response:", errorText);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}?error=steam_auth_failed`,
      );
    }

    const data: LoginResponse = await response.json();

    const successUrl = `${process.env.NEXTAUTH_URL}/p2p`;
    const nextResponse = NextResponse.redirect(successUrl);

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
    console.error("Steam callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}?error=steam_callback_failed`,
    );
  }
}
