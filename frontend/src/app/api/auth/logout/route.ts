import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: "NETWORK_ERROR",
          message: "Logout failed",
        },
      },
      { status: 500 },
    );
  }
}
