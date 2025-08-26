import { NextResponse } from "next/server";
import { steam } from "@/features/auth/lib/steam-auth";

export async function GET() {
  try {
    const redirectUrl = await steam.getRedirectUrl();
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Steam login error:", error);
    return NextResponse.json({ error: "Steam login failed" }, { status: 500 });
  }
}
